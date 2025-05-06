import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  changeUserPasswordValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user.validation.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NODE_ENV, REFRESH_TOKEN_SECRET } from "../utils/env.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);

  try {
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (refreshToken) {
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { error } = registerUserValidation(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { username, email, fullName, password } = req.body;
  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new ApiError(409, "user with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      400,
      error?.details[0]?.message || "avatar faild to upload "
    );
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      400,
      error?.details[0]?.message || "coverimage failed to upload"
    );
  }
  try {
    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatar?.url,
      coverImage: coverImage?.url || "",
    });

    const registredUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!registredUser) {
      throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, registredUser, "user registred successfully"));
  } catch (error) {
    console.log("User creation failed");
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { error } = loginUserValidation(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  const { email, username, password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Failed to generate tokens");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging in the user");
  }

  const options = {
    httpOnly: true,
    secure: NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is required");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Verify if incoming refresh token matches the one we have stored
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { error } = changeUserPasswordValidation(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(400, "can't find user");
  }

  const isPaswordValid = await user.isPasswordCorrect(currentPassword);

  if (!isPaswordValid) {
    throw new ApiError(400, "current password is incorrect");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
});

const updateAcoountDetails = asyncHandler(async (req, res) => {
  const { error } = updateUserValidation(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { fullName, email, username } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        username: username.toLowerCase(),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      400,
      error?.details[0]?.message || "avatar faild to upload "
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverimage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  } catch (error) {
    console.error(error);
    throw new ApiError(
      400,
      error?.details[0]?.message || "coverimage failed to upload"
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage?.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  updateUserPassword,
  getCurrentUser,
  updateAcoountDetails,
  updateUserAvatar,
  updateUserCoverimage,
};

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserValidation } from "../validation/user.validation.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

//   if (!avatarLocalPath) {
//     throw new ApiError(400, error?.details[0]?.message || "avatar required");
//   }

//   const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
//   let coverImageResponse = "";
//   if (coverImageLocalPath) {
//     coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);
//   }

let avatar;
try {
    avatar = await uploadOnCloudinary(avatarLocalPath)
} catch (error) {
    console.error(error);
    throw new ApiError(400, error?.details[0]?.message || "avatar faild to upload ");
    
}

let coverImage;
try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath)
} catch (error) {
    console.error(error);
    throw new ApiError(400, error?.details[0]?.message || "coverimage failed to upload");
    
}
try {
    
     const user =  await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar?.url ,
        coverImage: coverImage?.url || "",   
      })
      
      const registredUser = await User.findById(user._id).select("-password -refreshToken")
      if(!registredUser)
      {
            throw new ApiError(500, "Something went wrong while registering a user")
      }
    
      return res
      .status(201)
      .json(new ApiResponse(201, registredUser, "user registred successfully"))
} catch (error) {
    console.log("User creation failed");
    if(avatar)
    {
        await deleteFromCloudinary(avatar.public_id)
    }

    if(coverImage)
    {
        await deleteFromCloudinary(coverImage.public_id)
    }

    throw new ApiError(500, "Something went wrong while registering a user and images were deleted")
}
  
});

export { registerUser };

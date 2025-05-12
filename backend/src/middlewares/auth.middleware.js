import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ACCESS_TOKEN_SECRET } from "../utils/env.js";
import { BlackListToken } from "../models/blackListToken.model.js";

const verifyJwtToken = asyncHandler(async (req, _, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Access token is required");
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await BlackListToken.findOne({ token });
    if (isBlacklisted) {
      throw new ApiError(401, "Token is no longer valid");
    }

    const verifiedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(verifiedToken?._id).select(
      "-password "
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyJwtToken };

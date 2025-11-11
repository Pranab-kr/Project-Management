import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const authToken = req.cookies?.accessToken || req.headers["authorization"];

    if (!authToken) {
      return next();
    }

    if (!authToken.startsWith("Bearer ")) {
      return new ApiError(400, "auth  header must start with Bearer");
    }

    const token = authToken.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshTokens -__v -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;

    return next();

  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
});


export const ensureAuth = asyncHandler(async (req, res, next) => {

  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  next();
});

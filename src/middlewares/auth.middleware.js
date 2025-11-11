import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let authToken = req.cookies?.accessToken || req.headers["authorization"];
    if (!authToken) {
      return next();
    }

    if (authToken.startsWith("Bearer ")) {
      authToken = authToken.split(" ")[1];
    }

    const decoded = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshTokens -__v -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};

export const ensureAuth = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required to access this resource");
  }
  next();
});

import { Router } from "express";
import {
  loginUser,
  registeruser,
  logOutUser,
  verifyEmail,
  getCurrentUser,
  resendVerificationEmail,
  refreashAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
} from "../controller/auth.controller.js";
import {
  userLoginValidation,
  userRegisterationValidation,
  userForgotPasswordValidation,
  userResetForgotPasswordValidation,
  userchangeCurrentPasswordValidation,
} from "../validation/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { ensureAuth } from "../middlewares/auth.middleware.js";

const router = Router();

//unsecured routes
router.post(
  "/register",
  userRegisterationValidation(),
  validateRequest,
  registeruser,
);

router.post("/login", userLoginValidation(), validateRequest, loginUser);

router.post("/verify-email/:token", verifyEmail);

router.post("/refresh-token", refreashAccessToken);

router.post(
  "/forgot-password",
  userForgotPasswordValidation(),
  validateRequest,
  forgotPasswordRequest,
);

router.post(
  "/reset-password/:resetToken",
  userResetForgotPasswordValidation(),
  validateRequest,
  resetForgotPassword,
);

//secured routes
router.post("/logout", ensureAuth, logOutUser);

router.post("/resend-verification-email", ensureAuth, resendVerificationEmail);

router.get("/current-user", ensureAuth, getCurrentUser);

router.post(
  "/change-password",
  ensureAuth,
  userchangeCurrentPasswordValidation(),
  validateRequest,
  changeCurrentPassword,
);

export default router;

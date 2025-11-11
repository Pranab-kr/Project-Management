import { Router } from "express";
import { loginUser, registeruser, logOutUser } from "../controller/auth.controller.js";
import {
  userLoginValidation,
  userRegisterationValidation,
} from "../validation/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { ensureAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  userRegisterationValidation(),
  validateRequest,
  registeruser,
);

router.post("/login", userLoginValidation(), validateRequest, loginUser);

//sequre route for logout
router.post("/logout", ensureAuth, logOutUser);

export default router;

import { Router } from "express";
import { loginUser, registeruser } from "../controller/auth.controller.js";
import {
  userLoginValidation,
  userRegisterationValidation,
} from "../validation/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

const router = Router();

router.post(
  "/register",
  userRegisterationValidation(),
  validateRequest,
  registeruser,
);

router.post("/login", userLoginValidation(), validateRequest, loginUser);

export default router;

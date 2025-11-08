import { Router } from "express";
import { registeruser } from "../controller/auth.controller.js";
import { userRegisterationValidation } from "../validation/index.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

const router = Router();

router.post(
  "/register",
  userRegisterationValidation(),
  validateRequest,
  registeruser,
);

export default router;

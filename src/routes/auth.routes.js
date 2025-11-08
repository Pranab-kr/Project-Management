import { Router } from "express";
import { registeruser } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", registeruser);

export default router;

import { healthCheck } from "../controller/helthcheck.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", healthCheck);

export default router;

import { Router } from "express";
import {registerAdmin } from "./admin.controller.js";

const router = Router();


router.post("/register", registerAdmin);
// router.post("/me");

export default router;
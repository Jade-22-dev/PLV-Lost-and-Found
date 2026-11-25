import { Router } from "express";
import { loginAdmin, registerAdmin } from "./admin.controller.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
// router.post("/me");

export default router;
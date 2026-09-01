import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);

// IMPORTANT
router.put("/reset-password/:token", resetPassword);

// Profile & security
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;
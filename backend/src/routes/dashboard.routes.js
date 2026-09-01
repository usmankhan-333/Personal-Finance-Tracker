import express from "express";
import { protect } from "../middleware/auth.js";
import { getSummary, getByCategory, getMonthlyTrend } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(protect);

router.get("/summary", getSummary);
router.get("/by-category", getByCategory);
router.get("/monthly-trend", getMonthlyTrend);

export default router;
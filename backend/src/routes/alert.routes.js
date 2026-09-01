import express from "express";

import {
  checkBudgetAlerts,
  checkAllBudgetAlerts,
  getAlerts,
} from "../controllers/alert.controller.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/check/:budgetId",
  protect,
  checkBudgetAlerts
);

router.get(
  "/check-all",
  protect,
  checkAllBudgetAlerts
);

router.get(
  "/",
  protect,
  getAlerts
);

export default router;
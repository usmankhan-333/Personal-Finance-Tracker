import express from "express";
import { exportTransactionsCSV, exportTransactionsPDF } from "../controllers/export.controller.js";

const router = express.Router();

router.get("/csv", exportTransactionsCSV);
router.get("/pdf", exportTransactionsPDF);

export default router;
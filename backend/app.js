import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import db from "./src/config/db.js";
import router from "./src/routes/auth.routes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import categoryRoutes from "./src/routes/category.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import budgetRoutes from "./src/routes/budget.routes.js";
import alertRoutes from "./src/routes/alert.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import exportRoutes from "./src/routes/export.routes.js";
db();


const app = express();
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", router);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);


// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

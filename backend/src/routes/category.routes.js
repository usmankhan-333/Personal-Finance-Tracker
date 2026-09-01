import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getCategories)
  .post(validate(createCategorySchema), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(validate(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default router;
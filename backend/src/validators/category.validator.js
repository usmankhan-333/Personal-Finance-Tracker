import { z } from "zod";

const categoryType = z.enum(["income", "expense"], {
  errorMap: () => ({
    message: "Type must be either income or expense.",
  }),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(50, "Category name cannot be longer than 50 characters."),

  type: categoryType,
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(50, "Category name cannot be longer than 50 characters.")
    .optional(),

  type: categoryType.optional(),
});
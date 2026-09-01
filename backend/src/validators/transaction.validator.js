import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: "Type must be 'income' or 'expense'" }),
  }),
  category: z.string().min(1, 'Category is required'),
  note: z.string().trim().optional(),
  date: z.string().optional(), // ISO date string, optional — defaults to now
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  note: z.string().trim().optional(),
  date: z.string().optional(),
});
import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.validator.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validate(createTransactionSchema), createTransaction)
  .get(getTransactions);

router.route('/:id')
  .get(getTransaction)
  .put(validate(updateTransactionSchema), updateTransaction)
  .delete(deleteTransaction);

export default router;
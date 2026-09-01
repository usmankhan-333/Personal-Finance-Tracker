import Transaction from "../models/transaction.js";
import Category from "../models/category.js";
import Budget from "../models/budget.js";
import Alert from "../models/alert.js";
import asyncHandler from "../middleware/asyncHandler.js";

// =========================
// Get Budget Period Start
// =========================

const getPeriodStart = (period) => {
  const now = new Date();

  if (period === "weekly") {
    const startDate = new Date(now);

    const day = startDate.getDay();

    startDate.setDate(
      startDate.getDate() - day
    );

    startDate.setHours(0, 0, 0, 0);

    return startDate;
  }

  if (period === "monthly") {
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
  }

  if (period === "yearly") {
    return new Date(
      now.getFullYear(),
      0,
      1
    );
  }

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );
};

// =========================
// Check User Budget Alerts
// =========================

const checkUserBudgetAlerts = async (userId) => {
  try {
    const budgets = await Budget.find({
      user: userId,
    });

    for (const budget of budgets) {
      const startDate = getPeriodStart(
        budget.period
      );

      // =========================
      // Build Transaction Filter
      // =========================

      const transactionFilter = {
        user: userId,
        type: "expense",
        date: {
          $gte: startDate,
        },
      };

      // Category-specific budget
      if (budget.category) {
        transactionFilter.category =
          budget.category;
      }

      // =========================
      // Get Current Spending
      // =========================

      const transactions =
        await Transaction.find(
          transactionFilter
        );

      const totalSpent =
        transactions.reduce(
          (total, transaction) => {
            return (
              total +
              Number(
                transaction.amount || 0
              )
            );
          },
          0
        );

      const budgetAmount =
        Number(
          budget.amount || 0
        );

      if (budgetAmount <= 0) {
        continue;
      }

      const percentUsed =
        (totalSpent / budgetAmount) *
        100;

      // =========================
      // Determine Current Thresholds
      // =========================

      const currentThresholds = [];

      if (percentUsed >= 80) {
        currentThresholds.push(80);
      }

      if (percentUsed >= 100) {
        currentThresholds.push(100);
      }

      // =========================
      // Reset Old Alerts
      // =========================
      //
      // Example:
      //
      // Spending was 80%
      // -> 80% alert created
      //
      // Transaction deleted
      // -> spending becomes 40%
      //
      // The old 80% alert is removed.
      //
      // If spending later reaches 80%
      // again, a fresh alert is created.
      //
      // =========================

      const oldAlerts =
        await Alert.find({
          user: userId,
          budget: budget._id,
          createdAt: {
            $gte: startDate,
          },
        });

      for (const alert of oldAlerts) {
        const alertThreshold =
          Number(
            alert.thresholdPercent
          );

        if (
          !currentThresholds.includes(
            alertThreshold
          )
        ) {
          await Alert.deleteOne({
            _id: alert._id,
          });

          console.log(
            `Budget alert reset: ${alertThreshold}%`
          );
        }
      }

      // =========================
      // Create Missing Alerts
      // =========================

      for (const threshold of currentThresholds) {
        const existingAlert =
          await Alert.findOne({
            user: userId,
            budget: budget._id,
            thresholdPercent:
              threshold,
            createdAt: {
              $gte: startDate,
            },
          });

        if (existingAlert) {
          continue;
        }

        // =========================
        // Alert Message
        // =========================

        let message;

        if (threshold === 100) {
          message =
            `You have reached or exceeded your budget limit of Rs. ${budgetAmount.toLocaleString()}.`;
        } else {
          message =
            `You have used ${percentUsed.toFixed(0)}% of your budget.`;
        }

        // =========================
        // Create Alert
        // =========================

        const alert =
          await Alert.create({
            user: userId,
            budget: budget._id,
            thresholdPercent:
              threshold,
            message,
          });

        console.log(
          `New budget alert created: ${threshold}%`
        );

        console.log(
          `Alert ID: ${alert._id}`
        );
      }
    }
  } catch (error) {
    /*
      Alert checking should never
      prevent transaction operations.
    */

    console.error(
      "Budget alert check failed:",
      error
    );
  }
};

// =========================
// Create Transaction
// =========================

// POST /api/transactions

export const createTransaction =
  asyncHandler(async (req, res) => {
    const {
      amount,
      type,
      category,
      note,
      date,
    } = req.body;

    // =========================
    // Verify Category
    // =========================

    const categoryExists =
      await Category.findOne({
        _id: category,
        user: req.user._id,
      });

    if (!categoryExists) {
      res.status(404);

      throw new Error(
        "Category not found"
      );
    }

    // =========================
    // Create Transaction
    // =========================

    const transaction =
      await Transaction.create({
        amount,
        type,
        category,
        note,
        date,
        user: req.user._id,
      });

    // =========================
    // Check Budget Alerts
    // =========================

    if (type === "expense") {
      await checkUserBudgetAlerts(
        req.user._id
      );
    }

    // =========================
    // Response
    // =========================

    res.status(201).json({
      success: true,
      data: transaction,
    });
  });

// =========================
// Get All Transactions
// =========================

// GET /api/transactions

export const getTransactions =
  asyncHandler(async (req, res) => {
    const {
      type,
      category,
      startDate,
      endDate,
      sortBy = "date",
      order = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      user: req.user._id,
    };

    // =========================
    // Type Filter
    // =========================

    if (type) {
      query.type = type;
    }

    // =========================
    // Category Filter
    // =========================

    if (category) {
      query.category = category;
    }

    // =========================
    // Date Filter
    // =========================

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte =
          new Date(startDate);
      }

      if (endDate) {
        query.date.$lte =
          new Date(endDate);
      }
    }

    // =========================
    // Sorting
    // =========================

    const sortOrder =
      order === "asc" ? 1 : -1;

    // =========================
    // Pagination
    // =========================

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const [
      transactions,
      total,
    ] = await Promise.all([
      Transaction.find(query)
        .populate(
          "category",
          "name type"
        )
        .sort({
          [sortBy]: sortOrder,
        })
        .skip(skip)
        .limit(Number(limit)),

      Transaction.countDocuments(
        query
      ),
    ]);

    // =========================
    // Response
    // =========================

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      pages: Math.ceil(
        total / Number(limit)
      ),
      data: transactions,
    });
  });

// =========================
// Get Single Transaction
// =========================

// GET /api/transactions/:id

export const getTransaction =
  asyncHandler(async (req, res) => {
    const transaction =
      await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      }).populate(
        "category",
        "name type"
      );

    if (!transaction) {
      res.status(404);

      throw new Error(
        "Transaction not found"
      );
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  });

// =========================
// Update Transaction
// =========================

// PUT /api/transactions/:id

export const updateTransaction =
  asyncHandler(async (req, res) => {
    let transaction =
      await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!transaction) {
      res.status(404);

      throw new Error(
        "Transaction not found"
      );
    }

    // =========================
    // Verify Category
    // =========================

    if (req.body.category) {
      const categoryExists =
        await Category.findOne({
          _id: req.body.category,
          user: req.user._id,
        });

      if (!categoryExists) {
        res.status(404);

        throw new Error(
          "Category not found"
        );
      }
    }

    // =========================
    // Update Transaction
    // =========================

    transaction =
      await Transaction.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "category",
        "name type"
      );

    // =========================
    // Recalculate Budget Alerts
    // =========================
    //
    // This is important because an
    // update can:
    //
    // - increase spending
    // - decrease spending
    // - change expense to income
    // - change income to expense
    // - change category
    //
    // =========================

    await checkUserBudgetAlerts(
      req.user._id
    );

    // =========================
    // Response
    // =========================

    res.status(200).json({
      success: true,
      data: transaction,
    });
  });

// =========================
// Delete Transaction
// =========================

// DELETE /api/transactions/:id

export const deleteTransaction =
  asyncHandler(async (req, res) => {
    const transaction =
      await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!transaction) {
      res.status(404);

      throw new Error(
        "Transaction not found"
      );
    }

    // =========================
    // Delete Transaction
    // =========================

    await transaction.deleteOne();

    // =========================
    // Recalculate Budget Alerts
    // =========================
    //
    // If deleting this transaction
    // causes spending to fall below
    // 80% or 100%, the corresponding
    // old alert is removed.
    //
    // When spending crosses the
    // threshold again later, a new
    // notification will be created.
    //
    // =========================

    await checkUserBudgetAlerts(
      req.user._id
    );

    // =========================
    // Response
    // =========================

    res.status(200).json({
      success: true,
      message:
        "Transaction deleted",
      data: {},
    });
  });
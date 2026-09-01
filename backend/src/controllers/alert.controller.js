import Budget from "../models/budget.js";
import Transaction from "../models/transaction.js";
import Alert from "../models/alert.js";

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
// Check Single Budget Alert
// =========================

const checkBudgetAlerts = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findOne({
      _id: budgetId,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    const startDate = getPeriodStart(
      budget.period
    );

    const transactionFilter = {
      user: req.user._id,
      type: "expense",
      date: {
        $gte: startDate,
      },
    };

    // Category-specific budget
    if (budget.category) {
      transactionFilter.category =
        typeof budget.category === "object"
          ? budget.category._id
          : budget.category;
    }

    const transactions =
      await Transaction.find(
        transactionFilter
      );

    const totalSpent = transactions.reduce(
      (total, transaction) => {
        return (
          total +
          Number(transaction.amount || 0)
        );
      },
      0
    );

    const budgetAmount =
      Number(budget.amount || 0);

    const percentUsed =
      budgetAmount > 0
        ? (totalSpent / budgetAmount) * 100
        : 0;

    // =========================
    // Determine Threshold
    // =========================

    let thresholdHit = null;

    if (percentUsed >= 100) {
      thresholdHit = 100;
    } else if (percentUsed >= 80) {
      thresholdHit = 80;
    }

    let alertCreated = null;

    // =========================
    // Create Alert
    // =========================

    if (thresholdHit !== null) {
      const existingAlert =
        await Alert.findOne({
          user: req.user._id,
          budget: budget._id,
          thresholdPercent: thresholdHit,
          createdAt: {
            $gte: startDate,
          },
        });

      if (!existingAlert) {
        let message;

        if (thresholdHit === 100) {
          message =
            `You have exceeded your budget limit of Rs. ${budgetAmount.toLocaleString()}.`;
        } else {
          message =
            `You have used ${percentUsed.toFixed(0)}% of your budget.`;
        }

        alertCreated =
          await Alert.create({
            user: req.user._id,
            budget: budget._id,
            thresholdPercent:
              thresholdHit,
            message,
          });
      }
    }

    return res.status(200).json({
      success: true,
      totalSpent,
      budgetAmount,
      percentUsed: Number(
        percentUsed.toFixed(1)
      ),
      thresholdHit,
      alertCreated,
      alertAlreadyExisted:
        thresholdHit !== null &&
        !alertCreated,
    });
  } catch (error) {
    console.error(
      "Check budget alert error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to check budget alert.",
    });
  }
};

// =========================
// Check All User Budgets
// =========================

const checkAllBudgetAlerts = async (
  req,
  res
) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
    });

    const results = [];

    for (const budget of budgets) {
      const startDate = getPeriodStart(
        budget.period
      );

      const transactionFilter = {
        user: req.user._id,
        type: "expense",
        date: {
          $gte: startDate,
        },
      };

      if (budget.category) {
        transactionFilter.category =
          typeof budget.category === "object"
            ? budget.category._id
            : budget.category;
      }

      const transactions =
        await Transaction.find(
          transactionFilter
        );

      const totalSpent =
        transactions.reduce(
          (total, transaction) =>
            total +
            Number(transaction.amount || 0),
          0
        );

      const budgetAmount =
        Number(budget.amount || 0);

      const percentUsed =
        budgetAmount > 0
          ? (totalSpent / budgetAmount) * 100
          : 0;

      let thresholdHit = null;

      if (percentUsed >= 100) {
        thresholdHit = 100;
      } else if (percentUsed >= 80) {
        thresholdHit = 80;
      }

      let alertCreated = null;

      if (thresholdHit !== null) {
        const existingAlert =
          await Alert.findOne({
            user: req.user._id,
            budget: budget._id,
            thresholdPercent:
              thresholdHit,
            createdAt: {
              $gte: startDate,
            },
          });

        if (!existingAlert) {
          let message;

          if (thresholdHit === 100) {
            message =
              `You have exceeded your budget limit of Rs. ${budgetAmount.toLocaleString()}.`;
          } else {
            message =
              `You have used ${percentUsed.toFixed(0)}% of your budget.`;
          }

          alertCreated =
            await Alert.create({
              user: req.user._id,
              budget: budget._id,
              thresholdPercent:
                thresholdHit,
              message,
            });
        }
      }

      results.push({
        budgetId: budget._id,
        totalSpent,
        budgetAmount,
        percentUsed: Number(
          percentUsed.toFixed(1)
        ),
        thresholdHit,
        alertCreated,
      });
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(
      "Check all budget alerts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to check budget alerts.",
    });
  }
};

// =========================
// Get User Alerts
// =========================

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      user: req.user._id,
    })
      .populate(
        "budget",
        "amount period category"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error(
      "Get alerts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch alerts.",
    });
  }
};

export {
  checkBudgetAlerts,
  checkAllBudgetAlerts,
  getAlerts,
};
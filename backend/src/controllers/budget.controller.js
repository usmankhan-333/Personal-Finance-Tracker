import Budget from "../models/budget.js";
import Category from "../models/category.js";

const createBudget = async (req, res) => {
  try {
    const { category, amount, period, month, year } = req.body;

    if (!amount || !period) {
      return res.status(400).json({
        success: false,
        message: "Amount and period are required.",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be greater than 0.",
      });
    }

    if (!["weekly", "monthly", "yearly"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid budget period.",
      });
    }

    if (category) {
      const categoryExists = await Category.findOne({
        _id: category,
        user: req.user._id,
      });

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
    }

    const budget = await Budget.create({
      user: req.user._id,
      category: category || null,
      amount: Number(amount),
      period,
      month: month || undefined,
      year: year || undefined,
    });

    const populatedBudget = await Budget.findById(budget._id).populate(
      "category",
      "name type"
    );

    res.status(201).json({
      success: true,
      data: populatedBudget,
    });
  } catch (error) {
    console.error("Create budget error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create budget.",
    });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
    })
      .populate("category", "name type")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error("Get budgets error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch budgets.",
    });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, period, month, year } = req.body;

    const budget = await Budget.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Budget amount must be greater than 0.",
        });
      }

      budget.amount = Number(amount);
    }

    if (period !== undefined) {
      if (!["weekly", "monthly", "yearly"].includes(period)) {
        return res.status(400).json({
          success: false,
          message: "Invalid budget period.",
        });
      }

      budget.period = period;
    }

    if (category !== undefined) {
      if (category) {
        const categoryExists = await Category.findOne({
          _id: category,
          user: req.user._id,
        });

        if (!categoryExists) {
          return res.status(404).json({
            success: false,
            message: "Category not found.",
          });
        }

        budget.category = category;
      } else {
        budget.category = null;
      }
    }

    if (month !== undefined) {
      budget.month = month || undefined;
    }

    if (year !== undefined) {
      budget.year = year || undefined;
    }

    await budget.save();

    const updatedBudget = await Budget.findById(budget._id).populate(
      "category",
      "name type"
    );

    res.status(200).json({
      success: true,
      data: updatedBudget,
    });
  } catch (error) {
    console.error("Update budget error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update budget.",
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully.",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete budget.",
    });
  }
};

export {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};
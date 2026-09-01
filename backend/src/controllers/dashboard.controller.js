import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import Category from "../models/category.js";

const getSummary = async (req, res) => {
  try {
    const user = req.user._id;

    const transactions = await Transaction.find({ user });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else if (t.type === "expense") {
        totalExpense += t.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({ success: true, totalIncome, totalExpense, balance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByCategory = async (req, res) => {
  try {
    const user = req.user._id;

    const results = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(user), type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const populated = await Promise.all(
      results.map(async (r) => {
        const category = await Category.findById(r._id);
        return {
          category: category ? category.name : "Unknown",
          total: r.total,
        };
      })
    );

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyTrend = async (req, res) => {
  try {
    const user = req.user._id;

    const results = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(user), type: "expense" } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const formatted = results.map((r) => ({
      year: r._id.year,
      month: r._id.month,
      monthName: monthNames[r._id.month - 1],
      total: r.total,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getSummary, getByCategory, getMonthlyTrend };
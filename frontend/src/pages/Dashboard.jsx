import { useMemo } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useTransactions } from "../context/TransactionContext";

const CATEGORY_COLORS = [
  "#2563eb",
  "#f97316",
  "#dc2626",
  "#16a34a",
  "#9333ea",
  "#0891b2",
];

function Dashboard() {
  const { transactions, categories, transactionSummary } = useTransactions();

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const getCategoryName = (category) => {
    if (!category) {
      return "Uncategorized";
    }

    if (typeof category === "object") {
      return category.name || "Uncategorized";
    }

    const match = categories.find((item) => item._id === category);

    return match?.name || "Uncategorized";
  };

  const getTransactionDescription = (transaction) => {
    return transaction.description || transaction.note || "No description";
  };

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      if (Number.isNaN(transactionDate.getTime())) {
        return false;
      }

      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    });
  }, [transactions]);

  const monthlyIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  }, [currentMonthTransactions]);

  const monthlyExpenses = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);
  }, [currentMonthTransactions]);

  const categorySummary = useMemo(() => {
    const categoryTotals = {};

    currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const categoryName = getCategoryName(transaction.category);

        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = 0;
        }

        categoryTotals[categoryName] += Number(transaction.amount || 0);
      });

    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [currentMonthTransactions, categories]);

  const maxCategoryAmount =
    categorySummary.length > 0
      ? Math.max(...categorySummary.map(([, amount]) => amount))
      : 0;

  const chartData = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dailyExpenses = transactions
        .filter((transaction) => {
          if (transaction.type !== "expense") {
            return false;
          }

          const transactionDate = new Date(transaction.date);

          if (Number.isNaN(transactionDate.getTime())) {
            return false;
          }

          return transactionDate.toISOString().split("T")[0] === dateString;
        })
        .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

      days.push({
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        dateLabel: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: dailyExpenses,
      });
    }

    return days;
  }, [transactions]);

  const maxChartAmount = Math.max(...chartData.map((item) => item.amount), 1);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="page-content dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your financial overview.</p>
        </div>

        <Link to="/transactions" className="dashboard-add-button">
          + Add Transaction
        </Link>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Balance</span>
            <div className="summary-icon balance-summary-icon">Rs</div>
          </div>

          <h2
            className={
              transactionSummary.currentBalance >= 0
                ? "summary-balance-positive"
                : "summary-balance-negative"
            }
          >
            {formatCurrency(transactionSummary.currentBalance)}
          </h2>

          <p className="summary-description">Current available balance</p>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Income</span>
            <div className="summary-icon income-summary-icon">↑</div>
          </div>

          <h2 className="summary-income">
            {formatCurrency(transactionSummary.totalIncome)}
          </h2>

          <p className="summary-description">All recorded income</p>
        </div>

        <div className="summary-card">
          <div className="summary-card-top">
            <span className="summary-label">Total Expenses</span>
            <div className="summary-icon expense-summary-icon">↓</div>
          </div>

          <h2 className="summary-expense">
            {formatCurrency(transactionSummary.totalExpenses)}
          </h2>

          <p className="summary-description">All recorded expenses</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Weekly Overview</h2>
              <p>Expenses from the last 7 days</p>
            </div>

            <span className="card-header-badge">This Week</span>
          </div>

          <div className="overview-chart">
            {chartData.map((item, index) => {
              const height =
                item.amount === 0
                  ? 4
                  : Math.max((item.amount / maxChartAmount) * 100, 8);

              return (
                <div
                  className="chart-column"
                  key={`${item.label}-${index}`}
                  title={`${item.dateLabel}: ${formatCurrency(item.amount)}`}
                >
                  <div className="chart-value">
                    {item.amount > 0 ? item.amount.toLocaleString() : ""}
                  </div>

                  <div className="chart-bar-wrapper">
                    <div
                      className={`chart-bar${item.amount === 0 ? " chart-bar-empty" : ""}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <span className="chart-label">
                    {item.label}
                    <br />
                    <span className="chart-label-date">{item.dateLabel}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="monthly-statistics">
            <div className="monthly-stat monthly-stat-income">
              <span className="monthly-stat-icon">↑</span>
              <div>
                <span>Income this month</span>
                <strong className="monthly-income">{formatCurrency(monthlyIncome)}</strong>
              </div>
            </div>

            <div className="monthly-stat monthly-stat-expense">
              <span className="monthly-stat-icon">↓</span>
              <div>
                <span>Expenses this month</span>
                <strong className="monthly-expense">{formatCurrency(monthlyExpenses)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card dashboard-category-card">
          <div className="card-header dashboard-category-card-header">
            <div>
              <h2>Spending by Category</h2>
              <p>Where your money is going this month</p>
            </div>

            {categorySummary.length > 0 && (
              <span className="dashboard-category-count">
                {categorySummary.length}
                {categorySummary.length === 1 ? " category" : " categories"}
              </span>
            )}
          </div>

          {categorySummary.length > 0 ? (
            <div className="dashboard-category-list">
              {categorySummary.map(([category, amount], index) => {
                const percentage =
                  maxCategoryAmount > 0 ? (amount / maxCategoryAmount) * 100 : 0;

                const shareOfTotal =
                  monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0;

                const dotColor = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                return (
                  <div className="dashboard-category-item" key={category}>
                    <div className="dashboard-category-top">
                      <div className="dashboard-category-name-wrapper">
                        <span
                          className="dashboard-category-dot"
                          style={{ backgroundColor: dotColor }}
                        />
                        <span className="dashboard-category-name" title={category}>
                          {category}
                        </span>
                      </div>

                      <span className="dashboard-category-amount">
                        {formatCurrency(amount)}
                      </span>
                    </div>

                    <div className="dashboard-category-progress-row">
                      <div className="dashboard-category-progress">
                        <div
                          className="dashboard-category-progress-fill"
                          style={{ width: `${percentage}%`, backgroundColor: dotColor }}
                        />
                      </div>

                      <span
                        className="dashboard-category-percentage"
                        style={{ color: dotColor }}
                      >
                        {shareOfTotal.toFixed(0)}%
                        <span> of expenses</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <div className="empty-state-icon">✨</div>
              <h3>No expenses yet</h3>
              <p>Add an expense to see your spending by category.</p>
              <Link to="/transactions">Add Transaction</Link>
            </div>
          )}

          {categorySummary.length > 0 && (
            <div className="dashboard-category-total">
              <div>
                <span>Total expenses</span>
                <small>This month</small>
              </div>
              <strong>{formatCurrency(monthlyExpenses)}</strong>
            </div>
          )}
        </section>
      </div>

      <section className="dashboard-card transactions-card">
        <div className="card-header">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your latest financial activity</p>
          </div>

          <Link to="/transactions">View all →</Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="dashboard-transactions-table">
            <div className="dashboard-transaction-row dashboard-transaction-heading">
              <span>Date</span>
              <span>Description</span>
              <span>Category</span>
              <span>Type</span>
              <span>Amount</span>
            </div>

            {recentTransactions.map((transaction) => (
              <div className="dashboard-transaction-row" key={transaction._id}>
                <span className="dashboard-transaction-date">
                  {formatDate(transaction.date)}
                </span>

                <span className="dashboard-transaction-description">
                  {getTransactionDescription(transaction)}
                </span>

                <span className="dashboard-transaction-category">
                  {getCategoryName(transaction.category)}
                </span>

                <span>
                  <span className={`dashboard-transaction-type ${transaction.type}`}>
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </span>
                </span>

                <span
                  className={`dashboard-transaction-amount ${
                    transaction.type === "income" ? "amount-positive" : "amount-negative"
                  }`}
                >
                  <span className="amount-sign">
                    {transaction.type === "income" ? "+" : "-"}
                  </span>
                  <span className="amount-value">{formatCurrency(transaction.amount)}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-transactions">
            <h3>No transactions yet</h3>
            <p>Start tracking your finances by adding your first transaction.</p>
            <Link to="/transactions">+ Add Transaction</Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
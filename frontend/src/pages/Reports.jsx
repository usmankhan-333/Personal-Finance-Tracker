import { useEffect, useState } from "react";
import "./Reports.css";

const API_URL = import.meta.env.VITE_API_URL;

const CATEGORY_COLORS = [
  "#2563eb",
  "#f97316",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#0891b2",
  "#eab308",
  "#ec4899",
];

function Reports() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchReportsData = async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/summary`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_URL}/dashboard/by-category`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_URL}/dashboard/monthly-trend`, {
          headers: getAuthHeaders(),
        }),
      ]);

      const summaryJson = await summaryRes.json();
      const categoryJson = await categoryRes.json();
      const monthlyJson = await monthlyRes.json();

      if (!summaryRes.ok) {
        throw new Error(
          summaryJson.message || "Failed to load summary."
        );
      }

      if (!categoryRes.ok) {
        throw new Error(
          categoryJson.message || "Failed to load category data."
        );
      }

      if (!monthlyRes.ok) {
        throw new Error(
          monthlyJson.message || "Failed to load monthly data."
        );
      }

      setSummary(summaryJson);
      setCategoryData(categoryJson.data || []);
      setMonthlyData(monthlyJson.data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setError(error.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  const formatAmount = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const handleExportCSV = () => {
    window.open(
      `${API_URL}/export/csv?token=${getToken()}`,
      "_blank"
    );
  };

  const handleExportPDF = () => {
    window.open(
      `${API_URL}/export/pdf?token=${getToken()}`,
      "_blank"
    );
  };

  const totalCategoryExpenses = categoryData.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );

  const maxCategoryAmount = Math.max(
    ...categoryData.map((item) => Number(item.total || 0)),
    1
  );

  /*
   * Build the donut chart using conic-gradient.
   *
   * Each category gets a section based on its percentage
   * of total expenses.
   */
  const getDonutBackground = () => {
    if (!categoryData.length || totalCategoryExpenses <= 0) {
      return "#e5e7eb";
    }

    let currentPercentage = 0;

    const segments = categoryData.map((item, index) => {
      const percentage =
        (Number(item.total || 0) / totalCategoryExpenses) * 100;

      const start = currentPercentage;
      const end = currentPercentage + percentage;

      currentPercentage = end;

      return `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} ${start}% ${end}%`;
    });

    return `conic-gradient(${segments.join(", ")})`;
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p>
              Analyze your income, expenses, and spending patterns.
            </p>
          </div>
        </div>

        <div className="reports-loading">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* =========================
          Reports Header
      ========================= */}

      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>
            Analyze your income, expenses, and spending patterns.
          </p>
        </div>

        <div className="reports-actions">
          <button
            type="button"
            className="export-button"
            onClick={handleExportCSV}
          >
            Export CSV
          </button>

          <button
            type="button"
            className="export-button"
            onClick={handleExportPDF}
          >
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="reports-error">
          {error}
        </div>
      )}

      {/* =========================
          Summary Cards
      ========================= */}

      <div className="report-summary">
        <div className="report-summary-card">
          <div className="summary-card-label">
            <span>Total Income</span>

            <span className="summary-card-icon income-icon">
              ↑
            </span>
          </div>

          <strong className="income-value">
            {formatAmount(summary.totalIncome)}
          </strong>

          <p>All recorded income</p>
        </div>

        <div className="report-summary-card">
          <div className="summary-card-label">
            <span>Total Expenses</span>

            <span className="summary-card-icon expense-icon">
              ↓
            </span>
          </div>

          <strong className="expense-value">
            {formatAmount(summary.totalExpense)}
          </strong>

          <p>All recorded expenses</p>
        </div>

        <div className="report-summary-card">
          <div className="summary-card-label">
            <span>Total Savings</span>

            <span className="summary-card-icon savings-icon">
              Rs
            </span>
          </div>

          <strong className="savings-value">
            {formatAmount(summary.balance)}
          </strong>

          <p>Income minus expenses</p>
        </div>
      </div>

      {/* =========================
          Main Reports
      ========================= */}

      <div className="reports-grid">
        {/* =========================
            Expenses by Category
        ========================= */}

        <section className="report-card category-report-card">
          <div className="report-card-header">
            <div>
              <h2>Expenses by Category</h2>

              <p>
                See how your expenses are distributed
              </p>
            </div>

            {categoryData.length > 0 && (
              <span className="report-badge">
                {categoryData.length}{" "}
                {categoryData.length === 1
                  ? "category"
                  : "categories"}
              </span>
            )}
          </div>

          {categoryData.length > 0 ? (
            <div className="category-list">
              {categoryData.map((item, index) => {
                const amount = Number(item.total || 0);

                const percentage =
                  totalCategoryExpenses > 0
                    ? (amount / totalCategoryExpenses) * 100
                    : 0;

                const barPercentage =
                  maxCategoryAmount > 0
                    ? (amount / maxCategoryAmount) * 100
                    : 0;

                const categoryColor =
                  CATEGORY_COLORS[
                    index % CATEGORY_COLORS.length
                  ];

                return (
                  <div
                    className="category-row"
                    key={item.category}
                  >
                    <div className="category-info">
                      <div className="category-name-wrapper">
                        <span
                          className="category-dot"
                          style={{
                            backgroundColor: categoryColor,
                            boxShadow: `0 0 0 4px ${categoryColor}18`,
                          }}
                        ></span>

                        <span
                          className="category-name"
                          title={item.category}
                        >
                          {item.category}
                        </span>
                      </div>

                      <div className="category-amount-wrapper">
                        <strong>
                          {formatAmount(amount)}
                        </strong>

                        <span
                          className="category-percentage"
                          style={{
                            backgroundColor: `${categoryColor}12`,
                            color: categoryColor,
                          }}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="category-bar">
                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${barPercentage}%`,
                          background: `linear-gradient(
                            90deg,
                            ${categoryColor},
                            ${categoryColor}b8
                          )`,
                        }}
                      ></div>
                    </div>

                    <div className="category-footer">
                      <span>
                        {index === 0
                          ? "Highest spending"
                          : "Category spending"}
                      </span>

                      <span>
                        {percentage.toFixed(1)}% of expenses
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="report-empty-state">
              <div className="report-empty-icon">
                ✨
              </div>

              <h3>No expense data yet</h3>

              <p>
                Add some expenses to see your category
                breakdown.
              </p>
            </div>
          )}
        </section>

        {/* =========================
            Expense Distribution
        ========================= */}

        <section className="report-card distribution-card">
          <div className="report-card-header">
            <div>
              <h2>Expense Distribution</h2>

              <p>
                Visual breakdown of your spending
              </p>
            </div>
          </div>

          {categoryData.length > 0 &&
          totalCategoryExpenses > 0 ? (
            <>
              <div className="donut-wrapper">
                <div
                  className="donut-chart"
                  style={{
                    background: getDonutBackground(),
                  }}
                >
                  <div className="donut-center">
                    <span>Total Expenses</span>

                    <strong>
                      {formatAmount(totalCategoryExpenses)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="donut-legend">
                {categoryData.map((item, index) => {
                  const amount = Number(item.total || 0);

                  const percentage =
                    totalCategoryExpenses > 0
                      ? (amount / totalCategoryExpenses) * 100
                      : 0;

                  const categoryColor =
                    CATEGORY_COLORS[
                      index % CATEGORY_COLORS.length
                    ];

                  return (
                    <div
                      className="legend-item"
                      key={item.category}
                    >
                      <div className="legend-category">
                        <span
                          className="legend-dot"
                          style={{
                            backgroundColor: categoryColor,
                          }}
                        ></span>

                        <span
                          className="legend-name"
                          title={item.category}
                        >
                          {item.category}
                        </span>
                      </div>

                      <div className="legend-values">
                        <strong>
                          {formatAmount(amount)}
                        </strong>

                        <span
                          style={{
                            color: categoryColor,
                          }}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="report-empty-state">
              <div className="report-empty-icon">
                ◯
              </div>

              <h3>No expense data yet</h3>

              <p>
                Your expense distribution will appear
                here once you add transactions.
              </p>
            </div>
          )}
        </section>

        {/* =========================
            Monthly Overview
        ========================= */}

        <section className="report-card monthly-report-card">
          <div className="report-card-header">
            <div>
              <h2>Monthly Overview</h2>

              <p>
                Expense trend by month
              </p>
            </div>
          </div>

          <div className="monthly-list">
            {monthlyData.length > 0 ? (
              monthlyData.map((item) => (
                <div
                  className="monthly-row"
                  key={`${item.year}-${item.month}`}
                >
                  <div className="monthly-month">
                    {item.monthName}
                  </div>

                  <div className="monthly-values">
                    <span className="monthly-expense">
                      - {formatAmount(item.total)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="monthly-empty">
                <p>No monthly data yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;
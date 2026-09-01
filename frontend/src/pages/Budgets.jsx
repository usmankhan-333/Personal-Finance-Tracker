import {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Budgets.css";

import { useTransactions } from "../context/TransactionContext";
import { useBudgets } from "../context/BudgetContext";
import { useAlerts } from "../context/AlertContext";

function Budgets() {
  const {
    transactions,
    categories,
    loading: transactionLoading,
  } = useTransactions();

  const {
    budgets,
    loading,
    error: contextError,
    createBudget,
    updateBudget,
    deleteBudget,
  } = useBudgets();

  const { checkBudgetAlert } = useAlerts();

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] =
    useState(null);

  const [budgetToDelete, setBudgetToDelete] =
    useState(null);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
  });

  const error = formError || contextError;

  // =========================
  // Date Helpers
  // =========================

  const getStartOfWeek = () => {
    const now = new Date();

    const start = new Date(now);
    const day = start.getDay();

    start.setDate(
      start.getDate() - day
    );

    start.setHours(0, 0, 0, 0);

    return start;
  };

  const getStartOfMonth = () => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
  };

  const getStartOfYear = () => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      0,
      1
    );
  };

  const getBudgetStartDate = (period) => {
    if (period === "weekly") {
      return getStartOfWeek();
    }

    if (period === "yearly") {
      return getStartOfYear();
    }

    return getStartOfMonth();
  };

  // =========================
  // Check Budget Alerts
  // =========================

  useEffect(() => {
    if (!budgets.length) {
      return;
    }

    let cancelled = false;

    const checkAlerts = async () => {
      for (const budget of budgets) {
        if (cancelled) {
          return;
        }

        if (!budget?._id) {
          continue;
        }

        await checkBudgetAlert(
          budget._id
        );
      }
    };

    checkAlerts();

    return () => {
      cancelled = true;
    };
  }, [budgets]);

  // =========================
  // Currency
  // =========================

  const formatCurrency = (amount) => {
    return `Rs. ${Number(
      amount || 0
    ).toLocaleString()}`;
  };

  // =========================
  // Get Transaction Category
  // =========================

  const getTransactionCategoryId = (
    transaction
  ) => {
    if (!transaction.category) {
      return null;
    }

    if (
      typeof transaction.category ===
      "object"
    ) {
      return (
        transaction.category?._id ||
        null
      );
    }

    return transaction.category;
  };

  // =========================
  // Calculate Budget Spent
  // =========================

  const getBudgetSpent = (budget) => {
    const startDate =
      getBudgetStartDate(
        budget.period
      );

    const categoryId =
      budget.category &&
      (typeof budget.category ===
      "object"
        ? budget.category?._id
        : budget.category);

    return transactions
      .filter((transaction) => {
        // Only expenses count.
        if (
          transaction.type !==
          "expense"
        ) {
          return false;
        }

        // Ignore transactions outside
        // the current budget period.
        if (!transaction.date) {
          return false;
        }

        const transactionDate =
          new Date(
            transaction.date
          );

        if (
          transactionDate <
          startDate
        ) {
          return false;
        }

        // Category-specific budget.
        if (categoryId) {
          return (
            getTransactionCategoryId(
              transaction
            ) === categoryId
          );
        }

        // No category means all expenses.
        return true;
      })
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );
  };

  // =========================
  // Budget Summary
  // =========================

  const budgetSummary = useMemo(() => {
    const totalBudget =
      budgets.reduce(
        (total, item) =>
          total +
          Number(
            item.amount || 0
          ),
        0
      );

    const totalSpent =
      budgets.reduce(
        (total, item) =>
          total +
          getBudgetSpent(item),
        0
      );

    const remaining =
      totalBudget - totalSpent;

    return {
      totalBudget,
      totalSpent,
      remaining,
    };
  }, [
    budgets,
    transactions,
  ]);

  // =========================
  // Percentage
  // =========================

  const getPercentage = (
    spent,
    budget
  ) => {
    if (!budget) {
      return 0;
    }

    return Math.min(
      (spent / budget) * 100,
      100
    );
  };

  // =========================
  // Status
  // =========================

  const getBudgetStatus = (
    spent,
    budget
  ) => {
    if (!budget) {
      return "safe";
    }

    if (spent > budget) {
      return "over";
    }

    if (
      spent / budget >=
      0.8
    ) {
      return "warning";
    }

    return "safe";
  };

  // =========================
  // Form
  // =========================

  const handleInputChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const resetForm = () => {
    setFormData({
      category: "",
      amount: "",
      period: "monthly",
    });
  };

  const handleOpenAddForm = () => {
    resetForm();
    setEditingBudget(null);
    setFormError("");
    setShowForm(true);
  };

  const handleOpenEditForm = (
    budget
  ) => {
    setEditingBudget(budget);

    const categoryId =
      typeof budget.category ===
      "object"
        ? budget.category?._id ||
          ""
        : budget.category ||
          "";

    setFormData({
      category: categoryId,
      amount: String(
        budget.amount || ""
      ),
      period:
        budget.period ||
        "monthly",
    });

    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingBudget(null);
    resetForm();
    setFormError("");
  };

  // =========================
  // Save Budget
  // =========================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const amount = Number(
      formData.amount
    );

    if (
      !amount ||
      amount <= 0
    ) {
      setFormError(
        "Budget amount must be greater than 0."
      );
      return;
    }

    if (!formData.period) {
      setFormError(
        "Please select a budget period."
      );
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const budgetData = {
        amount,
        period:
          formData.period,
        category:
          formData.category ||
          null,
      };

      if (editingBudget) {
        await updateBudget(
          editingBudget._id,
          budgetData
        );
      } else {
        await createBudget(
          budgetData
        );
      }

      setShowForm(false);
      setEditingBudget(null);
      resetForm();
    } catch (error) {
      console.error(
        "Failed to save budget:",
        error
      );

      setFormError(
        error.message ||
          "Failed to save budget."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDeleteClick = (
    budget
  ) => {
    setBudgetToDelete(budget);
    setFormError("");
  };

  const handleCancelDelete = () => {
    setBudgetToDelete(null);
  };

  const handleConfirmDelete =
    async () => {
      if (!budgetToDelete) {
        return;
      }

      try {
        setSaving(true);
        setFormError("");

        await deleteBudget(
          budgetToDelete._id
        );

        setBudgetToDelete(null);
      } catch (error) {
        console.error(
          "Failed to delete budget:",
          error
        );

        setFormError(
          error.message ||
            "Failed to delete budget."
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================
  // Category Name
  // =========================

  const getCategoryName = (
    budget
  ) => {
    if (!budget.category) {
      return "All Expenses";
    }

    if (
      typeof budget.category ===
      "object"
    ) {
      return (
        budget.category.name ||
        "Unknown Category"
      );
    }

    const category =
      categories.find(
        (item) =>
          item._id ===
          budget.category
      );

    return (
      category?.name ||
      "Unknown Category"
    );
  };

  // =========================
  // Loading
  // =========================

  if (
    loading ||
    transactionLoading
  ) {
    return (
      <div className="budgets-page">
        <div className="budgets-header">
          <div>
            <h1>Budgets</h1>

            <p>
              Create and manage
              your spending
              budgets.
            </p>
          </div>
        </div>

        <div className="no-budgets">
          <h2>
            Loading Budgets...
          </h2>

          <p>
            Please wait while
            your budgets are
            being loaded.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="budgets-page">
      {/* Header */}

      <div className="budgets-header">
        <div>
          <h1>Budgets</h1>

          <p>
            Create and manage
            your spending
            budgets.
          </p>
        </div>

        <button
          type="button"
          className="add-budget-button"
          onClick={
            handleOpenAddForm
          }
        >
          + Add Budget
        </button>
      </div>

      {/* Error */}

      {error &&
        !showForm &&
        !budgetToDelete && (
          <div
            style={{
              marginBottom: "20px",
              padding:
                "12px 16px",
              borderRadius: "8px",
              background:
                "#fee2e2",
              color:
                "#b91c1c",
              fontSize:
                "14px",
              fontWeight:
                "600",
            }}
          >
            {error}
          </div>
        )}

      {/* Summary */}

      <div className="budget-summary-grid">
        <div className="budget-summary-card">
          <div className="budget-summary-icon budget-icon-blue">
            Rs
          </div>

          <div>
            <span>
              Total Budget
            </span>

            <h2>
              {formatCurrency(
                budgetSummary.totalBudget
              )}
            </h2>
          </div>
        </div>

        <div className="budget-summary-card">
          <div className="budget-summary-icon budget-icon-red">
            &darr;
          </div>

          <div>
            <span>
              Total Spent
            </span>

            <h2>
              {formatCurrency(
                budgetSummary.totalSpent
              )}
            </h2>
          </div>
        </div>

        <div className="budget-summary-card">
          <div className="budget-summary-icon budget-icon-green">
            &#10003;
          </div>

          <div>
            <span>
              Remaining
            </span>

            <h2
              className={
                budgetSummary.remaining >=
                0
                  ? "budget-positive"
                  : "budget-negative"
              }
            >
              {formatCurrency(
                budgetSummary.remaining
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Budget Cards */}

      <div className="budgets-grid">
        {budgets.length >
        0 ? (
          budgets.map(
            (item) => {
              const spent =
                getBudgetSpent(
                  item
                );

              const budgetAmount =
                Number(
                  item.amount ||
                    0
                );

              const percentage =
                getPercentage(
                  spent,
                  budgetAmount
                );

              const status =
                getBudgetStatus(
                  spent,
                  budgetAmount
                );

              const remaining =
                budgetAmount -
                spent;

              return (
                <div
                  className="budget-card"
                  key={
                    item._id
                  }
                >
                  <div className="budget-card-header">
                    <div>
                      <h2>
                        {getCategoryName(
                          item
                        )}
                      </h2>

                      <p>
                        {item.period
                          ? `${
                              item.period
                                .charAt(
                                  0
                                )
                                .toUpperCase() +
                              item.period.slice(
                                1
                              )
                            } Budget`
                          : "Budget"}
                      </p>
                    </div>

                    <div className="budget-card-actions">
                      <button
                        type="button"
                        className="edit-budget-button"
                        onClick={() =>
                          handleOpenEditForm(
                            item
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-budget-button"
                        onClick={() =>
                          handleDeleteClick(
                            item
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="budget-amount-row">
                    <div>
                      <span>
                        Spent
                      </span>

                      <strong>
                        {formatCurrency(
                          spent
                        )}
                      </strong>
                    </div>

                    <div className="budget-total">
                      <span>
                        Budget
                      </span>

                      <strong>
                        {formatCurrency(
                          budgetAmount
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="budget-progress-container">
                    <div className="budget-progress-track">
                      <div
                        className={`budget-progress-fill ${status}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    <span
                      className={`budget-percentage ${status}`}
                    >
                      {Math.round(
                        percentage
                      )}
                      %
                    </span>
                  </div>

                  <div className="budget-status-row">
                    <span>
                      {remaining >=
                      0
                        ? `${formatCurrency(
                            remaining
                          )} remaining`
                        : `${formatCurrency(
                            Math.abs(
                              remaining
                            )
                          )} over budget`}
                    </span>

                    <span
                      className={`budget-status ${status}`}
                    >
                      {status ===
                      "over"
                        ? "Over Budget"
                        : status ===
                          "warning"
                        ? "Near Limit"
                        : "On Track"}
                    </span>
                  </div>
                </div>
              );
            }
          )
        ) : (
          <div className="no-budgets">
            <h2>
              No Budgets Yet
            </h2>

            <p>
              Create your first
              budget to start
              tracking your
              spending.
            </p>

            <button
              type="button"
              className="add-budget-button"
              onClick={
                handleOpenAddForm
              }
            >
              + Create Budget
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}

      {showForm && (
        <div className="budget-modal-overlay">
          <div
            className="budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-modal-title"
          >
            <div className="budget-modal-header">
              <div>
                <h2 id="budget-modal-title">
                  {editingBudget
                    ? "Edit Budget"
                    : "Add Budget"}
                </h2>

                <p>
                  {editingBudget
                    ? "Update your budget details."
                    : "Create a new spending budget."}
                </p>
              </div>

              <button
                type="button"
                className="close-budget-modal-button"
                onClick={
                  handleCloseForm
                }
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {error && (
              <div
                style={{
                  margin:
                    "0 24px",
                  padding:
                    "12px 14px",
                  borderRadius:
                    "8px",
                  background:
                    "#fee2e2",
                  color:
                    "#b91c1c",
                  fontSize:
                    "13px",
                  fontWeight:
                    "600",
                }}
              >
                {error}
              </div>
            )}

            <form
              className="budget-form"
              onSubmit={
                handleSubmit
              }
            >
              {/* Category */}

              <div className="budget-form-group">
                <label htmlFor="budget-category">
                  Category
                </label>

                <select
                  id="budget-category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleInputChange
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius:
                      "8px",
                    background:
                      "#ffffff",
                    color:
                      "#111827",
                    fontSize:
                      "14px",
                    outline:
                      "none",
                  }}
                >
                  <option value="">
                    All Expenses
                  </option>

                  {categories
                    .filter(
                      (
                        category
                      ) =>
                        category.type ===
                        "expense"
                    )
                    .map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category._id
                          }
                          value={
                            category._id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}
                </select>
              </div>

              {/* Amount */}

              <div className="budget-form-group">
                <label htmlFor="budget-amount">
                  Budget Amount
                </label>

                <input
                  id="budget-amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="e.g. 30000"
                  value={
                    formData.amount
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />
              </div>

              {/* Period */}

              <div className="budget-form-group">
                <label htmlFor="budget-period">
                  Budget Period
                </label>

                <select
                  id="budget-period"
                  name="period"
                  value={
                    formData.period
                  }
                  onChange={
                    handleInputChange
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "11px 12px",
                    border:
                      "1px solid #d1d5db",
                    borderRadius:
                      "8px",
                    background:
                      "#ffffff",
                    color:
                      "#111827",
                    fontSize:
                      "14px",
                    outline:
                      "none",
                  }}
                >
                  <option value="weekly">
                    Weekly
                  </option>

                  <option value="monthly">
                    Monthly
                  </option>

                  <option value="yearly">
                    Yearly
                  </option>
                </select>
              </div>

              <div className="budget-form-actions">
                <button
                  type="button"
                  className="cancel-budget-button"
                  onClick={
                    handleCloseForm
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-budget-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingBudget
                    ? "Update Budget"
                    : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}

      {budgetToDelete && (
        <div className="budget-modal-overlay">
          <div
            className="delete-budget-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-budget-title"
          >
            <div className="delete-budget-icon">
              !
            </div>

            <h2 id="delete-budget-title">
              Delete Budget?
            </h2>

            <p>
              Are you sure you
              want to delete the{" "}
              <strong>
                {getCategoryName(
                  budgetToDelete
                )}
              </strong>{" "}
              budget?
              <br />
              This action cannot
              be undone.
            </p>

            {error && (
              <div
                style={{
                  marginTop:
                    "16px",
                  padding:
                    "10px",
                  borderRadius:
                    "8px",
                  background:
                    "#fee2e2",
                  color:
                    "#b91c1c",
                  fontSize:
                    "13px",
                  fontWeight:
                    "600",
                }}
              >
                {error}
              </div>
            )}

            <div className="delete-budget-actions">
              <button
                type="button"
                className="cancel-budget-button"
                onClick={
                  handleCancelDelete
                }
                disabled={
                  saving
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-budget-button"
                onClick={
                  handleConfirmDelete
                }
                disabled={
                  saving
                }
              >
                {saving
                  ? "Deleting..."
                  : "Delete Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
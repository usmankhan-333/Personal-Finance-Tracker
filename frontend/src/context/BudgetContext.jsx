import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const BudgetContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function BudgetProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Authentication
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // Fetch Budgets
  // =========================

  const fetchBudgets = async () => {
    const token = getToken();

    if (!token) {
      setBudgets([]);
      return [];
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/budgets`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch budgets."
        );
      }

      const budgetData = Array.isArray(data.data)
        ? data.data
        : [];

      setBudgets(budgetData);

      return budgetData;
    } catch (error) {
      console.error(
        "Failed to fetch budgets:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch budgets."
      );

      setBudgets([]);

      throw error;
    }
  };

  // =========================
  // Create Budget
  // =========================

  const createBudget = async (budgetData) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/budgets`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(budgetData.amount),
          period: budgetData.period,
          category:
            budgetData.category || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create budget."
      );
    }

    const createdBudget = data.data;

    setBudgets((currentBudgets) => [
      createdBudget,
      ...currentBudgets,
    ]);

    return createdBudget;
  };

  // =========================
  // Update Budget
  // =========================

  const updateBudget = async (
    budgetId,
    budgetData
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/budgets/${budgetId}`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(budgetData.amount),
          period: budgetData.period,
          category:
            budgetData.category || null,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to update budget."
      );
    }

    setBudgets((currentBudgets) =>
      currentBudgets.map((budget) =>
        budget._id === budgetId
          ? data.data
          : budget
      )
    );

    return data.data;
  };

  // =========================
  // Delete Budget
  // =========================

  const deleteBudget = async (budgetId) => {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in.");
    }

    const response = await fetch(
      `${API_URL}/budgets/${budgetId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to delete budget."
      );
    }

    setBudgets((currentBudgets) =>
      currentBudgets.filter(
        (budget) =>
          budget._id !== budgetId
      )
    );

    return data;
  };

  // =========================
  // Load After Authentication
  // =========================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setBudgets([]);
      setLoading(false);
      setError("");
      return;
    }

    const loadBudgets = async () => {
      try {
        setLoading(true);
        setError("");

        await fetchBudgets();
      } catch (error) {
        console.error(
          "Failed to load budgets:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [user, authLoading]);

  // =========================
  // Context Value
  // =========================

  const value = {
    budgets,

    loading,
    error,

    fetchBudgets,

    createBudget,
    updateBudget,
    deleteBudget,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useBudgets() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error(
      "useBudgets must be used inside a BudgetProvider"
    );
  }

  return context;
}
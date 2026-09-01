import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const AlertContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL;

export function AlertProvider({
  children,
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // Get Token
  // =========================

  const getToken = () => {
    return localStorage.getItem(
      "token"
    );
  };

  // =========================
  // Fetch Alerts
  // =========================

  const fetchAlerts =
    async () => {
      const token = getToken();

      if (!token) {
        setAlerts([]);
        return [];
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/alerts`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load notifications."
          );
        }

        const alertData =
          Array.isArray(data.data)
            ? data.data
            : [];

        setAlerts(alertData);

        return alertData;
      } catch (error) {
        console.error(
          "Failed to load alerts:",
          error
        );

        setError(
          error.message ||
            "Failed to load notifications."
        );

        setAlerts([]);

        return [];
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // Check Single Budget Alert
  // =========================

  const checkBudgetAlert =
    async (budgetId) => {
      const token = getToken();

      if (!token || !budgetId) {
        return null;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/alerts/check/${budgetId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to check budget alert."
          );
        }

        if (data.alertCreated) {
          setAlerts(
            (currentAlerts) => {
              const exists =
                currentAlerts.some(
                  (alert) =>
                    alert._id ===
                    data.alertCreated
                      ._id
                );

              if (exists) {
                return currentAlerts;
              }

              return [
                data.alertCreated,
                ...currentAlerts,
              ];
            }
          );
        }

        return data;
      } catch (error) {
        console.error(
          "Failed to check budget alert:",
          error
        );

        return null;
      }
    };

  // =========================
  // Check All Budget Alerts
  // =========================

  const checkAllBudgetAlerts =
    async () => {
      const token = getToken();

      if (!token) {
        return null;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/alerts/check-all`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to check budget alerts."
          );
        }

        // Refresh alerts because
        // new alerts may have been created.
        await fetchAlerts();

        return data;
      } catch (error) {
        console.error(
          "Failed to check all budget alerts:",
          error
        );

        return null;
      }
    };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setAlerts([]);
      setError("");
      return;
    }

    fetchAlerts();
  }, [
    user,
    authLoading,
  ]);

  // =========================
  // Listen For New Alerts
  // =========================

  useEffect(() => {
    const handleAlertsChanged =
      async () => {
        console.log(
          "Refreshing notifications..."
        );

        await fetchAlerts();
      };

    window.addEventListener(
      "alertsChanged",
      handleAlertsChanged
    );

    return () => {
      window.removeEventListener(
        "alertsChanged",
        handleAlertsChanged
      );
    };
  }, []);

  // =========================
  // Unread Count
  // =========================

  const unreadCount =
    alerts.filter(
      (alert) =>
        !alert.isRead
    ).length;

  // =========================
  // Context Value
  // =========================

  const value = {
    alerts,
    loading,
    error,
    unreadCount,

    fetchAlerts,
    checkBudgetAlert,
    checkAllBudgetAlerts,
  };

  return (
    <AlertContext.Provider
      value={value}
    >
      {children}
    </AlertContext.Provider>
  );
}

// =========================
// Custom Hook
// =========================

export function useAlerts() {
  const context =
    useContext(AlertContext);

  if (!context) {
    throw new Error(
      "useAlerts must be used inside an AlertProvider"
    );
  }

  return context;
}
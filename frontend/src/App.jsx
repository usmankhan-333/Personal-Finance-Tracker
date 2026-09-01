import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { TransactionProvider } from "./context/TransactionContext";
import { BudgetProvider } from "./context/BudgetContext";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <BudgetProvider>
          <AlertProvider>
            <BrowserRouter>
              <Routes>
                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />


                <Route
                  path="/forgot-password"
                  element={<ForgotPassword />}
                />

                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                {/* Dashboard Layout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />

                    <Route
                      path="/transactions"
                      element={<Transactions />}
                    />

                    <Route
                      path="/budgets"
                      element={<Budgets />}
                    />

                    <Route
                      path="/reports"
                      element={<Reports />}
                    />

                    <Route
                      path="/settings"
                      element={<Settings />}
                    />
                    </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </AlertProvider>
        </BudgetProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";

import "./Navbar.css";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  const { logout } = useAuth();

  const {
    alerts,
    unreadCount,
    loading: alertsLoading,
  } = useAlerts();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatNotificationDate = (date) => {
    if (!date) {
      return "";
    }

    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    return notificationDate.toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">💰</span>
        <span>Personal Finance Tracker</span>
      </div>

      <div className="navbar-actions">
        <div className="notification-wrapper">
          <button
            className="notification-button"
            type="button"
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
            aria-label="Notifications"
          >
            <span className="notification-icon">🔔</span>

            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>

                  <p>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount === 1 ? "" : "s"
                        }`
                      : "You're all caught up"}
                  </p>
                </div>
              </div>

              {alertsLoading && (
                <div className="notification-loading">
                  Loading notifications...
                </div>
              )}

              {!alertsLoading && alerts.length > 0 && (
                <div className="notification-list">
                  {alerts.map((alert) => (
                    <div
                      className={`notification-item ${
                        alert.isRead ? "read" : "unread"
                      }`}
                      key={alert._id}
                    >
                      <div className="notification-item-icon">
                        ⚠️
                      </div>

                      <div className="notification-item-content">
                        <strong>Budget Alert</strong>

                        <p>{alert.message}</p>

                        <span>
                          {formatNotificationDate(
                            alert.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!alertsLoading && alerts.length === 0 && (
                <div className="notification-empty">
                  <div className="notification-empty-icon">
                    🔔
                  </div>

                  <strong>No notifications</strong>

                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Link to="/settings" className="profile-button">
          Profile
        </Link>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
import { useState } from "react";
import "./ForgotPassword.css";

const API_URL = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSubmitted(true);

      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="reset-email">Email</label>

              <input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <a className="back-to-login-link" href="/login">
              Back to Login
            </a>
          </form>
        ) : (
          <div className="forgot-password-form">
            <p style={{ color: "#0a3c6e", fontWeight: 600 }}>
              If that email exists, a reset link has been generated.
            </p>
            
           {resetUrl && (
              <div>
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  (Dev/testing mode — normally this would be emailed to you)
                </p>
                 <a 
                  href={resetUrl.replace("http://localhost:5000/api/auth", "")}
                  className="login-button"
                 >
                  Reset password
                </a>
              </div>
            )}

            <a className="back-to-login-link" href="/login">
              Back to Login
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

export default ForgotPassword;

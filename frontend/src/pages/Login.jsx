// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Login.css";

// function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/auth/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: email.trim(),
//             password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed.");
//       }

//       login(data.token, data.data);

//       navigate("/");
//     } catch (error) {
//       setError(
//         error.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="login-page">
//       <div className="login-container">
//         <div className="login-header">
//           <h1>Personal Finance Tracker</h1>

//           <h2>Welcome Back!</h2>

//           <p>Log in to your account</p>
//         </div>

//         <form
//           className="login-form"
//           onSubmit={handleSubmit}
//         >
//           <div className="form-group">
//             <label htmlFor="email">Email</label>

//             <input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(event) =>
//                 setEmail(event.target.value)
//               }
//               autoComplete="email"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>

//             <input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(event) =>
//                 setPassword(event.target.value)
//               }
//               autoComplete="current-password"
//               required
//             />
//           </div>

//           {error && (
//             <p className="error-message">
//               {error}
//             </p>
//           )}

//           <button
//             className="login-button"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Loging In..." : "Log In"}
//           </button>

//           <Link
//             className="forgot-password-link"
//             to="/forgot-password"
//           >
//             Forgot Password?
//           </Link>

//           <Link
//             className="back-to-signup-link"
//             to="/signup"
//           >
//             Don't have an account? Create Account
//           </Link>
//         </form>
//       </div>
//     </main>
//   );
// }

// export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import analyticsIllustration from "../assets/analytics-pana.svg";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      login(data.token, data.data);

      navigate("/");
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-wrapper">
        <div className="login-illustration">
          <div className="illustration-circle circle-1"></div>
          <div className="illustration-circle circle-2"></div>
          <div className="illustration-circle circle-3"></div>
          <img src={analyticsIllustration} alt="Analytics illustration" className="illustration-image" />
        </div>

        <div className="login-container">
          <div className="login-header">
            <h1>Personal Finance Tracker</h1>
            <h2>Welcome Back!</h2>
            <p>Log in to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="password-icon">
                      <path d="M3 3l18 18" />
                      <path d="M10.5 10.5a3 3 0 0 0 4.2 4.2" />
                      <path d="M9.4 9.4A9.8 9.8 0 0 0 12 8c5.5 0 10 4.5 10 10a9.9 9.9 0 0 1-2.6 6.1" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="password-icon">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>

            <Link className="forgot-password-link" to="/forgot-password">
              Forgot Password?
            </Link>

            <Link className="back-to-signup-link" to="/signup">
              Don't have an account? Create Account
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
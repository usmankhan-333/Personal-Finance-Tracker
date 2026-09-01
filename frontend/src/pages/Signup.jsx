// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./SignUp.css";

// function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/auth/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed.");
//       }

//       navigate("/login");
//     } catch (error) {
//       setError(
//         error.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="signup-page">
//       <div className="signup-container">
//         <div className="signup-header">
//           <h1>Create Account</h1>
//           <p>Create your Personal Finance Tracker account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="signup-form">
//           <div className="form-group">
//             <label htmlFor="name">Full Name</label>

//             <input
//               id="name"
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(event) => setName(event.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="signup-email">Email</label>

//             <input
//               id="signup-email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="signup-password">Password</label>

//             <input
//               id="signup-password"
//               type="password"
//               placeholder="Create a password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirm-password">Confirm Password</label>

//             <input
//               id="confirm-password"
//               type="password"
//               placeholder="Confirm your password"
//               value={confirmPassword}
//               onChange={(event) => setConfirmPassword(event.target.value)}
//               required
//             />
//           </div>

//           {error && <p className="error-message">{error}</p>}

//           <button
//             type="submit"
//             className="signup-button"
//             disabled={loading}
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>

//           <Link className="back-to-login-link" to="/login">
//             Already have an account? Login
//           </Link>
//         </form>
//       </div>
//     </main>
//   );
// }

// export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import analyticsIllustration from "../assets/Analytics-pana.svg";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login");
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-illustration">
          <div className="illustration-circle circle-1"></div>
          <div className="illustration-circle circle-2"></div>
          <div className="illustration-circle circle-3"></div>
          <img src={analyticsIllustration} alt="Analytics illustration" className="illustration-image" />
        </div>

        <div className="signup-container">
          <div className="signup-header">
            <h1>Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email</label>

              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>

              <div className="password-field">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>

              <div className="password-field">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <Link className="back-to-login-link" to="/login">
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
// import { useState } from "react";
// import "./Settings.css";
// import { useTransactions } from "../context/TransactionContext";


// function Settings() {
//   const {
//     categories,
//     createCategory,
//     updateCategory,
//     deleteCategory,
//   } = useTransactions();

//   const [categoryName, setCategoryName] = useState("");
//   const [categoryType, setCategoryType] = useState("expense");

//   const [editingCategoryId, setEditingCategoryId] = useState(null);
//   const [editingCategoryName, setEditingCategoryName] = useState("");
//   const [editingCategoryType, setEditingCategoryType] =
//     useState("expense");

//   const [categoryError, setCategoryError] = useState("");
//   const [categorySuccess, setCategorySuccess] = useState("");
//   const [categoryLoading, setCategoryLoading] = useState(false);

//   const handleCreateCategory = async (event) => {
//     event.preventDefault();

//     const trimmedName = categoryName.trim();

//     if (!trimmedName) {
//       setCategoryError("Category name is required.");
//       setCategorySuccess("");
//       return;
//     }

//     try {
//       setCategoryLoading(true);
//       setCategoryError("");
//       setCategorySuccess("");

//       await createCategory(trimmedName, categoryType);

//       setCategoryName("");
//       setCategoryType("expense");
//       setCategorySuccess("Category created successfully.");
//     } catch (error) {
//       setCategoryError(
//         error.message || "Failed to create category."
//       );
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   const handleStartEdit = (category) => {
//     setEditingCategoryId(category._id);
//     setEditingCategoryName(category.name);
//     setEditingCategoryType(category.type);

//     setCategoryError("");
//     setCategorySuccess("");
//   };

//   const handleCancelEdit = () => {
//     setEditingCategoryId(null);
//     setEditingCategoryName("");
//     setEditingCategoryType("expense");
//     setCategoryError("");
//   };

//   const handleUpdateCategory = async (event, categoryId) => {
//     event.preventDefault();

//     const trimmedName = editingCategoryName.trim();

//     if (!trimmedName) {
//       setCategoryError("Category name is required.");
//       setCategorySuccess("");
//       return;
//     }

//     try {
//       setCategoryLoading(true);
//       setCategoryError("");
//       setCategorySuccess("");

//       await updateCategory(categoryId, {
//         name: trimmedName,
//         type: editingCategoryType,
//       });

//       setEditingCategoryId(null);
//       setEditingCategoryName("");
//       setEditingCategoryType("expense");

//       setCategorySuccess("Category updated successfully.");
//     } catch (error) {
//       setCategoryError(
//         error.message || "Failed to update category."
//       );
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this category?"
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setCategoryLoading(true);
//       setCategoryError("");
//       setCategorySuccess("");

//       await deleteCategory(categoryId);

//       if (editingCategoryId === categoryId) {
//         handleCancelEdit();
//       }

//       setCategorySuccess("Category deleted successfully.");
//     } catch (error) {
//       setCategoryError(
//         error.message || "Failed to delete category."
//       );
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   return (
//     <div className="settings-page">
//       <div className="settings-header">
//         <h1>Settings</h1>

//         <p>
//           Manage your account and application preferences.
//         </p>
//       </div>

//       <div className="settings-sections">
//         {/* Profile */}
//         <section className="settings-card">
//           <div className="settings-card-header">
//             <h2>Profile</h2>

//             <p>
//               Update your personal information.
//             </p>
//           </div>

//           <div className="settings-form">
//             <div className="settings-field">
//               <label htmlFor="settings-name">
//                 Full Name
//               </label>

//               <input
//                 id="settings-name"
//                 type="text"
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div className="settings-field">
//               <label htmlFor="settings-email">
//                 Email
//               </label>

//               <input
//                 id="settings-email"
//                 type="email"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <button
//               type="button"
//               className="settings-primary-button"
//             >
//               Save Changes
//             </button>
//           </div>
//         </section>

//         {/* Preferences */}
//         <section className="settings-card">
//           <div className="settings-card-header">
//             <h2>Preferences</h2>

//             <p>
//               Customize how your finance tracker works.
//             </p>
//           </div>

//           <div className="settings-options">
//             <div className="settings-option">
//               <div>
//                 <h3>Currency</h3>

//                 <p>
//                   Select the currency used throughout the
//                   application.
//                 </p>
//               </div>

//               <select defaultValue="PKR">
//                 <option value="PKR">
//                   PKR - Pakistani Rupee
//                 </option>

//                 <option value="USD">
//                   USD - US Dollar
//                 </option>

//                 <option value="EUR">
//                   EUR - Euro
//                 </option>

//                 <option value="GBP">
//                   GBP - British Pound
//                 </option>
//               </select>
//             </div>

//             <div className="settings-option">
//               <div>
//                 <h3>Email Notifications</h3>

//                 <p>
//                   Receive notifications about your finances.
//                 </p>
//               </div>

//               <label className="settings-switch">
//                 <input
//                   type="checkbox"
//                   defaultChecked
//                 />

//                 <span></span>
//               </label>
//             </div>
//           </div>
//         </section>

//         {/* Categories */}
//         <section className="settings-card">
//           <div className="settings-card-header">
//             <h2>Categories</h2>

//             <p>
//               Create and manage categories for your income
//               and expenses.
//             </p>
//           </div>

//           {/* Add Category */}
//           <form
//             className="category-form"
//             onSubmit={handleCreateCategory}
//           >
//             <div className="settings-field">
//               <label htmlFor="category-name">
//                 Category Name
//               </label>

//               <input
//                 id="category-name"
//                 type="text"
//                 value={categoryName}
//                 onChange={(event) =>
//                   setCategoryName(event.target.value)
//                 }
//                 placeholder="e.g. Food, Salary, Transport"
//                 disabled={categoryLoading}
//               />
//             </div>

//             <div className="settings-field">
//               <label htmlFor="category-type">
//                 Category Type
//               </label>

//               <select
//                 id="category-type"
//                 value={categoryType}
//                 onChange={(event) =>
//                   setCategoryType(event.target.value)
//                 }
//                 disabled={categoryLoading}
//               >
//                 <option value="expense">
//                   Expense
//                 </option>

//                 <option value="income">
//                   Income
//                 </option>
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="settings-primary-button"
//               disabled={categoryLoading}
//             >
//               {categoryLoading
//                 ? "Adding..."
//                 : "Add Category"}
//             </button>
//           </form>

//           {/* Category Messages */}
//           {categoryError && (
//             <p className="category-message category-error">
//               {categoryError}
//             </p>
//           )}

//           {categorySuccess && (
//             <p className="category-message category-success">
//               {categorySuccess}
//             </p>
//           )}

//           {/* Category List */}
//           <div className="category-list">
//             <h3>Your Categories</h3>

//             {categories.length === 0 ? (
//               <p className="category-empty">
//                 No categories created yet.
//               </p>
//             ) : (
//               <div className="category-items">
//                 {categories.map((category) => {
//                   const isEditing =
//                     editingCategoryId === category._id;

//                   if (isEditing) {
//                     return (
//                       <form
//                         className="category-item category-item-editing"
//                         key={category._id}
//                         onSubmit={(event) =>
//                           handleUpdateCategory(
//                             event,
//                             category._id
//                           )
//                         }
//                       >
//                         <div className="category-edit-fields">
//                           <div className="settings-field">
//                             <label
//                               htmlFor={`edit-category-name-${category._id}`}
//                             >
//                               Category Name
//                             </label>

//                             <input
//                               id={`edit-category-name-${category._id}`}
//                               type="text"
//                               value={editingCategoryName}
//                               onChange={(event) =>
//                                 setEditingCategoryName(
//                                   event.target.value
//                                 )
//                               }
//                               autoFocus
//                               disabled={categoryLoading}
//                             />
//                           </div>

//                           <div className="settings-field">
//                             <label
//                               htmlFor={`edit-category-type-${category._id}`}
//                             >
//                               Type
//                             </label>

//                             <select
//                               id={`edit-category-type-${category._id}`}
//                               value={editingCategoryType}
//                               onChange={(event) =>
//                                 setEditingCategoryType(
//                                   event.target.value
//                                 )
//                               }
//                               disabled={categoryLoading}
//                             >
//                               <option value="expense">
//                                 Expense
//                               </option>

//                               <option value="income">
//                                 Income
//                               </option>
//                             </select>
//                           </div>
//                         </div>

//                         <div className="category-edit-actions">
//                           <button
//                             type="submit"
//                             className="settings-primary-button"
//                             disabled={categoryLoading}
//                           >
//                             {categoryLoading
//                               ? "Saving..."
//                               : "Save"}
//                           </button>

//                           <button
//                             type="button"
//                             className="settings-secondary-button"
//                             onClick={handleCancelEdit}
//                             disabled={categoryLoading}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </form>
//                     );
//                   }

//                   return (
//                     <div
//                       className="category-item"
//                       key={category._id}
//                     >
//                       <div className="category-item-info">
//                         <strong>{category.name}</strong>

//                         <span
//                           className={`category-type ${category.type}`}
//                         >
//                           {category.type === "income"
//                             ? "Income"
//                             : "Expense"}
//                         </span>
//                       </div>

//                       <div className="category-actions">
//                         <button
//                           type="button"
//                           className="settings-edit-button"
//                           onClick={() =>
//                             handleStartEdit(category)
//                           }
//                           disabled={categoryLoading}
//                         >
//                           Edit
//                         </button>

//                         <button
//                           type="button"
//                           className="settings-danger-button"
//                           onClick={() =>
//                             handleDeleteCategory(
//                               category._id
//                             )
//                           }
//                           disabled={categoryLoading}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Security */}
//         <section className="settings-card">
//           <div className="settings-card-header">
//             <h2>Security</h2>

//             <p>
//               Manage your account security.
//             </p>
//           </div>

//           <div className="security-row">
//             <div>
//               <h3>Password</h3>

//               <p>
//                 Change your account password.
//               </p>
//             </div>

//             <button
//               type="button"
//               className="settings-secondary-button"
//             >
//               Change Password
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default Settings;
import { useState, useEffect } from "react";
import "./Settings.css";
import { useTransactions } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Unexpected response from server (status ${response.status}).`
    );
  }
}

function Settings() {
  const { user } = useAuth();
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useTransactions();

  // ---------- Profile state ----------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Auto-fill profile fields once the user object is available
  useEffect(() => {
    if (user) {
      setFullName(user.name || user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // ---------- Security / password state ----------
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ---------- Category state ----------
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingCategoryType, setEditingCategoryType] = useState("expense");

  const [categoryError, setCategoryError] = useState("");
  const [categorySuccess, setCategorySuccess] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ---------- Profile handlers ----------
  const handleSaveProfile = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setProfileError("Full name and email are required.");
      setProfileSuccess("");
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError("");
      setProfileSuccess("");

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setProfileSuccess("Profile updated successfully.");
    } catch (error) {
      setProfileError(error.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  // ---------- Password handlers ----------
  const handleTogglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      setPasswordSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      setPasswordSuccess("");
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError("");
      setPasswordSuccess("");

      const response = await fetch(`${API_URL}/auth/password`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordError(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ---------- Category handlers ----------
  const handleCreateCategory = async (event) => {
    event.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required.");
      setCategorySuccess("");
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError("");
      setCategorySuccess("");

      await createCategory(trimmedName, categoryType);

      setCategoryName("");
      setCategoryType("expense");
      setCategorySuccess("Category created successfully.");
    } catch (error) {
      setCategoryError(error.message || "Failed to create category.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryName(category.name);
    setEditingCategoryType(category.type);

    setCategoryError("");
    setCategorySuccess("");
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setEditingCategoryType("expense");
    setCategoryError("");
  };

  const handleUpdateCategory = async (event, categoryId) => {
    event.preventDefault();

    const trimmedName = editingCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("Category name is required.");
      setCategorySuccess("");
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError("");
      setCategorySuccess("");

      await updateCategory(categoryId, {
        name: trimmedName,
        type: editingCategoryType,
      });

      setEditingCategoryId(null);
      setEditingCategoryName("");
      setEditingCategoryType("expense");

      setCategorySuccess("Category updated successfully.");
    } catch (error) {
      setCategoryError(error.message || "Failed to update category.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCategoryLoading(true);
      setCategoryError("");
      setCategorySuccess("");

      await deleteCategory(categoryId);

      if (editingCategoryId === categoryId) {
        handleCancelEdit();
      }

      setCategorySuccess("Category deleted successfully.");
    } catch (error) {
      setCategoryError(error.message || "Failed to delete category.");
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences.</p>
      </div>

      <div className="settings-sections">
        {/* Profile */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Profile</h2>
            <p>Update your personal information.</p>
          </div>

          <div className="settings-form">
            <div className="settings-field">
              <label htmlFor="settings-name">Full Name</label>
              <input
                id="settings-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                disabled={profileLoading}
              />
            </div>

            <div className="settings-field">
              <label htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                disabled={profileLoading}
              />
            </div>

            {profileError && (
              <p className="category-message category-error">
                {profileError}
              </p>
            )}

            {profileSuccess && (
              <p className="category-message category-success">
                {profileSuccess}
              </p>
            )}

            <button
              type="button"
              className="settings-primary-button"
              onClick={handleSaveProfile}
              disabled={profileLoading}
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Preferences</h2>
            <p>Customize how your finance tracker works.</p>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <h3>Currency</h3>
                <p>Select the currency used throughout the application.</p>
              </div>

              <select defaultValue="PKR">
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div className="settings-option">
              <div>
                <h3>Email Notifications</h3>
                <p>Receive notifications about your finances.</p>
              </div>

              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Categories</h2>
            <p>Create and manage categories for your income and expenses.</p>
          </div>

          <form className="category-form" onSubmit={handleCreateCategory}>
            <div className="settings-field">
              <label htmlFor="category-name">Category Name</label>
              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="e.g. Food, Salary, Transport"
                disabled={categoryLoading}
              />
            </div>

            <div className="settings-field">
              <label htmlFor="category-type">Category Type</label>
              <select
                id="category-type"
                value={categoryType}
                onChange={(event) => setCategoryType(event.target.value)}
                disabled={categoryLoading}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <button
              type="submit"
              className="settings-primary-button"
              disabled={categoryLoading}
            >
              {categoryLoading ? "Adding..." : "Add Category"}
            </button>
          </form>

          {categoryError && (
            <p className="category-message category-error">
              {categoryError}
            </p>
          )}

          {categorySuccess && (
            <p className="category-message category-success">
              {categorySuccess}
            </p>
          )}

          <div className="category-list">
            <h3>Your Categories</h3>

            {categories.length === 0 ? (
              <p className="category-empty">No categories created yet.</p>
            ) : (
              <div className="category-items">
                {categories.map((category) => {
                  const isEditing = editingCategoryId === category._id;

                  if (isEditing) {
                    return (
                      <form
                        className="category-item category-item-editing"
                        key={category._id}
                        onSubmit={(event) =>
                          handleUpdateCategory(event, category._id)
                        }
                      >
                        <div className="category-edit-fields">
                          <div className="settings-field">
                            <label
                              htmlFor={`edit-category-name-${category._id}`}
                            >
                              Category Name
                            </label>
                            <input
                              id={`edit-category-name-${category._id}`}
                              type="text"
                              value={editingCategoryName}
                              onChange={(event) =>
                                setEditingCategoryName(event.target.value)
                              }
                              autoFocus
                              disabled={categoryLoading}
                            />
                          </div>

                          <div className="settings-field">
                            <label
                              htmlFor={`edit-category-type-${category._id}`}
                            >
                              Type
                            </label>
                            <select
                              id={`edit-category-type-${category._id}`}
                              value={editingCategoryType}
                              onChange={(event) =>
                                setEditingCategoryType(event.target.value)
                              }
                              disabled={categoryLoading}
                            >
                              <option value="expense">Expense</option>
                              <option value="income">Income</option>
                            </select>
                          </div>
                        </div>

                        <div className="category-edit-actions">
                          <button
                            type="submit"
                            className="settings-primary-button"
                            disabled={categoryLoading}
                          >
                            {categoryLoading ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            className="settings-secondary-button"
                            onClick={handleCancelEdit}
                            disabled={categoryLoading}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div className="category-item" key={category._id}>
                      <div className="category-item-info">
                        <strong>{category.name}</strong>
                        <span className={`category-type ${category.type}`}>
                          {category.type === "income" ? "Income" : "Expense"}
                        </span>
                      </div>

                      <div className="category-actions">
                        <button
                          type="button"
                          className="settings-edit-button"
                          onClick={() => handleStartEdit(category)}
                          disabled={categoryLoading}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="settings-danger-button"
                          onClick={() => handleDeleteCategory(category._id)}
                          disabled={categoryLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Security */}
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Security</h2>
            <p>Manage your account security.</p>
          </div>

          <div className="security-row">
            <div>
              <h3>Password</h3>
              <p>Change your account password.</p>
            </div>

            <button
              type="button"
              className="settings-secondary-button"
              onClick={handleTogglePasswordForm}
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form className="category-form" onSubmit={handleChangePassword}>
              <div className="settings-field">
                <label htmlFor="current-password">Current Password</label>
                <div className="password-field">
                  <input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? (
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

              <div className="settings-field">
                <label htmlFor="new-password">New Password</label>
                <div className="password-field">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
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

              <div className="settings-field">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <div className="password-field">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    disabled={passwordLoading}
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

              {passwordError && (
                <p className="category-message category-error">
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="category-message category-success">
                  {passwordSuccess}
                </p>
              )}

              <button
                type="submit"
                className="settings-primary-button"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default Settings;
# Personal Finance Tracker

A modern, web-based **Personal Finance Tracker** designed to help users manage their personal finances efficiently. The application allows users to track income and expenses, manage budgets, monitor financial activity, view reports, and customize their preferences through a responsive and user-friendly interface.

## 📌 Overview

**Personal Finance Tracker** is a full-stack web application developed to simplify personal financial management.

The system provides users with a centralized platform where they can:

* Track income and expenses
* Organize transactions by categories
* Create and manage budgets
* Monitor budget usage and alerts
* View financial summaries and reports
* Manage personal finance categories
* Customize currency and notification preferences
* Switch between light and dark themes
* Use the application across desktop, tablet, and mobile devices
* Securely authenticate and manage their accounts

---

## ✨ Features

### 🔐 Authentication & Account Management

* User registration and login
* Secure authentication
* User session management
* Forgot password functionality
* Password reset functionality
* Protected application routes

### 💰 Transaction Management

* Add income and expense transactions
* Edit existing transactions
* Delete transactions
* Categorize transactions
* Filter transactions by type, category, and date
* View transaction history
* Automatic financial summary calculation

### 📊 Dashboard & Financial Summary

* Total income
* Total expenses
* Current balance
* Financial activity overview
* Easy-to-understand financial information

### 💵 Budget Management

* Create budgets
* Edit budgets
* Delete budgets
* Set budgets for different categories
* Support for weekly, monthly, and yearly budget periods
* Monitor budget usage

### 🔔 Budget Alerts

The system monitors budget usage and generates alerts when spending reaches important thresholds.

* Budget warning alerts
* Budget limit alerts
* Automatic budget usage checking
* Alert management through the application

### 📈 Reports

* Financial reports based on transaction data
* Income and expense analysis
* Category-based financial information
* Visual representation of financial activity

### ⚙️ Settings & Preferences

Users can customize their application experience through the Settings section.

* Manage income and expense categories
* Currency preferences
* Notification preferences
* Application preferences

### 🌙 Dark Mode

The application includes a complete dark mode theme for a more comfortable viewing experience.

* Light theme
* Dark theme
* Theme preference handling
* Consistent dark styling across the application

### 📱 Responsive Design

The application is designed to work across different screen sizes.

* Desktop
* Laptop
* Tablet
* Mobile devices
* Responsive navigation and layouts
* Mobile-friendly forms and components

---

## 🛠️ Technology Stack

### Frontend

* **React.js**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**
* **React Router**
* **Context API**

### Backend

* **Node.js**
* **Express.js**
* **REST API**
* **JavaScript**

### Database

* **MongoDB**
* **Mongoose**

### Authentication & Security

* User authentication
* Protected API routes
* Password reset functionality
* Environment-based configuration

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm

---

## 📂 Project Structure

```text
Personal-Finance-Tracker/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── layouts/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Personal-Finance-Tracker
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open another terminal or navigate back to the project root:

```bash
cd backend
npm install
```

---

## 🔑 Environment Variables

### Backend

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

EMAIL_FROM=your_email_sender
CLIENT_URL=http://localhost:5173
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Important:** Never commit `.env` files or secret API keys to GitHub.

---

## ▶️ Running the Application

### Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend API will run on:

```text
http://localhost:5000
```

### Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser to use the application.

---

## 🔄 Application Workflow

The general application flow is:

```text
User
  │
  ▼
Authentication
  │
  ▼
Dashboard
  │
  ├── Transactions
  │     ├── Add
  │     ├── Edit
  │     └── Delete
  │
  ├── Budgets
  │     ├── Create
  │     ├── Monitor
  │     └── Alerts
  │
  ├── Reports
  │
  └── Settings
        ├── Categories
        ├── Currency
        ├── Notifications
        └── Theme
```

---

## 🔌 Backend API

The backend follows a RESTful API architecture.

Main API areas include:

| Module           | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| Authentication   | User registration, login, account management     |
| Transactions     | Create, read, update, and delete transactions    |
| Categories       | Manage income and expense categories             |
| Budgets          | Create and manage financial budgets              |
| Alerts           | Budget usage and financial alerts                |
| Dashboard        | Financial summary information                    |
| Reports / Export | Financial data analysis and export functionality |

---

## 🗄️ Database

The application uses **MongoDB** as its database and **Mongoose** for object data modeling.

The database stores information related to:

* Users
* Transactions
* Categories
* Budgets
* Alerts

Data is associated with authenticated users to keep financial information separated between accounts.

---

## 🎨 User Interface

The application provides a clean and intuitive interface with:

* Dashboard navigation
* Sidebar navigation
* Modal-based forms
* Financial summary cards
* Transaction management interfaces
* Budget management interfaces
* Settings and preference controls
* Light and dark themes
* Responsive layouts

---

## 🔒 Security Considerations

The application follows several security practices:

* Authentication for protected resources
* User-specific data access
* Environment variables for sensitive configuration
* Server-side validation
* Protected API operations
* Secure password reset workflow

Sensitive credentials such as database connection strings, JWT secrets, and SMTP credentials should always remain inside environment variables.

---

## 🚀 Future Improvements

Possible future enhancements include:

* Advanced financial analytics
* More detailed reporting
* Additional visualization options
* Recurring transactions
* Savings goals
* Multi-account support
* Enhanced notification channels
* Deployment and cloud hosting
* Progressive Web App support

---

## 👥 Contributors

Developed as a collaborative software project.

* **Development Team** — Personal Finance Tracker

---

## 📄 License

This project was developed for educational and academic purposes.

---
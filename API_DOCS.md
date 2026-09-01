# API Documentation — Budget, Alerts, Dashboard & Export

All endpoints are prefixed with `http://localhost:5000/api`

---

## Budget Endpoints

### Create Budget
**POST** `/budgets`

Creates a new budget goal.

**Body:**
```json
{
  "user": "userId",
  "category": "categoryId (optional — omit for an overall budget)",
  "amount": 1000,
  "period": "monthly"
}
```
`period` must be one of: `"weekly"`, `"monthly"`, `"yearly"`

**Response (201):** Returns the created budget object.

---

### Get Budgets
**GET** `/budgets?user=userId`

Returns all budgets belonging to a user.

**Response (200):** Array of budget objects.

---

### Update Budget
**PUT** `/budgets/:id`

Updates a specific budget by its ID.

**Body (any subset of):**
```json
{
  "amount": 1500,
  "period": "monthly"
}
```

**Response (200):** Returns the updated budget object.

---

### Delete Budget
**DELETE** `/budgets/:id`

Deletes a specific budget by its ID.

**Response (200):**
```json
{ "message": "Budget deleted successfully" }
```

---

## Alert Endpoints

### Check Budget Alert
**GET** `/alerts/check/:budgetId`

Calculates spending against a budget's limit for the current period, and creates an alert if 80% or 100% threshold is crossed. Won't create a duplicate alert for the same threshold within the same period.

**Response (200):**
```json
{
  "totalSpent": 900,
  "budgetAmount": 1000,
  "percentUsed": "90.0",
  "alertCreated": { "...alert object, or null if none created" },
  "alertAlreadyExisted": false
}
```

---

### Get Alerts
**GET** `/alerts?user=userId`

Returns all alerts for a user, newest first.

**Response (200):** Array of alert objects.

---

## Dashboard Endpoints

### Summary
**GET** `/dashboard/summary?user=userId`

Returns total income, total expense, and balance.

**Response (200):**
```json
{
  "totalIncome": 0,
  "totalExpense": 900,
  "balance": -900
}
```

---

### Spending by Category
**GET** `/dashboard/by-category?user=userId`

Returns total expense spending grouped by category name.

**Response (200):**
```json
[
  { "category": "Food", "total": 900 }
]
```

---

### Monthly Trend
**GET** `/dashboard/monthly-trend?user=userId`

Returns total expense spending grouped by month, sorted chronologically.

**Response (200):**
```json
[
  { "year": 2026, "month": 8, "monthName": "August", "total": 900 }
]
```

---

## Export Endpoints

### Export CSV
**GET** `/export/csv?user=userId`

Downloads a CSV file of the user's transaction history.

**Response:** File download (`transactions.csv`)

---

### Export PDF
**GET** `/export/pdf?user=userId`

Downloads a PDF report of the user's transaction history.

**Response:** File download (`transactions.pdf`)

---

## Notes
- All `user` and `category` fields expect real MongoDB ObjectIds.
- Auth-protected routes (Transactions, Categories, Auth) require an `Authorization: Bearer <token>` header — see Auth documentation separately.
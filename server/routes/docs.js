import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  const apiEndpoints = {
    "Financial Management System API": {
      "Authentication": {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login a user",
        "POST /api/auth/logout": "Logout a user"
      },
      "Profile Management": {
        "GET /api/profile": "Get user profile",
        "PUT /api/profile": "Update user profile",
        "POST /api/profile/change-password": "Change password",
        "DELETE /api/profile": "Delete account"
      },
      "Settings": {
        "GET /api/settings": "Get user settings",
        "PUT /api/settings": "Update all settings",
        "PATCH /api/settings": "Update a specific setting"
      },
      "Dashboard": {
        "GET /api/dashboard": "Get dashboard statistics"
      },
      "Expense Management": {
        "GET /api/expenses": "Get all expenses",
        "GET /api/expenses/:id": "Get expense by ID",
        "POST /api/expenses": "Create an expense",
        "PUT /api/expenses/:id": "Update an expense",
        "DELETE /api/expenses/:id": "Delete an expense"
      },
      "Expense Analytics": {
        "GET /api/expenses/stats/summary": "Get expense statistics",
        "GET /api/expenses/stats/monthly": "Get monthly expenses",
        "GET /api/expenses/filter": "Get filtered expenses",
        "GET /api/expenses/budget-overview": "Get budget overview",
        "GET /api/expenses/spending-trends": "Get spending trends",
        "GET /api/expenses/category-insights": "Get category insights",
        "GET /api/expenses/recent-activity": "Get recent activity",
        "GET /api/expenses/forecast": "Get expense forecast"
      },
      "Budget Management": {
        "GET /api/budgets": "Get all budgets",
        "POST /api/budgets": "Create a budget",
        "PUT /api/budgets/:id": "Update a budget",
        "DELETE /api/budgets/:id": "Delete a budget",
        "GET /api/budgets/overview": "Get budget overview"
      },
      "Financial Goals": {
        "POST /api/goals": "Create a financial goal",
        "GET /api/goals": "Get all financial goals",
        "PUT /api/goals/:id": "Update a financial goal",
        "DELETE /api/goals/:id": "Delete a financial goal"
      },
      "Reports": {
        "GET /api/reports/generate": "Generate a financial report"
      },
      "Recurring Expenses": {
        "POST /api/recurring": "Schedule recurring expense",
        "GET /api/recurring": "Get recurring expenses",
        "PUT /api/recurring/:id": "Update recurring expense",
        "DELETE /api/recurring/:id": "Delete recurring expense"
      },
      "Shared Expenses": {
        "POST /api/shared-expenses": "Create shared expense",
        "GET /api/shared-expenses": "Get shared expenses",
        "PUT /api/shared-expenses/:id": "Update shared expense",
        "DELETE /api/shared-expenses/:id": "Delete shared expense",
        "POST /api/shared-expenses/:id/settle": "Settle expense"
      },
      "Bill Management": {
        "POST /api/expenses/bills": "Set bill reminder",
        "GET /api/expenses/bills/upcoming": "Get upcoming bills",
        "PATCH /api/expenses/bills/:billId/paid": "Mark bill as paid"
      },
      "Alerts & Notifications": {
        "POST /api/expenses/budget-alert": "Set budget alert",
        "POST /api/expenses/savings-goal": "Track savings goal"
      }
    }
  };

  // Add a safety check to ensure apiEndpoints and its nested objects exist
  const mainApiKey = "Financial Management System API";
  const mainApiData = apiEndpoints[mainApiKey] || {};

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Financial Management API Documentation</title>
        <style>
          body {
             font-family: Arial, sans-serif;
             margin: 40px;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
             color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            color: #34495e;
            margin-top: 30px;
          }
          .endpoint {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #3498db;
          }
          .method {
            color: #2980b9;
            font-weight: bold;
            font-size: 1.1em;
          }
          .path {
            color: #555;
            margin: 5px 0;
          }
          .description {
            color: #666;
            font-size: 0.9em;
          }
          .get { border-left-color: #27ae60; }
          .get .method { color: #27ae60; }
          .post { border-left-color: #e74c3c; }
          .post .method { color: #e74c3c; }
          .put { border-left-color: #f39c12; }
          .put .method { color: #f39c12; }
          .delete { border-left-color: #c0392b; }
          .delete .method { color: #c0392b; }
          .patch { border-left-color: #8e44ad; }
          .patch .method { color: #8e44ad; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Financial Management System API Documentation</h1>
          ${Object.entries(mainApiData).map(([category, endpoints]) => {
            if (!endpoints) return ''; // Skip if endpoints is undefined
            
            return `
              <h2>${category}</h2>
              ${Object.entries(endpoints).map(([path, description]) => {
                if (!path) return ''; // Skip if path is undefined
                
                const methodParts = path.split(' ');
                const method = methodParts.length > 0 ? methodParts[0].toLowerCase() : '';
                const pathPart = methodParts.length > 1 ? methodParts[1] : path;
                
                return `
                  <div class="endpoint ${method}">
                    <div class="method">${methodParts[0] || ''}</div>
                    <div class="path">${pathPart}</div>
                    <div class="description">${description || ''}</div>
                  </div>
                `;
              }).join('')}
            `;
          }).join('')}
        </div>
      </body>
    </html>
  `;

  res.send(html);
});

export default router;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import RecurringExpenses from './pages/recurringExpenses/RecurringExpenses.jsx';
import SharedExpenses from './pages/sharedExpenses/SharedExpenses.jsx';
import Reports from './pages/reports/Reports.jsx';
import Goals from './pages/goals/Goals.jsx';
import Budget from './pages/budget/Budget.jsx';
import Expenses from './pages/expenses/Expenses.jsx';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings.jsx';

// Components
import PrivateRoute from './components/common/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Container fluid className="p-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Expenses />
              </PrivateRoute>
            }
          />

          <Route
            path="/budget"
            element={
              <PrivateRoute>
                <Budget />
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <PrivateRoute>
                <Goals />
              </PrivateRoute>
            }
          />

          <Route
            path="/shared"
            element={
              <PrivateRoute>
                <SharedExpenses />
              </PrivateRoute>
            }
          />

          <Route
            path="/recurring"
            element={
              <PrivateRoute>
                <RecurringExpenses />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />

          {/* Redirect to login if no route matches */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
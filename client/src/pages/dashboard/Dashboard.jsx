import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getExpenses } from '../../services/expense.js';
import './dashboard.css';

// Import dashboard components
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
// import ExpenseSummary from '../../components/expensesummary/ExpenseSummary.jsx';
import RecentTransactions from '../../components/recentTransactions/RecentTransactions.jsx';
import CategoryChart from '../../components/categoryChart/CategoryChart.jsx';
import MonthlyTrends from '../../components/monthyTrends/MonthlyTrends.jsx';

const ExpenseChart = ({ expenses }) => {
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ]
    }]
  };

  return (
    <div className="chart-container">
      <h2>Expense Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    recentTransactions: [],
    monthlyTrends: [],
    categoryBreakdown: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch expenses data
        const expenses = await getExpenses();
        
        // Set dashboard data
        setDashboardData({
          recentTransactions: expenses.slice(0, 5),
          monthlyTrends: [], // This would come from your backend
          categoryBreakdown: [] // This would come from your backend
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <Container fluid>
            <h1 className="dashboard-title">Dashboard</h1>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <Row className="mb-4">
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Body>
                        <Card.Title>Total Expenses</Card.Title>
                        <h3 className="text-primary">$1,250.00</h3>
                        <Card.Text>This Month</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Body>
                        <Card.Title>Budget Status</Card.Title>
                        <h3 className="text-success">$750.00</h3>
                        <Card.Text>Remaining</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Body>
                        <Card.Title>Top Category</Card.Title>
                        <h3 className="text-warning">Food</h3>
                        <Card.Text>$450.00</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Body>
                        <Card.Title>Upcoming Bills</Card.Title>
                        <h3 className="text-danger">$320.00</h3>
                        <Card.Text>Due this week</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col lg={8} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Monthly Spending Trends</h5>
                      </Card.Header>
                      <Card.Body>
                        <MonthlyTrends data={dashboardData.monthlyTrends} />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Category Breakdown</h5>
                      </Card.Header>
                      <Card.Body>
                        <CategoryChart data={dashboardData.categoryBreakdown} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Card className="dashboard-card">
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Transactions</h5>
                        <Link to="/expenses" className="btn btn-sm btn-primary">View All</Link>
                      </Card.Header>
                      <Card.Body>
                        <RecentTransactions transactions={dashboardData.recentTransactions} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
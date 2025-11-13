import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Alert } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getBudgets, createBudget, updateBudget, deleteBudget, getBudgetOverview } from '../../services/budget.js';
import './budget.css';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const categoryOptions = [
    'Housing', 'Transportation', 'Food', 'Utilities', 
    'Insurance', 'Healthcare', 'Entertainment', 'Personal',
    'Education', 'Savings', 'Other'
  ];

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const [budgetsResponse, overviewResponse] = await Promise.all([
        getBudgets(),
        getBudgetOverview()
      ]);
      
      setBudgets(budgetsResponse);
      setOverview(overviewResponse);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateBudget(currentId, formData);
      } else {
        await createBudget(formData);
      }
      resetForm();
      fetchBudgetData();
    } catch (error) {
      console.error('Error with budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period
    });
    setCurrentId(budget._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchBudgetData();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      period: 'monthly'
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const calculatePercentage = (budget) => {
    const spent = budget.spent || 0;
    const percentage = (spent / budget.amount) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const getBudgetStatus = (budget) => {
    const percentage = calculatePercentage(budget);
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const getBudgetMessage = (budget) => {
    const percentage = calculatePercentage(budget);
    const remaining = budget.amount - (budget.spent || 0);
    
    if (percentage >= 100) {
      return `You've exceeded your budget by ${Math.abs(remaining).toFixed(2)}`;
    }
    if (percentage >= 80) {
      return `You're approaching your budget limit. ${remaining.toFixed(2)} remaining`;
    }
    return `You're within budget. ${remaining.toFixed(2)} remaining`;
  };

  return (
    <div className="budget-container">
      <Navbar />
      <div className="budget-content">
        <Sidebar />
        <main className="budget-main">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title">Budget Management</h1>
              <Button
                variant="primary"
                onClick={() => {
                  if (showForm && editMode) {
                    resetForm();
                  } else {
                    setShowForm(!showForm);
                  }
                }}
              >
                {showForm ? (editMode ? 'Cancel Edit' : 'Cancel') : 'Create New Budget'}
              </Button>
            </div>

            {overview && (
              <Card className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Monthly Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h6>Total Budget</h6>
                        <h3 className="text-primary">${overview.totalBudget || 0}</h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h6>Total Spent</h6>
                        <h3 className="text-danger">${overview.totalSpent || 0}</h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h6>Remaining</h6>
                        <h3 className="text-success">${(overview.totalBudget || 0) - (overview.totalSpent || 0)}</h3>
                      </div>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <ProgressBar 
                      now={Math.min(((overview.totalSpent || 0) / (overview.totalBudget || 1)) * 100, 100)} 
                      variant={((overview.totalSpent || 0) / (overview.totalBudget || 1)) >= 1 ? 'danger' : 'primary'}
                    />
                  </div>
                </Card.Body>
              </Card>
            )}

            {showForm && (
              <Card className="mb-4">
                <Card.Header>{editMode ? 'Edit Budget' : 'Create Budget'}</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            required
                          >
                            <option value="">Select Category</option>
                            {categoryOptions.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Budget Amount</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Period</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          id="period-monthly"
                          label="Monthly"
                          value="monthly"
                          checked={formData.period === 'monthly'}
                          onChange={(e) => setFormData({...formData, period: e.target.value})}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="period-quarterly"
                          label="Quarterly"
                          value="quarterly"
                          checked={formData.period === 'quarterly'}
                          onChange={(e) => setFormData({...formData, period: e.target.value})}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="period-yearly"
                          label="Yearly"
                          value="yearly"
                          checked={formData.period === 'yearly'}
                          onChange={(e) => setFormData({...formData, period: e.target.value})}
                        />
                      </div>
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end">
                      <Button variant="secondary" className="me-2" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        {editMode ? 'Update Budget' : 'Create Budget'}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {budgets.length === 0 ? (
                  <Card className="text-center p-5">
                    <Card.Body>
                      <h4>No budgets found</h4>
                      <p>Create a budget to start tracking your spending against your limits.</p>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {budgets.map(budget => (
                      <Col md={6} lg={4} key={budget._id} className="mb-4">
                        <Card className="budget-card">
                          <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">{budget.category}</h5>
                            <div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(budget)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(budget._id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Budget: ${parseFloat(budget.amount).toFixed(2)}</span>
                              <span>Period: {budget.period}</span>
                            </div>
                            <div className="progress-container">
                              <ProgressBar 
                                now={calculatePercentage(budget)} 
                                variant={getBudgetStatus(budget)}
                              />
                            </div>
                            <div className="budget-details">
                              <span>Spent: ${(budget.spent || 0).toFixed(2)}</span>
                              <span>
                                {calculatePercentage(budget)}% used
                              </span>
                            </div>
                            <Alert 
                              variant={getBudgetStatus(budget)} 
                              className="budget-alert mt-3 mb-0"
                            >
                              {getBudgetMessage(budget)}
                            </Alert>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Budget;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getRecurringExpenses, scheduleRecurringExpense, updateRecurring, deleteRecurring } from '../../services/recurring.js';
import './recurringexpenses.css';

const RecurringExpenses = () => {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    frequency: 'monthly'
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchRecurringExpenses();
  }, []);

  const fetchRecurringExpenses = async () => {
    try {
      setLoading(true);
      const response = await getRecurringExpenses();
      setRecurringExpenses(response.data);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateRecurring(currentId, formData);
      } else {
        await scheduleRecurringExpense(formData);
      }
      resetForm();
      fetchRecurringExpenses();
    } catch (error) {
      console.error('Error with recurring expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      frequency: expense.frequency
    });
    setCurrentId(expense._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recurring expense?')) {
      try {
        await deleteRecurring(id);
        fetchRecurringExpenses();
      } catch (error) {
        console.error('Error deleting recurring expense:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      frequency: 'monthly'
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly'
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="recurring-expenses-container">
      <Navbar />
      <div className="recurring-expenses-content">
        <Sidebar />
        <main className="recurring-expenses-main">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title">Recurring Expenses</h1>
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
                {showForm ? (editMode ? 'Cancel Edit' : 'Cancel') : 'Schedule New Recurring Expense'}
              </Button>
            </div>

            {showForm && (
              <Card className="mb-4">
                <Card.Header>{editMode ? 'Edit Recurring Expense' : 'Schedule Recurring Expense'}</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Amount</Form.Label>
                          <Form.Control 
                            type="number" 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
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
                            <option value="Housing">Housing</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Food">Food</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Personal">Personal</option>
                            <option value="Education">Education</option>
                            <option value="Savings">Savings</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Frequency</Form.Label>
                          <Form.Select 
                            value={formData.frequency}
                            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                            required
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-flex justify-content-end">
                      <Button variant="secondary" className="me-2" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        {editMode ? 'Update' : 'Schedule'}
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
                {recurringExpenses.length === 0 ? (
                  <Card className="text-center p-5">
                    <Card.Body>
                      <h4>No recurring expenses found</h4>
                      <p>Schedule recurring expenses to keep track of regular payments.</p>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="recurring-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Amount</th>
                          <th>Category</th>
                          <th>Frequency</th>
                          <th>Next Due Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recurringExpenses.map(expense => (
                          <tr key={expense._id}>
                            <td>{expense.title}</td>
                            <td>${parseFloat(expense.amount).toFixed(2)}</td>
                            <td>
                              <Badge bg="info" className="category-badge">
                                {expense.category}
                              </Badge>
                            </td>
                            <td>{getFrequencyLabel(expense.frequency)}</td>
                            <td>{formatDate(expense.nextDueDate)}</td>
                            <td>
                              <Badge bg={expense.isActive ? 'success' : 'danger'}>
                                {expense.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEdit(expense)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(expense._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default RecurringExpenses;

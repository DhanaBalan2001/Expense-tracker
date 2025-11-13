import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../../services/expense.js';
import './expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateExpense(currentId, formData);
      } else {
        await createExpense(formData);
      }
      resetForm();
      fetchExpenses();
    } catch (error) {
      console.error('Error with expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || ''
    });
    setCurrentId(expense._id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      description: ''
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="expenses-container">
      <Navbar />
      <div className="expenses-content">
        <Sidebar />
        <main className="expenses-main">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title">Expenses</h1>
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
                {showForm ? (editMode ? 'Cancel Edit' : 'Cancel') : 'Add New Expense'}
              </Button>
            </div>

            {showForm && (
              <Card className="mb-4">
                <Card.Header>{editMode ? 'Edit Expense' : 'Add Expense'}</Card.Header>
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
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="d-flex justify-content-end">
                      <Button variant="secondary" className="me-2" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        {editMode ? 'Update Expense' : 'Add Expense'}
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
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Expense History</h5>
                </Card.Header>
                <Card.Body>
                  {expenses.length === 0 ? (
                    <div className="text-center p-4">
                      <p>No expenses found. Add your first expense to get started.</p>
                    </div>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map(expense => (
                          <tr key={expense._id}>
                            <td>{formatDate(expense.date)}</td>
                            <td>{expense.title}</td>
                            <td>{expense.category}</td>
                            <td>${parseFloat(expense.amount).toFixed(2)}</td>
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
                  )}
                </Card.Body>
              </Card>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Expenses;

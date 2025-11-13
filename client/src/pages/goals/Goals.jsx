import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getGoals, setFinancialGoal, updateGoal, deleteGoal } from '../../services/goal.js';
import './goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    targetAmount: '',
    deadline: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await getGoals();
      setGoals(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setFinancialGoal(formData);
      setFormData({
        targetAmount: '',
        deadline: '',
        category: '',
        description: ''
      });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const calculateProgress = (goal) => {
    // This would be replaced with actual progress data from your backend
    const currentAmount = goal.currentAmount || 0;
    const percentage = (currentAmount / goal.targetAmount) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="goals-container">
      <Navbar />
      <div className="goals-content">
        <Sidebar />
        <main className="goals-main">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title">Financial Goals</h1>
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Create New Goal'}
              </Button>
            </div>

            {showForm && (
              <Card className="mb-4">
                <Card.Header>Create Financial Goal</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Target Amount</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.targetAmount}
                            onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Deadline</Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
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
                            <option value="Savings">Savings</option>
                            <option value="Investment">Investment</option>
                            <option value="Emergency Fund">Emergency Fund</option>
                            <option value="Vacation">Vacation</option>
                            <option value="Education">Education</option>
                            <option value="Home">Home</option>
                            <option value="Vehicle">Vehicle</option>
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
                    
                    <Button variant="primary" type="submit">
                      Create Goal
                    </Button>
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
              <Row>
                {goals.length === 0 ? (
                  <Col>
                    <Card className="text-center p-5">
                      <Card.Body>
                        <h4>No financial goals found</h4>
                        <p>Create a financial goal to start tracking your progress.</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : (
                  goals.map(goal => (
                    <Col md={6} lg={4} key={goal._id} className="mb-4">
                      <Card className="h-100 goal-card">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0">{goal.category}</h5>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(goal._id)}
                          >
                            Delete
                          </Button>
                        </Card.Header>
                        <Card.Body>
                          <h4>{goal.description}</h4>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Target: ${goal.targetAmount}</span>
                            <span>Deadline: {formatDate(goal.deadline)}</span>
                          </div>
                          <div className="mb-3">
                            <ProgressBar 
                              now={calculateProgress(goal)} 
                              label={`${calculateProgress(goal)}%`}
                              variant={calculateProgress(goal) < 50 ? "warning" : "success"}
                            />
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Current: ${goal.currentAmount || 0}</span>
                            <span>Remaining: ${goal.targetAmount - (goal.currentAmount || 0)}</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                )}
              </Row>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Goals;

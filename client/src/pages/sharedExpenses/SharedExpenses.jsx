import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { getSharedExpenses, createSharedExpense, settleExpense } from '../../services/shared.js';
import './sharedexpenses.css';

const SharedExpenses = () => {
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    participants: [],
    splitType: 'equal'
  });
  const [participantEmail, setParticipantEmail] = useState('');

  useEffect(() => {
    fetchSharedExpenses();
  }, []);

  const fetchSharedExpenses = async () => {
    try {
      setLoading(true);
      const response = await getSharedExpenses();
      setSharedExpenses(response.data);
    } catch (error) {
      console.error('Error fetching shared expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make sure participants is properly formatted
      const formattedData = {
        ...formData,
        participants: formData.participants.map(p => ({
          userId: p.userId, // This should be a valid user ID
          share: formData.splitType === 'equal' ? 0 : p.share
        }))
      };

      await createSharedExpense(formattedData);
      
      setFormData({
        title: '',
        amount: '',
        participants: [],
        splitType: 'equal'
      });
      setShowForm(false);
      fetchSharedExpenses();
    } catch (error) {
      console.error('Error creating shared expense:', error);
    }
  };

  const handleAddParticipant = () => {
    if (participantEmail) {
      setFormData({
        ...formData,
        participants: [
          ...formData.participants, 
          { userId: participantEmail, share: formData.splitType === 'equal' ? 0 : '' }
        ]
      });
      setParticipantEmail('');
    }
  };

  const handleSettle = async (id) => {
    try {
      await settleExpense(id);
      fetchSharedExpenses();
    } catch (error) {
      console.error('Error settling expense:', error);
    }
  };

  return (
    <div className="shared-expenses-container">
      <Navbar />
      <div className="shared-expenses-content">
        <Sidebar />
        <main className="shared-expenses-main">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title">Shared Expenses</h1>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Create New Shared Expense'}
              </Button>
            </div>

            {showForm && (
              <Card className="mb-4">
                <Card.Header>Create Shared Expense</Card.Header>
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
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Split Type</Form.Label>
                      <Form.Select 
                        value={formData.splitType}
                        onChange={(e) => setFormData({...formData, splitType: e.target.value})}
                      >
                        <option value="equal">Equal Split</option>
                        <option value="custom">Custom Split</option>
                      </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Add Participants</Form.Label>
                      <div className="d-flex">
                        <Form.Control 
                          type="email" 
                          placeholder="Enter email"
                          value={participantEmail}
                          onChange={(e) => setParticipantEmail(e.target.value)}
                        />
                        <Button 
                          variant="outline-primary" 
                          className="ms-2"
                          onClick={handleAddParticipant}
                        >
                          Add
                        </Button>
                      </div>
                    </Form.Group>
                    
                    {formData.participants.length > 0 && (
                      <div className="mb-3">
                        <h6>Participants:</h6>
                        <ul className="list-group">
                          {formData.participants.map((p, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              {p.userId}
                              {formData.splitType === 'custom' && (
                                <Form.Control 
                                  type="number" 
                                  placeholder="Share amount"
                                  value={p.share}
                                  onChange={(e) => {
                                    const updatedParticipants = [...formData.participants];
                                    updatedParticipants[index].share = e.target.value;
                                    setFormData({...formData, participants: updatedParticipants});
                                  }}
                                  style={{width: '120px'}}
                                />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button variant="primary" type="submit">
                      Create Shared Expense
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
              <>
                {sharedExpenses.length === 0 ? (
                  <Card className="text-center p-5">
                    <Card.Body>
                      <h4>No shared expenses found</h4>
                      <p>Create a shared expense to split costs with friends or colleagues.</p>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {sharedExpenses.map(expense => (
                      <Col md={6} lg={4} key={expense._id} className="mb-4">
                        <Card>
                          <Card.Header className="d-flex justify-content-between">
                            <h5 className="mb-0">{expense.title}</h5>
                            <Badge bg={expense.status === 'settled' ? 'success' : 'warning'}>
                              {expense.status}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <p className="mb-2"><strong>Total Amount:</strong> ${expense.amount}</p>
                            <p className="mb-2"><strong>Split Type:</strong> {expense.splitType}</p>
                            <p className="mb-3"><strong>Participants:</strong></p>
                            <Table size="sm" bordered>
                              <thead>
                                <tr>
                                  <th>User</th>
                                  <th>Share</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {expense.participants.map((p, index) => (
                                  <tr key={index}>
                                    <td>{p.user?.email || p.user}</td>
                                    <td>${p.share}</td>
                                    <td>
                                      <Badge bg={p.paid ? 'success' : 'danger'}>
                                        {p.paid ? 'Paid' : 'Unpaid'}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            
                            {expense.status !== 'settled' && (
                              <Button 
                                variant="success" 
                                className="mt-3 w-100"
                                onClick={() => handleSettle(expense._id)}
                              >
                                Mark My Share as Paid
                              </Button>
                            )}
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

export default SharedExpenses;

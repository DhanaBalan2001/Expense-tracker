import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './expensesummary.css';

const ExpenseSummary = ({ totalExpense, budgetRemaining, topCategory, upcomingBills }) => {
  return (
    <Row className="mb-4">
      <Col md={6} lg={3} className="mb-3">
        <Card className="summary-card">
          <Card.Body>
            <Card.Title>Total Expenses</Card.Title>
            <h3 className="text-primary">${totalExpense || '0.00'}</h3>
            <Card.Text>This Month</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} lg={3} className="mb-3">
        <Card className="summary-card">
          <Card.Body>
            <Card.Title>Budget Status</Card.Title>
            <h3 className="text-success">${budgetRemaining || '0.00'}</h3>
            <Card.Text>Remaining</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} lg={3} className="mb-3">
        <Card className="summary-card">
          <Card.Body>
            <Card.Title>Top Category</Card.Title>
            <h3 className="text-warning">{topCategory?.category || 'None'}</h3>
            <Card.Text>${topCategory?.amount || '0.00'}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6} lg={3} className="mb-3">
        <Card className="summary-card">
          <Card.Body>
            <Card.Title>Upcoming Bills</Card.Title>
            <h3 className="text-danger">${upcomingBills?.total || '0.00'}</h3>
            <Card.Text>Due this week</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ExpenseSummary;

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar.jsx';
import Sidebar from '../../components/sidebar/Sidebar.jsx';
import { generateReport } from '../../services/report.js';
import './reports.css';

const Reports = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    categories: [],
    format: 'pdf'
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    'Housing', 'Transportation', 'Food', 'Utilities', 
    'Insurance', 'Healthcare', 'Entertainment', 'Personal',
    'Education', 'Savings', 'Other'
  ];

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, value]
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter(category => category !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const queryParams = new URLSearchParams({
        startDate: formData.startDate,
        endDate: formData.endDate,
        categories: formData.categories.join(','),
        format: formData.format
      }).toString();
      
      // For file downloads, we need to handle it differently
      window.open(`${process.env.REACT_APP_API_URL}/api/reports/generate?${queryParams}`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <Navbar />
      <div className="reports-content">
        <Sidebar />
        <main className="reports-main">
          <Container fluid>
            <h1 className="page-title mb-4">Generate Reports</h1>
            
            <Card>
              <Card.Header>Report Parameters</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Categories</Form.Label>
                    <div className="d-flex flex-wrap">
                      {categoryOptions.map(category => (
                        <Form.Check
                          key={category}
                          type="checkbox"
                          id={`category-${category}`}
                          label={category}
                          value={category}
                          onChange={handleCategoryChange}
                          className="me-3 mb-2"
                        />
                      ))}
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Report Format</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        id="format-pdf"
                        label="PDF"
                        value="pdf"
                        checked={formData.format === 'pdf'}
                        onChange={(e) => setFormData({...formData, format: e.target.value})}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        id="format-excel"
                        label="Excel"
                        value="excel"
                        checked={formData.format === 'excel'}
                        onChange={(e) => setFormData({...formData, format: e.target.value})}
                      />
                    </div>
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Report'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            <Row className="mt-4">
              <Col md={6}>
                <Card>
                  <Card.Header>Expense Comparison</Card.Header>
                  <Card.Body>
                    <p>Compare expenses between two time periods to track your spending habits.</p>
                    <Button variant="outline-primary">Create Comparison Report</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>Budget Analysis</Card.Header>
                  <Card.Body>
                    <p>Analyze your budget performance and identify areas for improvement.</p>
                    <Button variant="outline-primary">Create Budget Report</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Reports;

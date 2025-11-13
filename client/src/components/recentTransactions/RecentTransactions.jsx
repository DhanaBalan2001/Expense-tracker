import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import './recenttransactions.css';

const RecentTransactions = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return <p className="text-center text-muted">No recent transactions found.</p>;
  }

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'Food': 'warning',
      'Transport': 'info',
      'Entertainment': 'primary',
      'Utilities': 'danger',
      'Housing': 'success',
      'Healthcare': 'secondary'
    };
    return colors[category] || 'primary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="recent-transactions">
      <Table responsive hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>
                <Badge bg={getCategoryBadgeColor(transaction.category)}>
                  {transaction.category}
                </Badge>
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td className="text-end fw-bold">${transaction.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RecentTransactions;

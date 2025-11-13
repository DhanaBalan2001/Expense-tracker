import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/expenses" 
          className={location.pathname === '/expenses' ? 'active' : ''}
        >
          Expenses
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/budget" 
          className={location.pathname === '/budget' ? 'active' : ''}
        >
          Budget
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/reports" 
          className={location.pathname === '/reports' ? 'active' : ''}
        >
          Reports
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/goals" 
          className={location.pathname === '/goals' ? 'active' : ''}
        >
          Goals
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/shared" 
          className={location.pathname === '/shared' ? 'active' : ''}
        >
          Shared Expenses
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/recurring" 
          className={location.pathname === '/recurring' ? 'active' : ''}
        >
          Recurring
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;

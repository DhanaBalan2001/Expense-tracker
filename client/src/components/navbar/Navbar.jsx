import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './navbar.css';

const AppNavbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="app-navbar">
      <Container fluid>
        <Navbar.Brand href="/dashboard">Expense Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
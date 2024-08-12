// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleRegisterGroundClick = () => {
    navigate('/register-ground');
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/">myKerchief</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/map">Map</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
              <Button variant="outline-light" onClick={handleRegisterGroundClick}>Register Ground</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;

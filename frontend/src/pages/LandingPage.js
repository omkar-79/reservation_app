import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Navbar, Nav, Button, Row, Col, Image } from 'react-bootstrap';
import '../css/LandingPage.css'; // Ensure this path is correct

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/auth');
  };
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#home">ReserveIt</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            <Nav.Link href="/map">Map</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section" id="home">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <h1>Welcome to ReserveIt</h1>
              <p>Book sports grounds effortlessly and manage your reservations in one place.</p>
              <Button variant="primary" size="lg" onClick={handleGetStartedClick}>Get Started</Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="features-section" id="features">
        <Row>
          <Col md={4}>
            <Image src="https://via.placeholder.com/150" roundedCircle />
            <h3>Easy Booking</h3>
            <p>Reserve sports grounds with just a few clicks.</p>
          </Col>
          <Col md={4}>
            <Image src="https://via.placeholder.com/150" roundedCircle />
            <h3>Manage Reservations</h3>
            <p>View and manage your reservations from your dashboard.</p>
          </Col>
          <Col md={4}>
            <Image src="https://via.placeholder.com/150" roundedCircle />
            <h3>Real-Time Availability</h3>
            <p>Check the availability of sports grounds in real-time.</p>
          </Col>
        </Row>
      </Container>

      {/* About Section */}
      <div className="about-section" id="about">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <h2>About ReserveIt</h2>
              <p>ReserveIt is designed to simplify the process of booking sports grounds. Whether you're planning a casual game or a serious training session, our platform ensures you have the best spots reserved.</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <p>&copy; 2024 ReserveIt. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;

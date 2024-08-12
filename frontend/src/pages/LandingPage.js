import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Row, Col, Image } from 'react-bootstrap';
import '../css/LandingPage.css'; // Ensure this path is correct
import Header from '../components/Header'

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/map');
  };

  const handleRegisterGroundClick = () => {
    navigate('/register-ground'); // Navigate to the RegisterGround page
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <div className="hero-section" id="home">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <h1>Welcome to myKerchief</h1>
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

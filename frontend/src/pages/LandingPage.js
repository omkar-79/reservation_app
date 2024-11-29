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

  return (
    <div>
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
{/* Hero Section */}
<div className="hero-section" id="home">
  <Container>
    <Row className="justify-content-center">
      <Col md={8} className="text-center">
        <h1>Welcome to myKerchief</h1>
        <p>Book sports grounds effortlessly.</p>
        <Button variant="primary" size="lg" onClick={handleGetStartedClick}>
          Get Started
        </Button>
      </Col>
    </Row>
  </Container>
</div>



{/* Tagline Section */}
<div className="tagline-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} className="text-center">
              <h2>Your all-in-one solution to book and manage your favorite sports facilities effortlessly.</h2>
            </Col>
          </Row>
        </Container>
      </div>

       {/* Conversation Section */}
       <div className="conversation-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h3 className="conversation-title">Where did the idea come from?</h3>
              <div className="conversation">
                <div className="bubble first">Let's go play tennis!</div>
                <div className="bubble second">
                  Ugh! There's always a long waiting line, and we need to stand in a queue.
                </div>
                <div className="bubble third">
                  That's true. I wish there was a platform where we could reserve tennis courts.
                </div>
                <div className="bubble second">
                  Wait! Why not develop a web platform to reserve sports facilities?
                </div>
              </div>
              <h3 className="conversation-end">
                Tadaa! That’s how myKerchief was born 🎉
              </h3>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row className="justify-content-center">
            <Col>
              <p>&copy; 2024 myKerchief. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};



export default LandingPage;

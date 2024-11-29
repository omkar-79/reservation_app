import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode the token
import '../css/Header.css'; // Assuming you're adding custom CSS for hover effects and responsiveness

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if auth token exists and get the user role
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
      setIsAuthenticated(false);
      setUserRole('');
      setUserId('');
    } else {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const userId = decodedToken.userId;
      const userRole = decodedToken.role;
      console.log('Role:', userRole); // Log to debug

      setIsAuthenticated(true);
      setUserRole(userRole);
      setUserId(userId);
    }
  }, []);

  const handleRegisterGroundClick = () => {
    navigate('/register-ground');
  };

  const handleProfileClick = () => {
    if (userRole === 'Reservee') {
      navigate('/reservee');
    } else if (userRole === 'Facility Owner') {
      navigate('/facility-owner');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole('');
    setUserId('');
    navigate('/');
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/" className="brand-name">myKerchief</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/map" className="nav-item">Map</Nav.Link>
              <Nav.Link href="#about" className="nav-item">About</Nav.Link>
              <Nav.Link href="#features" className="nav-item">Guide</Nav.Link>
              <Nav.Link href="#contact" className="nav-item">Contact</Nav.Link>
              {userRole === 'Facility Owner' && (
                  <Nav.Link onClick={handleRegisterGroundClick} className="nav-item">Register a Facility</Nav.Link>
                )}
                {/* Conditionally render based on authentication status */}
            
            {!isAuthenticated ? (
              <Nav.Link onClick={() => navigate('/auth')} className="nav-item">Sign In / Sign Up</Nav.Link>
            ) : (
              <>
                <Nav.Link onClick={handleProfileClick} className="nav-item">Profile</Nav.Link>
                <Nav.Link onClick={handleSignOut} className="nav-item">Sign Out</Nav.Link>
              </>
            )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import RegisterGround from './pages/RegisterGround';
import ReservationPage from './pages/ReservationPage';  // Import the signup/login page
import ProfilePage from './pages/ReserveeProfile';
import FacilityOwnerProfile from './pages/FacilityOwnerProfile';  // Import the signup/login page

const App = () => {
  return (


    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/map" element={<HomePage />} />
        <Route path="/reservee" element={<ProfilePage />} />
        <Route path="/facility-owner" element={<FacilityOwnerProfile />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/register-ground" element={<RegisterGround />} /> 
      </Routes>
    </Router>

  );
};

export default App;

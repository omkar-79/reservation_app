import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../css/AuthPage.css';
import Header from '../components/Header';

const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    createpassword: '',
    repeatpassword: '',
    role: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value); 
    if (e.target.type === 'radio') {
      // Update 'role' if it's a radio button
      setFormData({ ...formData, role: e.target.value });
    } else {
      // For other inputs (like text, password, etc.), use e.target.id
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (mode === 'login') {
        // Login request
        const response = await axios.post('http://localhost:3000/users/login', {
          username: formData.username,
          password: formData.password,
        });

        const { token } = response.data;
        setMessage('Login successful!');

        // Store the token
        localStorage.setItem('token', token);

        // Check if user was redirected from reservation page
        const redirectPath = localStorage.getItem('redirectPath') || '/map';
        navigate(redirectPath); // Redirect to the appropriate page
        localStorage.removeItem('redirectPath'); // Clean up
      } else {
        // Sign up request
        if (formData.createpassword !== formData.repeatpassword) {
          setMessage('Passwords do not match!');
          return;
        }
        await axios.post('http://localhost:3000/users/signup', {
          username: formData.username,
          password: formData.createpassword,
          email: formData.email,
          role: formData.role,

        });
        setMessage('Sign up successful!');

        // Redirect to login page
        navigate('/auth');
      }
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.error : 'An error occurred'}`);
    }
  };
  const handleGoogleSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const res = await axios.post('http://localhost:3000/users/google-signin', { tokenId });
      const { token } = res.data;

      // Store token and navigate
      localStorage.setItem('token', token);
      navigate('/map');
    } catch (error) {
      setMessage('Google Sign-In failed!');
    }
  };

  const handleGoogleFailure = () => {
    setMessage('Google Sign-In failed!');
  };


  return (
    
    <div className={`app app--is-${mode}`}>
      <Header />
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>
      <section className={`form-block form-block--is-${mode}`}>
        <header className="form-block__header">
          <h1>{mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
          <div className="form-block__toggle-block">
            <span>{mode === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}</span>
            <div className="form-toggle-buttons">
              {mode === 'login' && (
                <button className={`toggle-button ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
                  Sign Up
                </button>
              )}
              {mode === 'signup' && (
                <button className={`toggle-button ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
                  Login
                </button>
              )}
            </div>
          </div>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-block__input-wrapper">
            {mode === 'login' && (
              <>
                <Input type="text" id="username" label="Username" value={formData.username} onChange={handleChange} />
                <Input type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
              </>
            )}
            {mode === 'signup' && (
              <>
                <Input type="text" id="username" label="Username" value={formData.username} onChange={handleChange} />
                <Input type="email" id="email" label="Email" value={formData.email} onChange={handleChange} />
                <Input type="password" id="createpassword" label="Password" value={formData.createpassword} onChange={handleChange} />
                <Input type="password" id="repeatpassword" label="Repeat Password" value={formData.repeatpassword} onChange={handleChange} />
                <div className="form-group">
  <label>Role</label>
  <div>
    <label>
      <input 
        type="radio" 
        name="role" // Group by name "role"
        value="Reservee" 
        checked={formData.role === 'Reservee'} 
        onChange={handleChange} 
      />
      Reservee
    </label>
    <label>
      <input 
        type="radio" 
        name="role" 
        value="Facility Owner" 
        checked={formData.role === 'Facility Owner'} 
        onChange={handleChange} 
      />
      Facility Owner
    </label>
  </div>
</div>

              </>
            )}
          </div>
          <button className="button button--primary full-width" type="submit">{mode === 'login' ? 'Log In' : 'Sign Up'}</button>
          
          <div className="message">{message}</div>
        </form>
      </section>
    </div>
  );
};

const Input = ({ label, id, type, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} value={value} onChange={onChange} className="form-group__input" required />
  </div>
);

export default AuthPage;

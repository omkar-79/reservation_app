import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../css/FacilityOwnerProfile.css';
import Header from '../components/Header';


const FacilityOwnerProfile = () => {
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      const token = localStorage.getItem('token'); // Assume token is stored in local storage
      console.log('Token:', token);

      if (!token) {
        alert('You must be logged in to view this page.');
        return;
      }

      try {
        // Decode the token to extract userId
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        const userId = decodedToken.userId;
        if (!userId) {
          console.error('User ID not found in token.');
          setError('Invalid user session. Please log in again.');
          return;
        }
        console.log('User ID:', userId);

        // Pass the userId to the backend as a query parameter
        const response = await axios.get(
          `http://localhost:3000/api/grounds/facilityprofile?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setOwnerData(response.data);
        }
      } catch (err) {
        console.error('Error fetching facility owner data:', err);
        setError('Unable to fetch facility owner data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="facility-owner-profile-container"><Header />
    
    <div className="facility-owner-profile">
        
      <h1>{ownerData.username}'s Profile</h1>
      <p><strong>Email:</strong> {ownerData.email}</p>

      <h2>Your Grounds</h2>
      {ownerData.grounds.length === 0 ? (
        <p className="no-grounds">No grounds found</p>
      ) : (
        <div className="grounds-list">
          {ownerData.grounds.map((ground) => (
            <div className="ground-card" key={ground._id}>
              <h3>{ground.name}</h3>
              <p><strong>Description:</strong> {ground.description}</p>
              <p><strong>Address:</strong> {ground.address}</p>
              <p><strong>Total Courts:</strong> {ground.totalCourts}</p>
              <p><strong>Timings:</strong> {ground.timings.from} - {ground.timings.to}</p>
              <p><strong>Time Slot Duration:</strong> {ground.timeSlotDuration} minutes</p>
              <div className="ground-images">
                {ground.images.length > 0 ? (
                  ground.images.map((image, index) => (
                    <img key={index} src={image} alt={`Ground ${ground.name}`} />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default FacilityOwnerProfile;

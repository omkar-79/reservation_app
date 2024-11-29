import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/ReserveeProfile.css';
import Header from '../components/Header';
const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debug log to check if the token is being retrieved correctly
            
            if (!token) {
                alert('You must be logged in to view your profile');
                navigate('/auth');
                return;
            }

            try {
                console.log('Fetching user profile data...'); // Debug log to check the API call
                const response = await axios.get('http://localhost:3000/users/reservee', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response && response.data) {
                    console.log('User profile data received:', response.data); // Debug log to check the response data
                    setUserData(response.data);
                } else {
                    console.error('No data returned from API');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('Error fetching profile');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    if (!userData) {
        console.log('User data is loading or not yet available'); // Debug log to check if data is being fetched
        return <div>Loading...</div>;
    }

    console.log('Rendering profile page with user data:', userData); // Debug log to check final data before rendering

    return (
        <div className="reservee-profile">
             <Header />
        
        <div className="profile-page">
           
            <h1>{userData.username}'s Profile</h1>
            <p><strong>Email:</strong> {userData.email}</p>

            <h2>Your Reservations</h2>
            {userData.reservations.length === 0 ? (
                <p>No reservations found</p>
            ) : (
                <ul>
                    {userData.reservations.map((reservation, index) => (
                        <li key={index}>
                            <p><strong>Reservation ID:</strong> {reservation.reservationId}</p>
                            <p><strong>Ground:</strong> {reservation.groundName}</p>
                            <p><strong>Address:</strong> {reservation.groundAddress}</p>
                            <p><strong>Court:</strong> {reservation.courtName || 'N/A'}</p>
                            <p><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                            <p><strong>Time Slots:</strong>
                                {reservation.timeSlots.length === 0 ? (
                                    <span>No time slots available</span>
                                ) : (
                                    reservation.timeSlots.map((slot, slotIndex) => {
                                        console.log(`Rendering time slot ${slotIndex}:`, slot); // Log each time slot data
                                        const startTime = slot.start ? new Date(`2024-11-28T${slot.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Start';
                                        const endTime = slot.end ? new Date(`2024-11-28T${slot.end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown End';
                                        console.log(`Rendering time slot: ${startTime} - ${endTime}`); // Debug log for each time slot's start and end times
                                        return (
                                            <span key={slotIndex}>
                                                {startTime} - {endTime}
                                                {slotIndex < reservation.timeSlots.length - 1 && ' | '}
                                            </span>
                                        );
                                    })
                                )}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
    );
};

export default ProfilePage;

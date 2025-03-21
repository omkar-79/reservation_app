import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ReserveeProfile.css';
import Header from '../components/Header';
import api from '../services/api';


const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            
            if (!token) {
                alert('You must be logged in to view your profile');
                navigate('/auth');
                return;
            }

            try {
                console.log('Fetching user profile data...');
                const response = await api.get('/users/reservee', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response && response.data) {
                    console.log('User profile data received:', response.data);
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

    const handleCancelReservation = async (reservationId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to cancel a reservation');
            navigate('/auth');
            return;
        }

        try {
            await api.post(`/api/reservations/cancel/${reservationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the UI by removing the cancelled reservation
            setUserData(prevData => ({
                ...prevData,
                reservations: prevData.reservations.filter(res => res.reservationId !== reservationId)
            }));

            alert('Reservation cancelled successfully');
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Error cancelling reservation');
        }
    };

    if (!userData) {
        console.log('User data is loading or not yet available');
        return <div>Loading...</div>;
    }

    console.log('Rendering profile page with user data:', userData);

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
                                            console.log(`Rendering time slot ${slotIndex}:`, slot);
                                            const startTime = slot.start ? new Date(`2024-11-28T${slot.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown Start';
                                            const endTime = slot.end ? new Date(`2024-11-28T${slot.end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown End';
                                            console.log(`Rendering time slot: ${startTime} - ${endTime}`);
                                            return (
                                                <span key={slotIndex}>
                                                    {startTime} - {endTime}
                                                    {slotIndex < reservation.timeSlots.length - 1 && ' | '}
                                                </span>
                                            );
                                        })
                                    )}
                                </p>
                                <button onClick={() => handleCancelReservation(reservation.reservationId)}>
                                    Cancel Reservation
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;

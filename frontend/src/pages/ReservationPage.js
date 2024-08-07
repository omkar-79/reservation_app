import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tennisCourtIcon } from '../assets/facility';
import '../css/ReservationPage.css';

const ReservationPage = () => {
    const { id } = useParams(); // Get the ground ID from the URL

    const [selectedCourt, setSelectedCourt] = useState(null); // New state for selected court
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [ground, setGround] = useState(null);
    const [courts, setCourts] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        // Fetch ground details from backend
        const fetchGround = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/grounds/${id}`);
                setGround(response.data);
            } catch (error) {
                console.error('Error fetching ground details', error);
            }
        };

        fetchGround();
    }, [id]);

    useEffect(() => {
        // Fetch courts for the ground
        const fetchCourts = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/courts/by-ground/${id}`);
                setCourts(response.data);
            } catch (error) {
                console.error('Error fetching courts', error);
            }
        };

        fetchCourts();
    }, [id]);

    useEffect(() => {
        // Fetch available time slots based on selected date and court
        const fetchAvailableTimeSlots = async () => {
            if (selectedDate && selectedCourt) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/courts/${selectedCourt}/time-slots/${selectedDate}`);
                    setTimeSlots(response.data);
                } catch (error) {
                    console.error('Error fetching available time slots', error);
                }
            }
        };

        fetchAvailableTimeSlots();
    }, [selectedDate, selectedCourt]);

    const handleCourtClick = (courtId) => {
        setSelectedCourt(courtId); // Set selected court
    };

    const handleSlotClick = (slot) => {
        setSelectedSlots((prev) =>
            prev.includes(slot)
                ? prev.filter(s => s !== slot)
                : [...prev, slot]
        );
    };

    const handleReservation = async () => {
        try {
            // Post reservation to backend
            await axios.post('http://localhost:3000/api/reservations', {
                groundId: id,
                userId: 'user123', // Replace with actual user ID
                date: selectedDate,
                timeSlots: selectedSlots,
                courtId: selectedCourt, // Use selected court
                reservationId: 'reservation123' // Generate or replace with actual ID
            });

            alert('Reservation created successfully!');
        } catch (error) {
            alert('Error creating reservation');
        }
    };

    if (!ground) return <div>Loading...</div>;

    return (
        <div className="reservation-page">
            <h1>Reservation Details</h1>
            <div className="reservation-info">
                <h2>{ground.name}</h2>
                <p><strong>Location:</strong> {ground.address}</p>
                <p><strong>Timings:</strong> {ground.timings.from} - {ground.timings.to}</p>
                <p><strong>Description:</strong> {ground.description}</p>

                {/* Date Selection */}
                <div className="date-selection">
                    <label htmlFor="reservation-date">Select Date:</label>
                    <input
                        type="date"
                        id="reservation-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* Court Selection Section */}
                <div className="court-list">
    {courts.length === 0 ? (
        <p>No courts available</p>
    ) : (
        courts.map((court) => (
            <div
                key={court._id}
                className={`court ${selectedCourt === court._id ? 'selected' : ''}`}
                onClick={() => handleCourtClick(court._id)}
            >
                <img src={tennisCourtIcon} alt="Court Icon" className="court-icon" />
                Court {court._id}
            </div>
        ))
    )}
</div>


                {/* Time Slot Selection */}
                <div className="time-slot-selection">
                    <h3>Select Time Slots</h3>
                    <div className="time-slots">
                        {timeSlots.length > 0 ? (
                            timeSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className={`time-slot ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    {slot}
                                </div>
                            ))
                        ) : (
                            <p>No time slots available</p>
                        )}
                    </div>
                </div>

                <button className="reserve-button" onClick={handleReservation}>Reserve Now</button>
            </div>
        </div>
    );
};

export default ReservationPage;

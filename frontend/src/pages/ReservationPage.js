import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tennisCourtIcon } from '../assets/facility';
import '../css/ReservationPage.css';
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



const ReservationPage = () => {
    const { id } = useParams(); // Get the ground ID from the URL

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [ground, setGround] = useState(null);
    const [courts, setCourts] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    // Inside your component:
const navigate = useNavigate();


    // Function to fetch ground details and courts
    const fetchGroundAndCourts = useCallback(async () => {
        try {
            const [groundResponse, courtsResponse] = await Promise.all([
                axios.get(`http://localhost:3000/api/grounds/${id}`),
                axios.get(`http://localhost:3000/api/courts/by-ground/${id}`)
            ]);
            console.log('Fetched courts:', courtsResponse.data); 
            setGround(groundResponse.data);
            setCourts(courtsResponse.data);
        } catch (error) {
            console.error('Error fetching ground details and courts', error);
        }
    }, [id]);

    // Function to fetch available time slots
    const fetchAvailableTimeSlots = useCallback(async () => {
        if (!selectedDate || !selectedCourt) return;
    
        console.log("Fetching time slots for Court:", selectedCourt, "Date:", selectedDate); // Log to debug
    
        try {
            const response = await axios.get(`http://localhost:3000/api/courts/${selectedCourt}/time-slots/${selectedDate}`);
            console.log("Fetched time slots:", response.data); // Log API response
    
            // Ensure the correct data is being set
            setTimeSlots(response.data.timeSlots || []); // Safely set timeSlots array or an empty array
        } catch (error) {
            console.error('Error fetching available time slots', error);
        }
    }, [selectedDate, selectedCourt]);
    
    

    // Fetch ground and courts on component mount
    useEffect(() => {
        fetchGroundAndCourts();
    }, [fetchGroundAndCourts]);

    // Fetch time slots when selectedDate or selectedCourt changes
    useEffect(() => {
        if (selectedDate && selectedCourt) {
            fetchAvailableTimeSlots();
        }
    }, [fetchAvailableTimeSlots, selectedDate, selectedCourt]);
    

    // Handle court selection
    const handleCourtClick = (courtId) => {
        console.log('Court clicked:', courtId);
        if (courtId) {
            setSelectedCourt(courtId);
        } else {
            console.error('Invalid courtId:', courtId);
        }
    };
    

    // Handle time slot selection
    const handleSlotClick = (slot) => {
        setSelectedSlots((prev) =>
            prev.includes(slot)
                ? prev.filter(s => s !== slot)
                : [...prev, slot]
        );
    };


    
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        if (newDate) {
            setSelectedDate(newDate);
        } else {
            console.error('Invalid date:', newDate);
        }
    };
    
    // Handle reservation submission
// Handle reservation submission
const handleReservation = async () => {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Check if the user is authenticated
        if (!token) {
            alert('You must be logged in to make a reservation');
            navigate('/auth');
            return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        await axios.post(
            'http://localhost:3000/api/reservations',
            {
                groundId: id,
                userId: userId, // Replace with actual user ID
                date: selectedDate,
                timeSlots: selectedSlots,
                courtId: selectedCourt,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
            }
        );

        alert('Reservation created successfully!');
    } catch (error) {
        alert('Error creating reservation');
    }
};


    if (!ground) return <div>Loading...</div>;

    return (
        <div className="reservation-page">
            <Header />
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
        onChange={(e) => {
            const newDate = e.target.value;
            setSelectedDate(newDate);
            console.log("Selected Date:", newDate); // Log the selected date
        }}
    />
</div>


                {/* Court Selection Section */}
                <div className="court-list">
                {courts.map((court) => {
    console.log('Court object:', court); // Log court object (which is the court ID string)
    return (
        <div
            key={court} // Use court directly as it's already the ID
            className={`court ${selectedCourt === court ? 'selected' : ''}`} // Compare selectedCourt with court directly
            onClick={() => handleCourtClick(court)} // Pass court directly
        >
            <img src={tennisCourtIcon} alt="Court Icon" className="court-icon" />
            Court {court} {/* Display the court ID */}
        </div>
    );
})}


                </div>




                <div className="time-slot-selection">
    <h3>Select Time Slots</h3>
    <div className="time-slots">
        {timeSlots.length > 0 ? (
            timeSlots.map((slot, index) => {
                if (typeof slot !== 'string') {
                    console.error('Invalid time slot format:', slot);
                    return null; // or handle accordingly
                }
                console.log('Rendering slot:', slot); // Log each slot
                return (
                    <div
                        key={index}
                        className={`time-slot ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                        onClick={() => handleSlotClick(slot)}
                    >
                        {slot} {/* Display the time slot */}
                    </div>
                );
            })
        ) : (
            <p>No time slots available</p>
        )}
    </div>
</div>



                {/* Time Slot Selection */}
                

                <button className="reserve-button" onClick={handleReservation}>Reserve Now</button>
            </div>
        </div>
    );
};

export default ReservationPage;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ReservationPage.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Import all sport icons
import footballIcon from '../assets/icons/football.png';
import basketballIcon from '../assets/icons/basketball.png';
import tennisIcon from '../assets/icons/tennis.png';
import baseballIcon from '../assets/icons/baseball.png';
import badmintonIcon from '../assets/icons/badminton.png';
import soccerIcon from '../assets/icons/soccer.png';
import api from '../services/api';

// Create an object to map sport names to their respective icons
const sportIcons = {
    football: footballIcon,
    basketball: basketballIcon,
    tennis: tennisIcon,
    baseball: baseballIcon,
    badminton: badmintonIcon,
    soccer: soccerIcon
  };

const ReservationPage = () => {
    const { id } = useParams(); // Get the ground ID from the URL

    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [ground, setGround] = useState(null);
    const [courts, setCourts] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [courtNames, setCourtNames] = useState({});
    const navigate = useNavigate();

    // Function to fetch ground details and courts
    const fetchGroundAndCourts = useCallback(async () => {
        try {
            const [groundResponse, courtsResponse] = await Promise.all([
                api.get(`/grounds/${id}`),
                api.get(`/courts/by-ground/${id}`)
            ]);
            console.log('Fetched courts:', courtsResponse.data); 
            setGround(groundResponse.data);
            setCourts(courtsResponse.data);
        } catch (error) {
            console.error('Error fetching ground details and courts', error);
        }
    }, [id]);

    // Function to fetch court name by courtId
    const fetchCourtName = async (courtId) => {
        console.log('Fetching court name:', courtId); // Log to debug
        try {
            const response = await api.post('/courts/name', { courtId });
            return response.data.courtName;
        } catch (error) {
            console.error('Error fetching court name:', error);
            return `Court ${courtId}`; // Fallback if name fetch fails
        }
    };


    // Function to fetch available time slots
    const fetchAvailableTimeSlots = useCallback(async () => {
        if (!selectedDate || !selectedCourt) return;

        console.log("Fetching time slots for Court:", selectedCourt, "Date:", selectedDate); // Log to debug

        try {
            const response = await api.get(`/courts/${selectedCourt}/time-slots/${selectedDate}`);
            
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

        // Fetch court names when courts are loaded
        useEffect(() => {
            const loadCourtNames = async () => {
                const names = {};
                for (const court of courts) {
                    console.log('Court:', court); // Log court object
                    const name = await fetchCourtName(court);
                    console.log('Court Name:', name); // Log court name
                    names[court] = name;
                }
                setCourtNames(names);
            };
    
            if (courts.length > 0) {
                loadCourtNames();
            }
        }, [courts]);


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
    const handleSlotClick = (slotId) => {
        setSelectedSlots((prev) =>
            prev.includes(slotId)
                ? prev.filter(s => s !== slotId)
                : [...prev, slotId]
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
    const handleReservation = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); 
    
            if (!token) {
                alert('You must be logged in to make a reservation');
                navigate('/auth');
                return;
            }
            const decodedToken = jwtDecode(token);
            console.log('Token:', decodedToken); 
            const userId = decodedToken.userId;
            const userRole = decodedToken.role;
            console.log('Role:', userRole); // Log to debug
            
            if (userRole !== 'Reservee') {
                alert('Only users with the Reservee role can make a reservation.');
                return;
            }

            // Prepare selectedSlots with start and end times
        const selectedSlotDetails = selectedSlots.map(slotId => {
            const slot = timeSlots.find(ts => ts._id === slotId); // Match slot ID to fetch its details
            if (slot) {
                return {
                    start: slot.start,
                    end: slot.end,
                };
            }
            return null; // Skip invalid or unmatched slots
        }).filter(slot => slot !== null); // Remove null entries

        console.log('Selected Slot Details:', selectedSlotDetails);
    
            await api.post(
                '/reservations',
                {
                    groundId: id,
                    userId: userId,
                    date: selectedDate,
                    timeSlotIds: selectedSlots,
                    timeSlots: selectedSlotDetails,
                    courtId: selectedCourt,
                    courtName: courtNames[selectedCourt],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            alert('Reservation created successfully!');
            navigate('/map'); // Redirect to the map page after successful reservation
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
                    <label htmlFor="reservation-date">Select Date</label>
                    <input
                        type="date"
                        id="reservation-date"
                        value={selectedDate}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            setSelectedDate(newDate);
                            console.log("Selected Date:", newDate);
                        }}
                    />
                </div>

                <div className='court-label'>
                    <h3>Select Court</h3> 
                </div>

                {/* Court Selection Section */}
<div className="court-list"> 
    {courts.map((court, index) => {
        const courtName = courtNames[court];
        // Use ground.icon to get the correct sport icon, fallback to tennis if not found
        const sportIcon = sportIcons[ground.icon] || sportIcons.tennis;
        return (
            <div
                key={court} 
                className={`court ${selectedCourt === court ? 'selected' : ''}`} 
                onClick={() => handleCourtClick(court)} 
            >
                <img src={sportIcon} alt={`${ground.icon || 'Tennis'} Court Icon`} className="court-icon" />
                <div className="court-number">{courtName}</div> 
            </div>
        );
    })}
</div>

                <div className="time-slot-selection">
                    <h3>Select Time Slots</h3>
                    <div className="time-slots">
                        {timeSlots.length > 0 ? (
                            timeSlots.map((slot, index) => {
                                const slotClass = slot.available ? 'time-slot available' : 'time-slot unavailable'; // Determine class based on availability
                                const isSelected = selectedSlots.includes(slot._id); // Check if slot is selected
                                return (
                                    <div
                                        key={slot._id} // Use the slot ID as the key
                                        className={`${slotClass} ${isSelected ? 'selected' : ''}`} // Use slot ID for selected state
                                        onClick={() => {
                                            if (slot.available) { // Only allow click if available
                                                handleSlotClick(slot._id);
                                            }
                                        }}
                                    >
                                        {slot.start} - {slot.end} {/* Display the time slot */}
                                    </div>
                                );
                            })
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

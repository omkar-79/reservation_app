import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import '../css/RegisterGround.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


// Import the icons object
import icons from '../assets/icons';

const sportsIcons = ['football', 'basketball', 'tennis', 'baseball', 'badminton', 'soccer'];

const RegisterGround = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: 38.89511,  // Default latitude (Washington, DC)
    longitude: -77.03637, // Default longitude (Washington, DC)
    totalCourts: '',
    images: [],
    timings: {
      from: '08:00',
      to: '18:00',
    },
    icon: sportsIcons[0], // Default icon
    timeSlotDuration: 30
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTimeChange = (name, value) => {
    setFormData({
      ...formData,
      timings: {
        ...formData.timings,
        [name]: value
      }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagesArray = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: imagesArray
    });
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    return (
      <Marker position={[formData.latitude, formData.longitude]}></Marker>
    );
  };

  const SearchControl = () => {
    const map = useMap();

    React.useEffect(() => {
      const searchControl = new GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        style: 'bar',
        showMarker: true,
        retainZoomLevel: false,
        animateZoom: true,
        autoClose: true,
        searchLabel: 'Enter address',
      });

      map.addControl(searchControl);
      map.on('geosearch/showlocation', (result) => {
        setFormData({
          ...formData,
          latitude: result.location.y,
          longitude: result.location.x,
        });
      });

      return () => map.removeControl(searchControl);
    }, [map]);

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            
            if (userRole !== 'Facility Owner') {
                alert('Only users with the Reservee role can make a reservation.');
                return;
            }
    const { name, description, address, latitude, longitude, totalCourts, timings, icon, timeSlotDuration, images } = formData;

    try {
      // Register the ground
      const groundResponse = await axios.post('http://localhost:3000/api/grounds/create', {
        name,
        userId,
        description,
        address,
        latitude,
        longitude,
        totalCourts,
        timings,
        icon,
        timeSlotDuration,
        images
      });

      console.log('Ground registered:', groundResponse.data);
      alert('Ground registered successfully!');
      navigate('/map'); // Redirect to /map after successful registration
    } catch (error) {
      console.error('Error registering ground:', error);
      alert('Failed to register ground.');
    }
  };

  return (
    <div className="register-ground-container">
      <Header />
    
    <div className="register-ground">
      
      <h1>Register New Ground</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>Select the type of sport:</label>
        <div className="icon-selector">
          {sportsIcons.map((icon, index) => (
            <div key={index} className="icon-option">
              <input
                type="radio"
                name="icon"
                value={icon}
                checked={formData.icon === icon}
                onChange={handleChange}
              />
              <img src={icons[icon]} alt={icon} />
            </div>
          ))}
        </div>

        <label>
          {formData.icon === 'football' || formData.icon === 'soccer' || formData.icon === 'baseball'
            ? 'Total Grounds:'
            : 'Total Courts:'}
        </label>
        <input type="number" name="totalCourts" value={formData.totalCourts} onChange={handleChange} required />

        <label>Images:</label>
        <input type="file" multiple onChange={handleImageUpload} />

        <div className="preview-images">
          {formData.images.length > 0 && formData.images.map((image, index) => (
            <img key={index} src={image} alt={`Preview ${index}`} />
          ))}
        </div>

        <label>Timings From:</label>
        <input
          type="time"
          name="from"
          value={formData.timings.from}
          onChange={(e) => handleTimeChange('from', e.target.value)}
        />

        <label>Timings To:</label>
        <input
          type="time"
          name="to"
          value={formData.timings.to}
          onChange={(e) => handleTimeChange('to', e.target.value)}
        />

        <label>Time Slot Duration (minutes):</label>
        <input
          type="number"
          name="timeSlotDuration"
          value={formData.timeSlotDuration}
          onChange={handleChange}
        />

        <div className="map-container">
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl />
            <LocationPicker />
          </MapContainer>
        </div>

        <button type="submit">Register Ground</button>
      </form>
    </div>
    </div>
  );
};

export default RegisterGround;

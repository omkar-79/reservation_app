import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/RegisterGround.css';

const sportsIcons = ['football', 'basketball', 'tennis', 'volleyball'];

const RegisterGround = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, description, address, latitude, longitude, totalCourts, timings, icon, timeSlotDuration, images } = formData;
  
    try {
      // Register the ground
      const groundResponse = await axios.post('http://localhost:3000/api/grounds/create', {
        name,
        description,
        address,
        latitude,
        longitude,
        totalCourts,
        timings,
        icon,
        timeSlotDuration,
        images // Now this should be properly converted to URLs before sending
      });
  
      console.log('Ground registered:', groundResponse.data);
      alert('Ground registered successfully!');
    } catch (error) {
      console.error('Error registering ground:', error);
      alert('Failed to register ground.');
    }
  };
  
  return (
    <div className="register-ground">
      <h1>Register New Ground</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>Total Courts:</label>
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

        <label>Icon:</label>
        <select name="icon" value={formData.icon} onChange={handleChange}>
          {sportsIcons.map(icon => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>

        <label>Time Slot Duration (minutes):</label>
        <input
          type="number"
          name="timeSlotDuration"
          value={formData.timeSlotDuration}
          onChange={handleChange}
        />

        <div className="map-container">
          <MapContainer center={[formData.latitude, formData.longitude]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationPicker />
          </MapContainer>
        </div>

        <button type="submit">Register Ground</button>
      </form>
    </div>
  );
};

export default RegisterGround;

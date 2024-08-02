import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, FormControl } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/HomePage.css';
import icons from '../assets/icons'; // Import the icons

// Fix for default marker icon not showing in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom bouncing icon
const createIcon = (iconUrl) => L.divIcon({
  className: 'bouncing-icon',
  html: `<img src="${iconUrl}" class="custom-icon" />`,
  iconSize: [32, 32],
});

const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');

  const grounds = [
    { id: 1, name: 'Tennis Court 1', type: 'tennis', lat: 38.89511, lng: -77.03637, courtsAvailable: 2 },
    { id: 2, name: 'Basketball Court 1', type: 'basketball', lat: 38.88951, lng: -77.05012, courtsAvailable: 1 },
    // Add more grounds here...
  ];

  return (
    <div className="home-page">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/">ReserveIt</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
              <Nav.Link href="/map">Map</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Full-Screen Map */}
      <div className="map-container">
        <MapContainer center={[38.89511, -77.03637]} zoom={13} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          {grounds
            .filter((ground) => ground.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((ground) => (
              <Marker
                key={ground.id}
                position={[ground.lat, ground.lng]}
                icon={createIcon(icons[ground.type])} // Use the appropriate icon
              >
                <Popup>
                  <div>
                    <h4>{ground.name}</h4>
                    <p>Courts Available: {ground.courtsAvailable}</p>
                    <Button variant="primary">Reserve</Button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Search Bar */}
        <FormControl
          type="text"
          placeholder="Search"
          className="search-bar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <p>&copy; 2024 ReserveIt. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;

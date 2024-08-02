import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/HomePage.css';

// Fix for default marker icon not showing in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const HomePage = () => {
  const grounds = [
    { id: 1, name: 'Ground 1', lat: 38.89511, lng: -77.03637 },
    { id: 2, name: 'Ground 2', lat: 38.88951, lng: -77.05012 },
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
      <MapContainer center={[38.89511, -77.03637]} zoom={13} className="map" style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        {grounds.map((ground) => (
          <Marker key={ground.id} position={[ground.lat, ground.lng]}>
            <Popup>{ground.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

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

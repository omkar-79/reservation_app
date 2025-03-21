import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, FormControl, ListGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/HomePage.css';
import icons from '../assets/icons'; // Import the icons
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import Header from '../components/Header';
import api from '../services/api';


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
  iconAnchor: [16, 32], // Anchor the icon at the bottom center
});


const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredGrounds, setFilteredGrounds] = useState([]);
  const [grounds, setGrounds] = useState([]); // State for storing grounds data
  const [userLocation, setUserLocation] = useState(null);
  const [selectedGround, setSelectedGround] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    // Fetch grounds data from API
    const fetchGrounds = async () => {
      try {
        const response = await api.get('/grounds');
        setGrounds(response.data);
      } catch (error) {
        console.error('Error fetching grounds data:', error);
      }
    };

    fetchGrounds();

    
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
    // Check if the user is authenticated
    const checkAuth = async () => {
      try {
        const response = await api.get('/check-auth');
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const filtered = grounds.filter(ground =>
        ground.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGrounds(filtered);
    } else {
      setFilteredGrounds([]);
    }
  };

  const handleSearchResultClick = (ground) => {
    setSelectedGround(ground);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  const MapViewUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedGround) {
        map.setView([selectedGround.latitude, selectedGround.longitude], 15); // Zoom to the selected ground
      }
    }, [selectedGround, map]);

    return null;
  };

  const navigate = useNavigate();

  const handleReserveClick = (ground) => {
      navigate(`/reservation/${ground._id}`); // Use _id instead of id
    
    
  };


  return (
    <div className="home-page">
      {/* Header */}
      <Header />

      {/* Full-Screen Map */}
      <div className="map-container">
        <MapContainer center={[38.89511, -77.03637]} zoom={13} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          {grounds.map((ground) => (
            <Marker
              key={ground._id} // Use _id from MongoDB
              position={[ground.latitude, ground.longitude]}
              icon={createIcon(icons[ground.icon])}
            >
              <Popup>
                <div style={{ maxWidth: '200px', padding: '10px', textAlign: 'center' }}>
                  <h4>{ground.name}</h4>
                  <p>Courts Available: {ground.totalCourts}</p>
                  <button
                    onClick={() => handleReserveClick(ground)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '10px 20px',
                      width: '100%',
                      marginTop: '10px',
                      fontSize: '16px'
                    }}
                  >
                    Reserve
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          <MapViewUpdater />
        </MapContainer>

        {/* Search Bar */}
        <div className="search-bar">
          <FormControl
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearch}
          />
          {searchValue && filteredGrounds.length > 0 && (
            <ListGroup className="search-results">
              {filteredGrounds.map((ground) => (
                <ListGroup.Item key={ground._id}> {/* Use _id for unique key */}
                  {ground.name} - {userLocation && calculateDistance(userLocation.lat, userLocation.lon, ground.latitude, ground.longitude).toFixed(2)} miles
                  <Button
                    variant="link"
                    className="directions-button"
                    onClick={() => handleSearchResultClick(ground)}
                  >
                    View on Map
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </div>

      {/* Footer */}
     
    </div>
  );
};

export default HomePage;

import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useMap } from 'react-leaflet';

const Search = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const map = useMap();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      map.setView([lat, lng], 13); // Adjust zoom level as needed
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="search-bar">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search for a place"
        style={{
          width: '300px',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      />
      {status === 'OK' && (
        <ul className="search-results">
          {data.map(({ place_id, description }) => (
            <li key={place_id} onClick={() => handleSelect(description)} style={{ cursor: 'pointer' }}>
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;

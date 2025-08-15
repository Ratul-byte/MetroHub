import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Map = () => {
  const { user } = useAuth();
  const [mapSrc, setMapSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState('');
  const [source, setSource] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const metroStations = [
    { name: 'Uttara North Metro Station' },
    { name: 'Uttara Center Metro Station' },
    { name: 'Uttara South Metro Station' },
    { name: 'Pallabi Metro Station' },
    { name: 'Mirpur 11 Metro Station' },
    { name: 'Mirpur 10 Metro Station' },
    { name: 'Kazipara Metro Station' },
    { name: 'Shewrapara Metro Station' },
    { name: 'Agargaon Metro Station' },
    { name: 'Bijoy Sarani Metro Station' },
    { name: 'Farmgate Metro Station' },
    { name: 'Karwan Bazar Metro Station' },
    { name: 'Shahbag Metro Station' },
    { name: 'Dhaka University Metro Station' },
    { name: 'Bangladesh Secretariat Metro Station' },
    { name: 'Motijheel Metro Station' }
  ];

  useEffect(() => {
    setMapSrc(`https://maps.google.com/maps?q=23.8103,90.4125&t=&z=12&ie=UTF8&iwloc=&output=embed`);
    setLoading(false);
  }, []);

  const handleGetDirections = () => {
    if (source && destination) {
      setMapSrc(`https://maps.google.com/maps?saddr=${source}&daddr=${destination}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
      setError('');
    } else {
      setError('Please enter both a source and destination.');
    }
  };

  const handleSourceChange = (e) => {
    setSource(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (error) {
      setError('');
    }
    if (value) {
      const filteredSuggestions = metroStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setDestination(suggestion.name);
    setSuggestions([]);
  };

  return (
    <div className="relative h-full">
      {user && user.role !== 'admin' && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-100 p-4 rounded-md shadow-md flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter your location..."
            value={source}
            onChange={handleSourceChange}
            className="w-64 p-2 border border-gray-300 rounded-md"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Enter destination..."
              value={destination}
              onChange={handleDestinationChange}
              className="w-64 p-2 border border-gray-300 rounded-md"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
                {suggestions.map(suggestion => (
                  <li
                    key={suggestion.name}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleGetDirections}
            className="w-auto p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Get Directions
          </button>
        </div>
      )}
      {loading && <div className="flex items-center justify-center h-full">Loading Map...</div>}
      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-md shadow-md z-20">
          {error}
        </div>
      )}
      {!loading && (
        <div className="relative w-full h-full">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapSrc}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Map;

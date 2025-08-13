import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; // for Nominatim API

const Map = () => {
  const { user } = useAuth();
  const [mapSrc, setMapSrc] = useState('');
  const [hoverMapSrc, setHoverMapSrc] = useState(null); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState('');
  const [source, setSource] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSourceInput, setShowSourceInput] = useState(false);
  const [showNearbyStationsInput, setShowNearbyStationsInput] = useState(false);
  const [nearbyStations, setNearbyStations] = useState([]);

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

  const handleSearchLocation = () => {
    if (destination) {
                setMapSrc(`https://maps.google.com/maps?q=${destination}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
      setError('');
    } else {
      setError('Please enter a destination.');
    }
  };

  const handleGetDirections = (dest = destination) => { 
    console.log('handleGetDirections called. Source:', source, 'Destination:', dest); // Debug log
    if (source && dest) { // Use dest instead of destination
      setMapSrc(`https://maps.google.com/maps?saddr=${source}&daddr=${dest}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
      setError('');
    } else {
      setError('Please enter both a source and destination.');
    }
  };

  const handleFindNearbyStations = async () => { // Added async
    if (source) {
      try {
        // Make API call to backend
        const response = await axios.post('http://localhost:5001/api/stations/nearby', { location: source });
        setNearbyStations(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching nearby stations from backend:', err);
        setError(err.response?.data?.message || 'Failed to fetch nearby stations. Please try again.');
        setNearbyStations([]); // Clear previous results on error
      }
    } else {
      setError('Please enter a location to find nearby stations.');
    }
  };

  const handleCancelJourney = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    setSource('');
    setDestination('');
    setShowSourceInput(false);
    setError('');
    setNearbyStations([]);
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

  const handleStationHover = (stationName) => {
    if (source) { // Only show hover directions if source is available
      setHoverMapSrc(`https://maps.google.com/maps?saddr=${source}&daddr=${stationName}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
    }
  };

  const handleStationLeave = () => {
    setHoverMapSrc(null);
  };

  return (
    <div className="relative h-full">
      {user && user.role !== 'admin' && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-100 p-4 rounded-md shadow-md flex items-center space-x-2">
          {(showSourceInput || mapSrc.includes('saddr=')) && (
            <input
              type="text"
              placeholder="Enter your location..."
              value={source}
              onChange={handleSourceChange}
              className="w-64 p-2 border border-gray-300 rounded-md"
              readOnly={mapSrc.includes('saddr=')} // Added readOnly
            />
          )}
          {(!showNearbyStationsInput || mapSrc.includes('saddr=')) && (
            <div className="relative">
              <input
                type="text"
                placeholder="Enter destination..."
                value={destination}
                onChange={handleDestinationChange}
                className="w-64 p-2 border border-gray-300 rounded-md"
                readOnly={mapSrc.includes('saddr=')} // Added readOnly
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
          )}
          {mapSrc.includes('saddr=') ? ( 
            <button
              onClick={handleCancelJourney}
              className="w-auto p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Cancel Journey
            </button>
          ) : ( // Existing logic for other buttons
            <>
              {!showSourceInput && !showNearbyStationsInput ? (
                <>
                  <button
                    onClick={handleSearchLocation}
                    className="w-auto p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setShowSourceInput(true)}
                    className="w-auto p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Go to Station
                  </button>
                  <button
                    onClick={() => setShowNearbyStationsInput(true)}
                    className="w-auto p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Find Nearby Station
                  </button>
                </>
              ) : showSourceInput ? (
                <>
                  <button
                    onClick={() => handleGetDirections()} // Call without arguments
                    className="w-auto p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Get Directions
                  </button>
                  <button
                    onClick={handleGoBack}
                    className="w-auto p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Go Back
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter your location..."
                    value={source}
                    onChange={handleSourceChange}
                    className="w-64 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={handleFindNearbyStations}
                    className="w-auto p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                  >
                    Search Nearby
                  </button>
                  <button
                    onClick={() => {
                      setShowNearbyStationsInput(false);
                      setNearbyStations([]); // Clear nearby stations
                    }}
                    className="w-auto p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {loading && <div className="flex items-center justify-center h-full">Loading Map...</div>}
      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-md shadow-md z-20">
          {error}
        </div>
      )}
      {!loading && (
        <div className="relative w-full h-full flex">
          {(hoverMapSrc || mapSrc) && ( 
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={hoverMapSrc || mapSrc}
              allowFullScreen
            ></iframe>
          )}
          {showNearbyStationsInput && nearbyStations.length > 0 && (
            <div className="absolute right-4 top-20 w-64 bg-white p-4 rounded-md shadow-md z-10 overflow-y-auto max-h-[calc(100%-100px)]">
              <h3 className="text-lg font-semibold mb-2">Nearby Stations</h3>
              <ul>
                {nearbyStations.map(station => (
                  <li
                      key={station.name}
                      onClick={() => {
                        setDestination(station.name);
                        handleGetDirections(station.name); // Pass the station name directly
                        setShowNearbyStationsInput(false); // Hide the nearby stations input after selecting
                      }}
                      onMouseEnter={() => handleStationHover(station.name)} // Hover handler
                      onMouseLeave={handleStationLeave} // Leave handler
                      className="p-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    >
                      {station.name} (Distance: {station.distance} km)
                    </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Map;

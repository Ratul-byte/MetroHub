import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destination, setDestination] = useState('');
  const [source, setSource] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSourceInput, setShowSourceInput] = useState(false);
  const [showNearbyStationsInput, setShowNearbyStationsInput] = useState(false);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [metroStations, setMetroStations] = useState([]);
  const mapRef = useRef(null); // Ref for the map instance

  // Fetch metro stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/stations');
        setMetroStations(data);
        setLoading(false); // Set loading to false after stations are fetched
      } catch (error) {
        console.error('Failed to fetch stations', error);
        setError(t('failed_fetch_stations'));
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  // Initial map center (e.g., Dhaka coordinates)
  const initialCenter = [23.8103, 90.4125];

  const handleSearchLocation = () => {
    if (destination) {
      // Find the station by name
      const foundStation = metroStations.find(
        (station) => station.name.toLowerCase() === destination.toLowerCase()
      );

      if (foundStation && mapRef.current) {
        // Pan and zoom to the found station
        mapRef.current.setView([foundStation.latitude, foundStation.longitude], 15);
        setError('');
      } else {
        setError(t('station_not_found_on_map'));
      }
    } else {
      setError('Please enter a destination.');
    }
  };

  const handleGetDirections = () => {
    // Directions functionality removed from map display.
    // This would require integration with a routing service (e.g., OSRM, Mapbox Directions API).
    setError(t('directions_not_available_on_map'));
  };

  const handleFindNearbyStations = async () => {
    if (source) {
      try {
        const response = await axios.post('http://localhost:5001/api/stations/nearby', { location: source });
        setNearbyStations(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching nearby stations from backend:', err);
        setError(err.response?.data?.message || t('failed_fetch_nearby_stations'));
        setNearbyStations([]);
      }
    } else {
      setError('Please enter a location to find nearby stations.');
    }
  };

  const handleCancelJourney = () => {
    window.location.reload(); // Simple refresh to reset map state
  };

  const handleGoBack = () => {
    setSource('');
    setDestination('');
    setShowSourceInput(false);
    setError('');
    setNearbyStations([]);
    if (mapRef.current) {
      mapRef.current.setView(initialCenter, 12); // Reset map view
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
    if (mapRef.current) {
      mapRef.current.setView([suggestion.latitude, suggestion.longitude], 15);
    }
  };

  // Removed handleStationHover and handleStationLeave as they were tied to Google Maps iframe logic

  if (loading) {
    return <div className="flex items-center justify-center h-full">{t('loading_map')}</div>;
  }

  return (
    <div className="relative h-full">
      {user && user.role !== 'admin' && (
        <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-md shadow-md flex items-center space-x-2">
          {(showSourceInput) && (
            <input
              type="text"
              placeholder="Enter your location..."
              value={source}
              onChange={handleSourceChange}
              className="w-64 p-2 border border-gray-300 rounded-md"
            />
          )}
          {(!showNearbyStationsInput) && (
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
          )}
          {/* Buttons */}
          {!showSourceInput && !showNearbyStationsInput ? (
            <>
              <button
                onClick={handleSearchLocation}
                className="w-auto p-2 bg-transparent text-blue-500 rounded-md border-2 border-blue-500 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-blue-500 hover:text-white"
              >
                {t('search')}
              </button>
              <button
                onClick={() => setShowSourceInput(true)}
                className="w-auto p-2 bg-transparent text-green-700 rounded-md border-2 border-green-700 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-green-700 hover:text-white"
              >
                {t('go_to_location')}
              </button>
              <button
                onClick={() => setShowNearbyStationsInput(true)}
                className="w-auto p-2 bg-transparent text-purple-500 rounded-md border-2 border-purple-500 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-purple-500 hover:text-white"
              >
                {t('find_nearby_station')}
              </button>
            </>
          ) : showSourceInput ? (
            <>
              <button
                onClick={handleGetDirections}
                className="w-auto p-2 bg-transparent text-blue-500 rounded-md border-2 border-blue-500 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-blue-500 hover:text-white"
              >
                {t('get_directions')}
              </button>
              <button
                onClick={handleGoBack}
                className="w-auto p-2 bg-transparent text-gray-500 rounded-md border-2 border-gray-500 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-gray-500 hover:text-white"
              >
                {t('go_back')}
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={t('enter_your_location')}
                value={source}
                onChange={handleSourceChange}
                className="w-64 p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleFindNearbyStations}
                className="w-auto p-2 bg-transparent text-purple-500 rounded-md border-2 border-purple-500 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-purple-500 hover:text-white"
              >
                {t('search_nearby')}
              </button>
              <button
                onClick={() => {
                  setShowNearbyStationsInput(false);
                  setNearbyStations([]);
                }}
                className="w-auto p-2 bg-transparent text-gray-500 rounded-md border-2 border-gray-500 font-bold transition-all duration-300 ease-in-out px-4 py-2 hover:bg-gray-500 hover:text-white"
              >
                {t('cancel')}
              </button>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-md shadow-md z-20">
          {error}
        </div>
      )}
      <MapContainer
        center={initialCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {metroStations.map((station) => (
          <Marker key={station._id} position={[station.latitude, station.longitude]}>
            <Popup>{station.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {showNearbyStationsInput && nearbyStations.length > 0 && (
        <div className="absolute right-4 top-20 w-64 bg-white p-4 rounded-md shadow-md z-10 overflow-y-auto max-h-[calc(100%-100px)]">
          <h3 className="text-lg font-semibold mb-2">{t('nearby_stations')}</h3>
          <ul>
            {nearbyStations.map(station => (
              <li
                key={station.name}
                onClick={() => {
                  setDestination(station.name);
                  // Pan to the selected nearby station
                  if (mapRef.current) {
                    mapRef.current.setView([station.latitude, station.longitude], 15);
                  }
                  setShowNearbyStationsInput(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
              >
                {station.name} ({t('distance')}: {station.distance} km)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Map;

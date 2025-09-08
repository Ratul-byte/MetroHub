
import MetroStation from '../models/metroStationModel.js';
import axios from 'axios'; // Make sure to install axios: npm install axios

// Helper function to convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Haversine formula to calculate distance between two lat/lon points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Geocoding function using Nominatim (OpenStreetMap)
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'MetroHubApp/1.0 (your_email@example.com)' // Replace with your actual email
      }
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// @desc    Create a station
// @route   POST /api/stations
// @access  Private/Admin
const createStation = async (req, res) => {
  const { name, serial, latitude, longitude } = req.body;

  const station = new MetroStation({
    name,
    serial,
    latitude,
    longitude,
  });

  const createdStation = await station.save();
  res.status(201).json(createdStation);
};

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
const getStations = async (req, res) => {
  const stations = await MetroStation.find({});
  res.json(stations);
};

// @desc    Get station by ID
// @route   GET /api/stations/:id
// @access  Public
const getStationById = async (req, res) => {
  const station = await MetroStation.findById(req.params.id);

  if (station) {
    res.json(station);
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
};

// @desc    Update a station
// @route   PUT /api/stations/:id
// @access  Private/Admin
const updateStation = async (req, res) => {
  const { name, serial, latitude, longitude } = req.body;

  const station = await MetroStation.findById(req.params.id);

  if (station) {
    station.name = name;
    station.serial = serial;
    station.latitude = latitude;
    station.longitude = longitude;

    const updatedStation = await station.save();
    res.json(updatedStation);
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
};

// @desc    Delete a station
// @route   DELETE /api/stations/:id
// @access  Private/Admin
const deleteStation = async (req, res) => {
  const station = await MetroStation.findById(req.params.id);

  if (station) {
    await station.deleteOne(); // Updated from .remove() which is deprecated
    res.json({ message: 'Station removed' });
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
};

// @desc    Find nearby stations
// @route   POST /api/stations/nearby
// @access  Public
const findNearbyStations = async (req, res) => {
  const { location } = req.body; // This 'location' is expected to be a string address

  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    // Geocode the provided location string to get coordinates
    const userLocation = await geocodeAddress(location);

    if (!userLocation) {
      return res.status(400).json({ message: 'Could not geocode the provided location.' });
    }

    const { latitude: userLat, longitude: userLon } = userLocation;

    // Fetch all metro stations from the database
    const allStations = await MetroStation.find({});

    // Calculate distance to each station and filter nearby ones
    const nearbyStations = allStations
      .map((station) => {
        const distance = calculateDistance(
          userLat,
          userLon,
          station.latitude,
          station.longitude
        );
        return { ...station._doc, distance: parseFloat(distance.toFixed(2)) }; // Add distance and format
      })
      .filter((station) => station.distance <= 10) // Filter stations within 10 km radius
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    res.status(200).json(nearbyStations);
  } catch (error) {
    console.error('Error in findNearbyStations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
  findNearbyStations,
};

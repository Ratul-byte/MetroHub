import MetroStation from '../models/metroStationModel.js';
import axios from 'axios'; // for Nominatim API

// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export const getNearbyStations = async (req, res) => {
  try {
    const { location } = req.body;

    let userLat, userLon;

    // --- Nominatim Geocoding ---
    try {
      const nominatimResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=bd`, // Added countrycodes=bd
        {
          headers: {
            'User-Agent': 'MetroHubApp/1.0 (ratulmushfique33@gmail.com)' // Replace with a real email/app name
          }
        }
      );

      if (nominatimResponse.data && nominatimResponse.data.length > 0) {
        userLat = parseFloat(nominatimResponse.data[0].lat);
        userLon = parseFloat(nominatimResponse.data[0].lon);
        console.log(`Nominatim geocoded "${location}" to Lat: ${userLat}, Lon: ${userLon}`); // Debug log
      } else {
        return res.status(400).json({ message: 'Could not find coordinates for the provided location.' });
      }
    } catch (nominatimError) {
      console.error('Error geocoding with Nominatim:', nominatimError.message);
      return res.status(500).json({ message: 'Geocoding service error. Please try again later.' });
    }
    // --- END Nominatim Geocoding ---

    const allStations = await MetroStation.find({});

    const stationsWithDistance = allStations.map(station => {
      const distance = haversineDistance(userLat, userLon, station.latitude, station.longitude);
      return {
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
        distance: parseFloat(distance.toFixed(2)), // Rounded with 2 decimal places
      };
    });

    // Sorted by distance and get top 3
    const nearbyStations = stationsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    res.status(200).json(nearbyStations);

  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
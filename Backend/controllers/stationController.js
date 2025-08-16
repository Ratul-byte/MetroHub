
import MetroStation from '../models/metroStationModel.js';

// @desc    Create a station
// @route   POST /api/stations
// @access  Private/Admin
const createStation = async (req, res) => {
  const { name, latitude, longitude } = req.body;

  const station = new MetroStation({
    name,
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
  const { name, latitude, longitude } = req.body;

  const station = await MetroStation.findById(req.params.id);

  if (station) {
    station.name = name;
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
    await station.remove();
    res.json({ message: 'Station removed' });
  } else {
    res.status(404);
    throw new Error('Station not found');
  }
};

export {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
};

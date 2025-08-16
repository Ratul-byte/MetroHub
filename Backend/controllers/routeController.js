
import MetroRoute from '../models/metroRouteModel.js';

// @desc    Create a route
// @route   POST /api/routes
// @access  Private/Admin
const createRoute = async (req, res) => {
  const { name, stations } = req.body;

  const route = new MetroRoute({
    name,
    stations,
  });

  const createdRoute = await route.save();
  res.status(201).json(createdRoute);
};

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
const getRoutes = async (req, res) => {
  const routes = await MetroRoute.find({}).populate('stations');
  res.json(routes);
};

// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Public
const getRouteById = async (req, res) => {
  const route = await MetroRoute.findById(req.params.id).populate('stations');

  if (route) {
    res.json(route);
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
};

// @desc    Update a route
// @route   PUT /api/routes/:id
// @access  Private/Admin
const updateRoute = async (req, res) => {
  const { name, stations } = req.body;

  const route = await MetroRoute.findById(req.params.id);

  if (route) {
    route.name = name;
    route.stations = stations;

    const updatedRoute = await route.save();
    res.json(updatedRoute);
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
};

// @desc    Delete a route
// @route   DELETE /api/routes/:id
// @access  Private/Admin
const deleteRoute = async (req, res) => {
  const route = await MetroRoute.findById(req.params.id);

  if (route) {
    await route.remove();
    res.json({ message: 'Route removed' });
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
};

export {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};

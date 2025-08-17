import MetroSchedule from '../models/metroScheduleModel.js';

// @desc    Create a schedule
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = async (req, res) => {
  const { sourceStation, destinationStation, trainName, departureTime, arrivalTime, frequency } = req.body;

  const schedule = new MetroSchedule({
    sourceStation,
    destinationStation,
    trainName,
    departureTime,
    arrivalTime,
    frequency,
  });

  const createdSchedule = await schedule.save();
  res.status(201).json(createdSchedule);
};

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Public
const getSchedules = async (req, res) => {
  const { time, station } = req.query;
  let query = {};

  if (station) {
    query.$or = [{ sourceStation: station }, { destinationStation: station }];
  }

  let schedules = await MetroSchedule.find(query);

  if (time) {
    schedules = schedules.filter((schedule) => {
      const departureTime = new Date(`1970-01-01T${schedule.departureTime}`);
      const arrivalTime = new Date(`1970-01-01T${schedule.arrivalTime}`);
      const searchTime = new Date(`1970-01-01T${time}`);
      return searchTime >= departureTime && searchTime <= arrivalTime;
    });
  }

  res.json(schedules);
};

// @desc    Get schedule by ID
// @route   GET /api/schedules/:id
// @access  Public
const getScheduleById = async (req, res) => {
  const schedule = await MetroSchedule.findById(req.params.id);

  if (schedule) {
    res.json(schedule);
  } else {
    res.status(404);
    throw new Error('Schedule not found');
  }
};

// @desc    Update a schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
const updateSchedule = async (req, res) => {
  const { sourceStation, destinationStation, trainName, departureTime, arrivalTime, frequency } = req.body;

  const schedule = await MetroSchedule.findById(req.params.id);

  if (schedule) {
    schedule.sourceStation = sourceStation;
    schedule.destinationStation = destinationStation;
    schedule.trainName = trainName;
    schedule.departureTime = departureTime;
    schedule.arrivalTime = arrivalTime;
    schedule.frequency = frequency;

    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } else {
    res.status(404);
    throw new Error('Schedule not found');
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
const deleteSchedule = async (req, res) => {
  const schedule = await MetroSchedule.findById(req.params.id);

  if (schedule) {
    await schedule.remove();
    res.json({ message: 'Schedule removed' });
  } else {
    res.status(404);
    throw new Error('Schedule not found');
  }
};

export {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
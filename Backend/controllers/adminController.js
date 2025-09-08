import { User } from '../models/userModel.js';
import { RapidPass } from '../models/rapidPassModel.js';
import Ticket from '../models/ticketModel.js';
import MetroStation from '../models/metroStationModel.js';
import MetroSchedule from '../models/metroScheduleModel.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const normalUsersCount = await User.countDocuments({ role: 'normal' });
  const rapidPassUsersCount = await User.countDocuments({ role: 'rapidPassUser' });
  const users = await User.find({ email: { $ne: 'admin1@gmail.com' } }).select('-password -plainTextPassword'); // Exclude sensitive fields
  res.json({ users, normalUsersCount, rapidPassUsersCount });
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'rapidPassUser' && user.rapidPassId) {
      await RapidPass.findOneAndUpdate({ rapidPassId: user.rapidPassId }, { user: 'Not used in MetroHub' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const oldRole = user.role;
    user.role = req.body.role || user.role;

    if (oldRole === 'rapidPassUser' && user.role !== 'rapidPassUser' && user.rapidPassId) {
      await RapidPass.findOneAndUpdate({ rapidPassId: user.rapidPassId }, { user: 'Not used in MetroHub' });
      user.rapidPassId = null;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get recent users
// @route   GET /api/admin/recent-users
// @access  Private/Admin
const getRecentUsers = async (req, res) => {
  const users = await User.find({ email: { $ne: 'admin1@gmail.com' } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('-password -plainTextPassword'); // Exclude sensitive fields
  res.json(users);
};

// @desc    Get all tickets
// @route   GET /api/admin/tickets
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate('user', 'name email').populate('schedule');
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getUsers, deleteUser, updateUserRole, getRecentUsers, getAllTickets, getActiveTrainsCount, getMetroStationsCount, getActiveFinesCount, getTotalOutstandingFines, getFinesPaidThisMonthCount, getOverdueFinesCount, getRecentFines };


const getActiveTrainsCount = async (req, res) => {
  try {
    const distinctTrains = await MetroSchedule.distinct('trainName');
    res.json({ count: distinctTrains.length });
  } catch (error) {
    console.error('Error fetching active trains count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get metro stations count
// @route   GET /api/admin/statistics/metro-stations
// @access  Private/Admin
const getMetroStationsCount = async (req, res) => {
  try {
    const count = await MetroStation.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching metro stations count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get active fines count
// @route   GET /api/admin/statistics/active-fines
// @access  Private/Admin
const getActiveFinesCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ fine: { $gt: 0 } });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching active fines count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get total outstanding fines
// @route   GET /api/admin/statistics/total-outstanding-fines
// @access  Private/Admin
const getTotalOutstandingFines = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: null,
          totalFines: { $sum: '$fine' },
        },
      },
    ]);
    res.json({ total: result[0]?.totalFines || 0 });
  } catch (error) {
    console.error('Error fetching total outstanding fines:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get fines paid this month count
// @route   GET /api/admin/statistics/fines-paid-this-month
// @access  Private/Admin
const getFinesPaidThisMonthCount = async (req, res) => {
  try {
    // This is a placeholder. You need a way to track when fines are paid.
    // This assumes you have a `fineLastPaidAt` field in your User model.
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await User.countDocuments({
      fineLastPaidAt: { $gte: startOfMonth },
    });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching fines paid this month count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get overdue fines count
// @route   GET /api/admin/statistics/overdue-fines
// @access  Private/Admin
const getOverdueFinesCount = async (req, res) => {
  try {
    // This is a placeholder. You need to define what an "overdue" fine is.
    // This assumes you have a `fineCreatedAt` field in your User model.
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const count = await User.countDocuments({
      fine: { $gt: 0 },
      fineCreatedAt: { $lte: thirtyDaysAgo },
    });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching overdue fines count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get recent fines
// @route   GET /api/admin/recent-fines
// @access  Private/Admin
const getRecentFines = async (req, res) => {
  try {
    const finedUsers = await User.find({ fine: { $gt: 0 } })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('name email fine updatedAt'); // Select relevant fields including updatedAt
    res.json(finedUsers);
  } catch (error) {
    console.error('Error fetching recent fines:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
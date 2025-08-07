
import { User } from '../models/userModel.js';

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
    await user.remove();
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
    user.role = req.body.role || user.role;
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

export { getUsers, deleteUser, updateUserRole };

import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { RapidPass } from '../models/rapidPassModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Update user profile
router.put('/profile', protect, async (request, response) => {
  try {
    const userId = request.user._id;
    const { name, email, phoneNumber, password, role, passBalance, rapidPassId } = request.body;

    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (role && role !== user.role) {
      if (role === 'rapidPassUser') {
        if (!rapidPassId) {
          return response.status(400).send({ message: 'Rapid Pass ID is required for rapid pass users.' });
        }

        const rapidPassIdAsNumber = parseInt(rapidPassId, 10);
        if (isNaN(rapidPassIdAsNumber)) {
          return response.status(400).send({ message: 'Invalid Rapid Pass ID format.' });
        }

        const rapidPass = await RapidPass.findOne({ rapidPassId: rapidPassIdAsNumber });

        if (!rapidPass) {
          return response.status(400).send({ message: 'Invalid Rapid Pass ID.' });
        }

        if (rapidPass.user !== 'Not used in MetroHub') {
          return response.status(400).send({ message: 'This Rapid Pass ID is already in use.' });
        }

        user.rapidPassId = rapidPassIdAsNumber;
        await RapidPass.findOneAndUpdate({ rapidPassId: rapidPassIdAsNumber }, { user: user.name });
      } else if (user.role === 'rapidPassUser' && role !== 'rapidPassUser') {
        await RapidPass.findOneAndUpdate({ rapidPassId: user.rapidPassId }, { user: 'Not used in MetroHub' });
        user.rapidPassId = null;
      }
      user.role = role;
    }

    if (passBalance) {
        user.passBalance = user.passBalance + passBalance;
    }

    const updatedUser = await user.save();

    response.status(200).send(updatedUser);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;

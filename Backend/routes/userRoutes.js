import express from 'express';
import { User } from '../models/userModel.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Update user profile
router.put('/profile', auth, async (request, response) => {
  try {
    const { userId } = request.user;
    const { name, email, phoneNumber, password, role, passBalance } = request.body;

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
    if (role) user.role = role;
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

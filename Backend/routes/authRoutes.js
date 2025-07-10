import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { JWT_SECRET } from '../config.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration Route
router.post('/register', async (request, response) => {
  console.log('Request Body:', request.body);
  try {
    const { name, email, phoneNumber, password, role, rapidPassId } = request.body;

    // 1. Validation: Check for required fields
    if (!name || !password || (!email && !phoneNumber)) {
      return response.status(400).send({
        message: 'Send all required fields: name, password, and email or phoneNumber.',
      });
    }
    
    // Additional validation for rapidPassUser
    if (role === 'rapidPassUser' && !rapidPassId) {
        return response.status(400).send({
            message: 'Rapid Pass ID is required for rapid pass users.',
        });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return response.status(400).send({ message: 'User with this email or phone number already exists.' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user object
    const newUserObject = {
      name,
      password: hashedPassword,
      role,
    };
    if (email) newUserObject.email = email;
    if (phoneNumber) newUserObject.phoneNumber = phoneNumber;
    if (role === 'rapidPassUser') newUserObject.rapidPassId = rapidPassId;


    // 5. Save the user to the database
    console.log('New User Object:', newUserObject);
    const user = await User.create(newUserObject);

    // 6. Generate JWT Token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // 7. Send success response
    return response.status(201).send({ 
        message: 'User registered successfully',
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
     });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// User Login Route
router.post('/login', async (request, response) => {
    try {
        const { credential, password } = request.body; // credential can be email or phoneNumber

        // 1. Validation
        if (!credential || !password) {
            return response.status(400).send({ message: 'Please provide credentials and password.' });
        }

        // 2. Find user by email or phone number
        const user = await User.findOne({
            $or: [{ email: credential }, { phoneNumber: credential }],
        });

        if (!user) {
            return response.status(404).send({ message: 'User not found.' });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(400).send({ message: 'Invalid credentials.' });
        }

        // 4. Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d',
        });

        // 5. Send success response
        return response.status(200).send({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



// Get User Profile
router.get('/profile', auth, async (request, response) => {
  try {
    const user = await User.findById(request.user).select('-password');
    if (!user) {
      return response.status(404).json({ message: 'User not found.' });
    }
    response.json(user);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: 'Server Error' });
  }
});

// Update User Profile
router.put('/profile', auth, async (request, response) => {
  try {
    const { name, email, phoneNumber, password, preferredRoutes } = request.body;

    const user = await User.findById(request.user);
    if (!user) {
      return response.status(404).json({ message: 'User not found.' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (preferredRoutes) user.preferredRoutes = preferredRoutes;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    response.json({ message: 'Profile updated successfully', user: user.toObject({ getters: true, virtuals: false }) });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: 'Server Error' });
  }
});

export default router;
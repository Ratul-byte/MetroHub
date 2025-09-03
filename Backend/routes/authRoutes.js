import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { RapidPass } from '../models/rapidPassModel.js';
import { JWT_SECRET } from '../config.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration Route
router.post('/register', async (request, response) => {
  console.log('Request Body:', request.body);
  try {
    const { name, email, phoneNumber, password, role, rapidPassId, securityAnswer } = request.body;

    // 1. Validation: Check for required fields
    if (!name || !password || !securityAnswer || (!email && !phoneNumber)) {
      return response.status(400).send({
        message: 'Send all required fields: name, password, securityAnswer, and email or phoneNumber.',
      });
    }

    // Email validation
    if (email && !/^[^S@]+@(?:gmail\.com|yahoo\.com)$/.test(email)) {
      return response.status(400).send({ message: 'Invalid email format.' });
    }

    // Phone number validation
    if (phoneNumber && !/^01\d{9}$/.test(phoneNumber)) {
      return response.status(400).send({ message: 'Invalid phone number format. Must contain 11 digits, starting with 01.' });
    }

    // Password validation
    if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/g.test(password) || !/\d/g.test(password)) {
      return response.status(400).send({ message: 'Invalid Password Format. Must be at least 8 characters long, Contain at least one special character and one number.' });
    }
    
    if (role === 'rapidPassUser') {
      if (!rapidPassId) {
        return response.status(400).send({
            message: 'Rapid Pass ID is required for rapid pass users.',
        });
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
    }

    // 2. Check if user already exists
    const queryConditions = [];
    if (email) {
        queryConditions.push({ email: email });
    }
    if (phoneNumber) {
        queryConditions.push({ phoneNumber: phoneNumber });
    }

    if (queryConditions.length > 0) {
        const existingUser = await User.findOne({ $or: queryConditions });
        if (existingUser) {
            return response.status(400).send({ message: 'User with this email or phone number already exists.' });
        }
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the new user object
    const newUserObject = {
      name,
      password: hashedPassword,
      plainTextPassword: password,
      role,
      securityAnswer,
    };
    if (email) newUserObject.email = email;
    if (phoneNumber) newUserObject.phoneNumber = phoneNumber;
    if (role === 'rapidPassUser') newUserObject.rapidPassId = rapidPassId;


    // 5. Save the user to the database
    console.log('New User Object:', newUserObject);
    const user = await User.create(newUserObject);

    // 6. Update RapidPass document
    if (role === 'rapidPassUser') {
      await RapidPass.findOneAndUpdate({ rapidPassId: parseInt(rapidPassId, 10) }, { user: user.name });
    }

    // 7. Generate JWT Token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // 8. Send success response
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
    const { credential, password } = request.body;

    // Admin Part
    if (credential === 'admin1@gmail.com' && password === 'admin') {
        const adminUser = {
            _id: 'hardcoded_admin_user_id', 
            name: 'Admin User',
            email: 'admin1@gmail.com',
            role: 'admin',
        };
        const token = jwt.sign({ userId: adminUser._id, role: adminUser.role }, JWT_SECRET, {
            expiresIn: '1d',
        });
        return response.status(200).send({
            message: 'Admin login successful',
            token,
            user: {
                id: adminUser._id,
                name: adminUser.name,
                role: adminUser.role
            }
        });
    }

    try {
        const { credential, password } = request.body; 

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
                role: user.role,
                rapidPassId: user.rapidPassId,
                passBalance: user.passBalance
            }
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



// Get User Profile
router.get('/profile', protect, async (request, response) => {
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
router.put('/profile', protect, async (request, response) => {
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

router.post('/forgot-password', async (request, response) => {
  try {
    const { credential, securityAnswer } = request.body;

    if (!credential || !securityAnswer) {
      return response.status(400).send({ message: 'Please provide credential and security answer.' });
    }

    const user = await User.findOne({
      $or: [{ email: credential }, { phoneNumber: credential }],
    });

    if (!user) {
      return response.status(404).send({ message: 'User not found.' });
    }

    if (user.securityAnswer !== securityAnswer) {
      return response.status(400).send({ message: 'Incorrect security answer.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '10m', // Token expires in 10 minutes
    });

    response.status(200).send({ message: 'Security answer is correct. Please reset your password.', token });

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.put('/reset-password', protect, async (request, response) => {
  try {
    const { newPassword } = request.body;
    const userId = request.user._id;

    if (!newPassword) {
      return response.status(400).send({ message: 'Please provide a new password.' });
    }

    if (newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/g.test(newPassword) || !/\d/g.test(newPassword)) {
      return response.status(400).send({ message: 'Invalid Password Format. Must be at least 8 characters long, Contain at least one special character and one number.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hashedPassword, plainTextPassword: newPassword });

    response.status(200).send({ message: 'Password reset successfully.' });

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
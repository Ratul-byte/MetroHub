
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.argv[2], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin1@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);

      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();

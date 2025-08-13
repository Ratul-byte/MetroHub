import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/userModel.js';
import MetroStation from './models/metroStationModel.js'; // New import
import dotenv from 'dotenv';

dotenv.config();

const metroStationsData = [
  { name: 'Uttara North Metro Station', latitude: 23.8759, longitude: 90.3977 },
  { name: 'Mirpur 10 Metro Station', latitude: 23.8077, longitude: 90.3689 },
  { name: 'Farmgate Metro Station', latitude: 23.7588, longitude: 90.3900 },
  { name: 'Motijheel Metro Station', latitude: 23.7266, longitude: 90.4190 },
  { name: 'Agargaon Metro Station', latitude: 23.7890, longitude: 90.3780 },
  { name: 'Uttara Center Metro Station', latitude: 23.8667, longitude: 90.3933 },
  { name: 'Uttara South Metro Station', latitude: 23.8575, longitude: 90.3892 },
  { name: 'Pallabi Metro Station', latitude: 23.8400, longitude: 90.3800 },
  { name: 'Mirpur 11 Metro Station', latitude: 23.8180, longitude: 90.3730 },
  { name: 'Kazipara Metro Station', latitude: 23.79805, longitude: 90.36505 }, // Updated
  { name: 'Shewrapara Metro Station', latitude: 23.79300, longitude: 90.36900 }, // Updated (confirmed)
  { name: 'Bijoy Sarani Metro Station', latitude: 23.7680, longitude: 90.3920 },
  { name: 'Karwan Bazar Metro Station', latitude: 23.7500, longitude: 90.3950 },
  { name: 'Shahbag Metro Station', latitude: 23.7380, longitude: 90.3980 },
  { name: 'Dhaka University Metro Station', latitude: 23.7300, longitude: 90.4050 },
  { name: 'Bangladesh Secretariat Metro Station', latitude: 23.7200, longitude: 90.4120 }
];

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
    // mongoose.disconnect(); // Disconnect will be handled by the last seeding function
  }
};

const seedMetroStations = async () => {
  try {
    // Ensure connection is open if seedAdmin didn't run or disconnected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.argv[2], {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    for (const stationData of metroStationsData) {
      const stationExists = await MetroStation.findOne({ name: stationData.name });
      if (!stationExists) {
        await MetroStation.create(stationData);
        console.log(`Metro station "${stationData.name}" created successfully`);
      } else {
        console.log(`Metro station "${stationData.name}" already exists`);
      }
    }
  } catch (error) {
    console.error('Error seeding metro stations:', error);
  } finally {
    mongoose.disconnect(); // Disconnect after all seeding is done
  }
};

// Execute seeding functions
seedAdmin().then(() => seedMetroStations());
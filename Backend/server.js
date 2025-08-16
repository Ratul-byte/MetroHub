import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stationRoutes from './routes/stationRoutes.js'; // New import

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Temporarily allow all origins for testing
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stations', stationRoutes); // New route

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('App connected to database');
    app.listen(process.env.PORT || 5001, () => {
      console.log(`App is listening to port: ${process.env.PORT || 5001}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
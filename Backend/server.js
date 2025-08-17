import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stationRoutes from './routes/stationRoutes.js'; // New import
import scheduleRoutes from './routes/scheduleRoutes.js'; // New import

dotenv.config();


const app = express();

// Middleware
app.use(cors());
///app.use(cors({
///    origin: 'http://localhost:5173',
///    credentials: true
///}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stations', stationRoutes); // New route
app.use('/api/schedules', scheduleRoutes); // New route

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('App connected to database');
    console.log(`DEBUG: process.env.PORT is: ${process.env.PORT}`);
    // app.listen(5001, () => {
    //   console.log(`App is listening to port: 5001`);
    // });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening to port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
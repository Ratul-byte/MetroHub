import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';

dotenv.config();

const app = express();

// controlled CORS and PORT fallback
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://metro-hub.vercel.app,https://metrohub-v5sa.onrender.com')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/schedules', scheduleRoutes);

// numeric PORT and startup logging
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error('FATAL: MONGODB_URL is not set');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('DB connection error:', error);
    process.exit(1);
  });
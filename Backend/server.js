import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

// quick debug (boolean only)
console.log('SSL_STORE_ID set?', !!process.env.SSL_STORE_ID);
console.log('SSL_STORE_PASSWORD set?', !!process.env.SSL_STORE_PASSWORD);
console.log('SSL_MODE:', process.env.SSL_MODE);

const app = express();

// controlled CORS and PORT fallback
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://metro-hub.vercel.app,https://metrohub-fivz.onrender.com')
  .split(',')
  .map(s => s.trim().replace(/\/$/, ''));

const vercelPreviewRegex = /https:\/\/.*-ratul-mushfiques-projects\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'null') {
      return callback(null, true);
    }
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin) || vercelPreviewRegex.test(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed'));
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/payment', paymentRoutes);

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
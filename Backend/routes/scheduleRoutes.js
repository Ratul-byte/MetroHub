import express from 'express';
import { getSchedules } from '../controllers/scheduleController.js';

const router = express.Router();

// GET /api/schedules?sourceStation=...&destinationStation=...
router.get('/', getSchedules);

export default router;

import express from 'express';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/schedules?sourceStation=...&destinationStation=...
router.get('/', getSchedules);
router.post('/', protect, admin, createSchedule);
router.put('/:id', protect, admin, updateSchedule);
router.delete('/:id', protect, admin, deleteSchedule);

export default router;

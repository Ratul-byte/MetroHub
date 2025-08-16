
import express from 'express';
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSchedules).post(protect, admin, createSchedule);
router
  .route('/:id')
  .get(getScheduleById)
  .put(protect, admin, updateSchedule)
  .delete(protect, admin, deleteSchedule);

export default router;

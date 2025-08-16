
import express from 'express';
import {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
} from '../controllers/stationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getStations).post(protect, admin, createStation);
router
  .route('/:id')
  .get(getStationById)
  .put(protect, admin, updateStation)
  .delete(protect, admin, deleteStation);

export default router;

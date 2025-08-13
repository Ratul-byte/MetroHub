import express from 'express';
import { getNearbyStations } from '../controllers/stationController.js';

const router = express.Router();

router.post('/nearby', getNearbyStations);

export default router;
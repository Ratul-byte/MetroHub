
import express from 'express';
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from '../controllers/routeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRoutes).post(protect, admin, createRoute);
router
  .route('/:id')
  .get(getRouteById)
  .put(protect, admin, updateRoute)
  .delete(protect, admin, deleteRoute);

export default router;

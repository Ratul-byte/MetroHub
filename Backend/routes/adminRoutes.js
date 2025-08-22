import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUsers, deleteUser, updateUserRole, getRecentUsers, getAllTickets } from '../controllers/adminController.js';

const router = express.Router();

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/users/:id/role').put(protect, admin, updateUserRole);
router.route('/recent-users').get(protect, admin, getRecentUsers);
router.route('/tickets').get(protect, admin, getAllTickets);

export default router;
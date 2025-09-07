import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUsers, deleteUser, updateUserRole, getRecentUsers, getAllTickets, getActiveTrainsCount, getMetroStationsCount, getActiveFinesCount, getTotalOutstandingFines, getFinesPaidThisMonthCount, getOverdueFinesCount, getRecentFines } from '../controllers/adminController.js';

const router = express.Router();

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/users/:id/role').put(protect, admin, updateUserRole);
router.route('/recent-users').get(protect, admin, getRecentUsers);
router.route('/tickets').get(protect, admin, getAllTickets);

router.route('/statistics/active-trains').get(protect, admin, getActiveTrainsCount);
router.route('/statistics/metro-stations').get(protect, admin, getMetroStationsCount);
router.route('/statistics/active-fines').get(protect, admin, getActiveFinesCount);
router.route('/statistics/total-outstanding-fines').get(protect, admin, getTotalOutstandingFines);
router.route('/statistics/fines-paid-this-month').get(protect, admin, getFinesPaidThisMonthCount);
router.route('/statistics/overdue-fines').get(protect, admin, getOverdueFinesCount);
router.route('/recent-fines').get(protect, admin, getRecentFines);
export default router;
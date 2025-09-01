import express from 'express';
import { initiatePayment, sslcommerzSuccess, sslcommerzFail, sslcommerzCancel, sslcommerzIPN, payFromBalance } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/init', protect, initiatePayment);
router.all('/success', sslcommerzSuccess);
router.all('/fail', sslcommerzFail);
router.all('/cancel', sslcommerzCancel);
router.post('/ipn', sslcommerzIPN); // For IPN (Instant Payment Notification)
router.post('/pay-from-balance', protect, payFromBalance);

export default router;

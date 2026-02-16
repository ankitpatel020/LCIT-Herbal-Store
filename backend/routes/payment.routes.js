import express from 'express';
import { checkout, paymentVerification, getRazorpayKey } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/getkey', protect, getRazorpayKey);
router.post('/checkout', protect, checkout);
router.post('/verification', protect, paymentVerification);

export default router;

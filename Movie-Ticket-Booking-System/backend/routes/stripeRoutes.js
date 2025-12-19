// routes/stripeRoutes.js
import express from 'express';
import {
    createStripeCheckoutSession,
  confirmStripePayment,
  confirmStripeCheckout
} from '../controllers/stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createStripeCheckoutSession);

// Confirm after return from Stripe (no webhook)
router.post('/confirm', protect, confirmStripePayment);

router.post('/confirm-checkout', confirmStripeCheckout);

export default router;
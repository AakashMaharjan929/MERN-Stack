// routes/esewaRoutes.js
import express from 'express';
import { initializeEsewaPayment, verifyEsewaPayment } from '../controllers/esewaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Initialize payment (create pending record)
router.post('/initialize', protect, initializeEsewaPayment);

// Verify payment after eSewa redirect
router.get('/verify', verifyEsewaPayment);

export default router;
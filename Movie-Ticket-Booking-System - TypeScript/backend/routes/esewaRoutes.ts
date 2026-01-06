import express from 'express';
import { initializeEsewaPayment, verifyEsewaPayment } from '../controllers/esewaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initialize', protect, initializeEsewaPayment);
router.get('/verify', verifyEsewaPayment);

export default router;

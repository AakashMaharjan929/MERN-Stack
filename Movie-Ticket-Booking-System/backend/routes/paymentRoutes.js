// routes/paymentRoutes.js
import express from "express";
import {
  createPayment,
  paymentSuccess,
  paymentFailed,
  getMyTickets,
  cancelTicket,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, createPayment);                    // Create payment
router.get("/my", protect, getMyTickets);                    // Get my tickets
router.post("/:id/cancel", protect, cancelTicket);           // Cancel ticket (refund)

// Gateway callbacks (public)
router.post("/success", paymentSuccess);
router.post("/failed", paymentFailed);

// Admin
router.get("/", protect, admin, getAllPayments);

export default router;
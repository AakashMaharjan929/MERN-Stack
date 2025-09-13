import express from "express";
import {
  createPayment,
  processPayment,
  refundPayment,
  retryPayment,
  getPaymentStatus,
  getAllPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create a new payment
router.post("/", createPayment);

// Process payment
router.post("/:id/process", processPayment);

// Refund payment
router.post("/:id/refund", refundPayment);

// Retry failed payment
router.post("/:id/retry", retryPayment);

// Get payment status
router.get("/:id/status", getPaymentStatus);

// Get all payments (admin use)
router.get("/", getAllPayments);

export default router;

// routes/bookingRoutes.js - Reordered routes to put specific paths before dynamic /:id
import express from "express";
import {
  createBooking,
  confirmBooking,
  cancelBooking,
  updateSeats,
  applyDiscount,
  getBookingById,
  getAllBookings,
  getCancellations,
  getTicketHistory,
  getRevenueBreakdown,
} from "../controllers/bookingController.js";

const router = express.Router();

// Specific GET routes first (before /:id to avoid capturing them as id)

// Get all bookings (admin / user history)
router.get("/", getAllBookings);

// Get cancellations/refunds (for View Cancellations/Refunds)
router.get("/cancellations", getCancellations);

// Get ticket history (for Ticket History)
router.get("/history", getTicketHistory);

// Get revenue breakdown (for Revenue Breakdown)
router.get("/revenue", getRevenueBreakdown);

// Dynamic GET for single booking (after specifics)
router.get("/:id", getBookingById);

// POST routes
router.post("/", createBooking);

// Confirm a booking
router.post("/:id/confirm", confirmBooking);

// Cancel a booking
router.post("/:id/cancel", cancelBooking);

// Update seats in a booking
router.put("/:id/seats", updateSeats);

// Apply discount code
router.post("/:id/discount", applyDiscount);

export default router;
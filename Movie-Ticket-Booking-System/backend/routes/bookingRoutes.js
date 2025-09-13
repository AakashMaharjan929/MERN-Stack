// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  confirmBooking,
  cancelBooking,
  updateSeats,
  applyDiscount,
  getBookingById,
  getAllBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create a booking (Pending)
router.post("/", createBooking);

// Confirm a booking
router.post("/:id/confirm", confirmBooking);

// Cancel a booking
router.post("/:id/cancel", cancelBooking);

// Update seats in a booking
router.put("/:id/seats", updateSeats);

// Apply discount code
router.post("/:id/discount", applyDiscount);

// Get single booking
router.get("/:id", getBookingById);

// Get all bookings (admin / user history)
router.get("/", getAllBookings);

export default router;

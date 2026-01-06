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

router.get("/", getAllBookings);
router.get("/cancellations", getCancellations);
router.get("/history", getTicketHistory);
router.get("/revenue", getRevenueBreakdown);
router.get("/:id", getBookingById);

router.post("/", createBooking);
router.post("/:id/confirm", confirmBooking);
router.post("/:id/cancel", cancelBooking);
router.put("/:id/seats", updateSeats);
router.post("/:id/discount", applyDiscount);

export default router;

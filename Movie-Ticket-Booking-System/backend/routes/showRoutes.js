import express from "express";
import {
  addShow,
  updateShow,
  deleteShow,
  getAllShows,
  getShowById,
  getCurrentPrice,
  bookSeats,
  cancelSeats,
  getAvailableSeats,   // 🔑 add this
} from "../controllers/showController.js";

const router = express.Router();

// ---------------------------
// Show Routes
// ---------------------------

// Add a new show
router.post("/", addShow);

// Update a show
router.put("/:id", updateShow);

// Delete a show
router.delete("/:id", deleteShow);

// Get all shows
router.get("/", getAllShows);

// Get single show by ID
router.get("/:id", getShowById);

// Get calculated price for a show (requires ?seatType=Premium or Standard)
router.get("/:id/price", getCurrentPrice);

// Get available seats for a show
router.get("/:id/seats", getAvailableSeats);   // 🔑 NEW

// Book seats
router.post("/:id/book", bookSeats);

// Cancel booked seats
router.post("/:id/cancel", cancelSeats);

export default router;

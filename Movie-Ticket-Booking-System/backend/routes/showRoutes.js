// Updated showRoutes.js - Reordered routes to put specific ones before catch-all /:id
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
  getAvailableSeats,
  bulkCreateShows,
  checkConflicts,
  suggestFactors, // New import
  optimizeShow, // NEW: Import for manual optimization
  refreshShowStatuses, // New import
} from "../controllers/showController.js";

const router = express.Router();

// ---------------------------
// Show Routes
// ---------------------------


// routes/show.js
router.get('/refresh-statuses', refreshShowStatuses);

// Add a new show
router.post("/", addShow);

// Bulk create shows (for Bulk Scheduling)
router.post("/bulk", bulkCreateShows);

// Update a show
router.put("/:id", updateShow);

// Delete a show
router.delete("/:id", deleteShow);

// Get all shows
router.get("/", getAllShows);

// Specific utility routes (MUST come before /:id catch-all)
router.get("/suggest-factors", suggestFactors);
router.get("/conflicts", checkConflicts);

// NEW: Manual post-show optimization
router.post("/:id/optimize", optimizeShow);

// Get single show by ID (catch-all for /:id)
router.get("/:id", getShowById);

// Get calculated price for a show (requires ?seatType=Premium or Standard)
router.get("/:id/price", getCurrentPrice);

// Get available seats for a show
router.get("/:id/seats", getAvailableSeats);

// Book seats
router.post("/:id/book", bookSeats);

// Cancel booked seats
router.post("/:id/cancel", cancelSeats);



export default router;
import express from "express";
import {
  addScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
  getSeatLayout,
  getSeatsByType, 
  getCapacityBreakdown
} from "../controllers/screenController.js";

const router = express.Router();

// ---------------------------
// Screen Routes
// ---------------------------

// Add a new screen
router.post("/", addScreen);

// Get all screens
router.get("/", getAllScreens);

// Get a single screen by ID
router.get("/:id", getScreenById);

// Update a screen
router.put("/:id", updateScreen);

// Delete a screen
router.delete("/:id", deleteScreen);

// Get full seat layout for a screen
router.get("/:id/seat-layout", getSeatLayout);

// Get seats by type (Standard or Premium)
router.get("/:id/seats/:type", getSeatsByType);

// ... existing routes
router.get("/:id/capacity", getCapacityBreakdown);

export default router;

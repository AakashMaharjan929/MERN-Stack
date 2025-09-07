import express from "express";
import {
  addTheater,
  updateTheater,
  deleteTheater,
  getAllTheaters,
  getTheaterById,
  addScreenToTheater,
  removeScreenFromTheater
} from "../controllers/theaterController.js";

const router = express.Router();

// ---------------------------
// Theater Routes
// ---------------------------

// Add a new theater
router.post("/", addTheater);

// Update a theater
router.put("/:id", updateTheater);

// Delete a theater
router.delete("/:id", deleteTheater);

// Get all theaters
router.get("/", getAllTheaters);

// Get single theater by ID
router.get("/:id", getTheaterById);

// Add a screen to theater
router.post("/add-screen", addScreenToTheater);

// Remove a screen from theater
router.post("/remove-screen", removeScreenFromTheater);

export default router;

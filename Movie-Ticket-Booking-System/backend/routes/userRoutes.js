import express from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getUserBookings,
  cancelUserBooking
} from "../controllers/userController.js";

const router = express.Router();

// -------------------------
// User Routes
// -------------------------

// Register a new user
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Update profile
router.put("/update/:id", updateUserProfile);

// Change password
router.put("/update/:id/password", changeUserPassword);

// Delete user
router.delete("/delete/:id", deleteUser);

// Get all bookings for a user
router.get("/bookings/:id", getUserBookings);

// Cancel a booking
router.post("/:id/bookings/cancel", cancelUserBooking);

export default router;

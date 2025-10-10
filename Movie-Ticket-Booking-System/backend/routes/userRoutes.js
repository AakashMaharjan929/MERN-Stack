import express from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  changeUserPassword,
  deleteUser,
  getUserBookings,
  cancelUserBooking,
  getAllUsers,
  getUserById,
  updateUserRole,
  blacklistUser,
  bulkDeleteUsers,
  bulkUpdateRoles
} from "../controllers/userController.js";

const router = express.Router();

// -------------------------
// User Routes (Public/User-facing)
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

// -------------------------
// Admin Routes (Protected - assume middleware like authAdmin)
// -------------------------

// Get all users (with pagination/search/filter)
router.get("/", getAllUsers);

// Get single user by ID
router.get("/:id", getUserById);

// Update user role/status
router.put("/:id/role", updateUserRole);

// Blacklist/ban user
router.put("/:id/blacklist", blacklistUser);

// Bulk delete users
router.delete("/bulk", bulkDeleteUsers);

// Bulk update roles
router.put("/bulk/roles", bulkUpdateRoles);

export default router;
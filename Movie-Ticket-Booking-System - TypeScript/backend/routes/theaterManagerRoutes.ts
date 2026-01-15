import { Router } from "express";
import { protect, theaterManager, admin } from "../middleware/authMiddleware.js";
import {
  getMyTheater,
  updateMyTheater,
  getMyShows,
  getMyBookings,
  getRevenueReport,
  getDashboardStats,
  createTheaterManager
} from "../controllers/theaterManagerController.js";

const router = Router();

// Admin route to create theater manager
router.post("/create", protect, admin, createTheaterManager);

// All other routes require theater manager authentication
router.use(protect, theaterManager);

// Theater details
router.get("/theater", getMyTheater);
router.put("/theater", updateMyTheater);

// Shows management
router.get("/shows", getMyShows);

// Bookings management
router.get("/bookings", getMyBookings);

// Reports
router.get("/revenue-report", getRevenueReport);
router.get("/dashboard", getDashboardStats);

export default router;

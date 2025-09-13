import express from "express";
import userRoutes from "./userRoutes.js";
import movieRoutes from "./movieRoutes.js";
import showRoutes from "./showRoutes.js";
import screenRoutes from "./screenRoutes.js"; // Import screen routes
import theaterRoutes from "./theaterRoutes.js"; // Import theater routes
import bookingRoutes from "./bookingRoutes.js"; // Uncomment if booking routes are needed


const router = express.Router();

// Route prefix: /user
router.use("/user", userRoutes);
router.use("/movie", movieRoutes);  
router.use("/show", showRoutes);
router.use("/screen", screenRoutes); // Added screen routes
router.use("/theater", theaterRoutes); // Added theater routes
router.use("/booking", bookingRoutes); // Uncomment if booking routes are needed

// You can add more routes later, e.g., /movie, /booking, /theater
// router.use("/movie", movieRoutes);
// router.use("/booking", bookingRoutes);

export default router;

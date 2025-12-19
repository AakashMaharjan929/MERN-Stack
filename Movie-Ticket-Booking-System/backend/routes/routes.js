import express from "express";
import userRoutes from "./userRoutes.js";
import movieRoutes from "./movieRoutes.js";
import showRoutes from "./showRoutes.js";
import screenRoutes from "./screenRoutes.js"; // Import screen routes
import theaterRoutes from "./theaterRoutes.js"; // Import theater routes
import bookingRoutes from "./bookingRoutes.js"; // Uncomment if booking routes are needed
import authRoutes from "./auth.js"; // Import auth routes
import paymentRoutes from "./paymentRoutes.js"; // Import payment routes
import stripeRoutes from "./stripeRoutes.js"; // Import stripe routes



const router = express.Router();

// Route prefix: /user
router.use("/user", userRoutes);
router.use("/movie", movieRoutes);  
router.use("/show", showRoutes);
router.use("/screen", screenRoutes); // Added screen routes
router.use("/theater", theaterRoutes); // Added theater routes
router.use("/booking", bookingRoutes); // Uncomment if booking routes are needed
router.use("/auth", authRoutes); // Added auth routes
router.use("/payment", paymentRoutes); // Import payment routes
router.use("/stripe", stripeRoutes); // Import stripe routes

// You can add more routes later, e.g., /movie, /booking, /theater
// router.use("/movie", movieRoutes);
// router.use("/booking", bookingRoutes);

export default router;

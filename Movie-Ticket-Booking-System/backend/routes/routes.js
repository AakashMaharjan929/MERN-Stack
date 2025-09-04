import express from "express";
import userRoutes from "./userRoutes.js";
import movieRoutes from "./movieRoutes.js";

const router = express.Router();

// Route prefix: /user
router.use("/user", userRoutes);
router.use("/movie", movieRoutes);

// You can add more routes later, e.g., /movie, /booking, /theater
// router.use("/movie", movieRoutes);
// router.use("/booking", bookingRoutes);

export default router;

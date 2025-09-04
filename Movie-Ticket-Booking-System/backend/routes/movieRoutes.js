import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
  getMoviesByGenre,
  getTopRatedMovies,
  getAllMovies,
  getMovieById
} from "../controllers/movieController.js";

import multer from "multer";
import path from "path";

const router = express.Router();

// ---------------------------
// Multer setup for poster uploads
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/posters"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ---------------------------
// Routes
// ---------------------------

// Add a new movie with posters
router.post(
  "/",
  upload.fields([
    { name: "profilePoster", maxCount: 1 },
    { name: "bannerPoster", maxCount: 1 }
  ]),
  addMovie
);

// Update movie details (optionally with new posters)
router.put(
  "/:id",
  upload.fields([
    { name: "profilePoster", maxCount: 1 },
    { name: "bannerPoster", maxCount: 1 }
  ]),
  updateMovie
);

// Delete movie
router.delete("/:id", deleteMovie);

// Rate movie
router.post("/:id/rate", rateMovie);

// Get movies by genre
router.get("/genre/:genre", getMoviesByGenre);

// Get top-rated movies
router.get("/top-rated", getTopRatedMovies);

// Get all movies
router.get("/", getAllMovies);

// Get single movie by ID
router.get("/:id", getMovieById);

export default router;

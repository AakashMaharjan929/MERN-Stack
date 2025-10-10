import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
  getMoviesByGenre,
  getMoviesByLanguage, // New import
  searchMovies, // New import
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

// Get movies by language (New)
router.get("/language/:language", getMoviesByLanguage);

// Search movies by title/description (New: e.g., GET /search?query=avengers&limit=10)
router.get("/search", searchMovies);

// Get top-rated movies (supports ?limit=10)
router.get("/top-rated", getTopRatedMovies);

// Get all movies (supports ?page=1&limit=10)
router.get("/", getAllMovies);

// Get single movie by ID
router.get("/:id", getMovieById);

export default router;
import Movie from "../models/Movie.js";
import fs from "fs";
import path from "path";

// ---------------------------
// Add new movie
// ---------------------------
export const addMovie = async (req, res) => {
  try {
    const { title, genre, language, duration, cast, rating } = req.body;

    // Poster filenames from Multer
    const profilePoster = req.files?.profilePoster[0]?.filename;
    const bannerPoster = req.files?.bannerPoster[0]?.filename;

    if (!profilePoster || !bannerPoster) {
      return res.status(400).json({ message: "Both posters are required" });
    }

    const movie = await Movie.addMovie({
      title,
      genre,
      language,
      duration,
      cast: cast.split(","), // assuming cast sent as comma-separated string
      rating,
      profilePoster,
      bannerPoster
    });

    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Update movie
// ---------------------------
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const { title, genre, language, duration, cast, rating } = req.body;

    // Check if new posters uploaded
    const profilePoster = req.files?.profilePoster ? req.files.profilePoster[0].filename : undefined;
    const bannerPoster = req.files?.bannerPoster ? req.files.bannerPoster[0].filename : undefined;

    // Delete old posters if replaced
    if (profilePoster && movie.profilePoster) {
      const oldPath = path.join(process.cwd(), "public", "posters", movie.profilePoster);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    if (bannerPoster && movie.bannerPoster) {
      const oldPath = path.join(process.cwd(), "public", "posters", movie.bannerPoster);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await movie.updateMovieDetails({
      title,
      genre,
      language,
      duration,
      cast: cast ? cast.split(",") : undefined,
      rating,
      profilePoster,
      bannerPoster
    });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Delete movie
// ---------------------------
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await movie.deleteMovie(); // deletes DB record + poster files
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Rate movie
// ---------------------------
export const rateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { userRating } = req.body;
    if (userRating < 0 || userRating > 10)
      return res.status(400).json({ message: "Rating must be 0-10" });

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const newRating = await movie.rateMovie(userRating);
    res.json({ message: "Rating updated", rating: newRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get movies by genre
// ---------------------------
export const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const movies = await Movie.findByGenre(genre);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get top-rated movies
// ---------------------------
export const getTopRatedMovies = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const movies = await Movie.findTopRated(limit);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all movies
// ---------------------------
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get single movie by ID
// ---------------------------
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie.getMovieInfo());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

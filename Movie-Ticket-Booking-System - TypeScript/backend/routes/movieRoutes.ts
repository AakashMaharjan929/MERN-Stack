import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
  getMoviesByGenre,
  getMoviesByLanguage,
  searchMovies,
  getTopRatedMovies,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "public/posters"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "profilePoster", maxCount: 1 },
    { name: "bannerPoster", maxCount: 1 },
  ]),
  addMovie
);

router.put(
  "/:id",
  upload.fields([
    { name: "profilePoster", maxCount: 1 },
    { name: "bannerPoster", maxCount: 1 },
  ]),
  updateMovie
);

router.delete("/:id", deleteMovie);
router.post("/:id/rate", rateMovie);
router.get("/genre/:genre", getMoviesByGenre);
router.get("/language/:language", getMoviesByLanguage);
router.get("/search", searchMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

export default router;

// Updated Movie.js - Added description and other fields
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 1000 }, // New: Synopsis
  genre: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true, min: 1 }, // in minutes
  releaseDate: { type: Date, required: true }, // New: For scheduling
  director: { type: [String], required: true }, // New: Array for multiple
  cast: [{ type: String, required: true }],
  certification: { type: String, enum: ["U", "U/A", "A", "S"], default: "U" }, // New: Age rating
  trailerUrl: { type: String }, // New: Optional embed link
  status: { type: String, enum: ["Upcoming", "Now Showing", "Completed"], default: "Upcoming" }, // New
  rating: { type: Number, min: 0, max: 10, default: 0 },
  totalVotes: { type: Number, default: 0 },
  profilePoster: { type: String, required: true }, // stored in /public/posters/
  bannerPoster: { type: String, required: true }   // stored in /public/posters/
}, { timestamps: true });

// Indexes for search/performance
movieSchema.index({ title: "text", description: "text" });
movieSchema.index({ genre: 1, language: 1, status: 1 });

// Class
class MovieClass {
  constructor(title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating = 0, profilePoster, bannerPoster) {
    this.title = title;
    this.description = description;
    this.genre = genre;
    this.language = language;
    this.duration = duration;
    this.releaseDate = releaseDate;
    this.director = director;
    this.cast = cast;
    this.certification = certification;
    this.trailerUrl = trailerUrl;
    this.status = status;
    this.rating = rating;
    this.profilePoster = profilePoster;
    this.bannerPoster = bannerPoster;
  }

  // Factory: Add new movie
  static async addMovie({ title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating, profilePoster, bannerPoster }) {
    const movie = new this({ title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating, profilePoster, bannerPoster });
    return await movie.save();
  }

  // Delete movie + remove poster files
  async deleteMovie() {
    // Delete poster files from public folder
    const posters = [this.profilePoster, this.bannerPoster];
    posters.forEach(file => {
      if (file) {
        const filePath = path.join(process.cwd(), "public", "posters", file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    // Delete document from DB
    await this.deleteOne();
    return true;
  }

  // Update movie details
  async updateMovieDetails({ title, description, genre, language, duration, releaseDate, director, cast, certification, trailerUrl, status, rating, profilePoster, bannerPoster }) {
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (genre !== undefined) this.genre = genre;
    if (language !== undefined) this.language = language;
    if (duration !== undefined) this.duration = duration;
    if (releaseDate !== undefined) this.releaseDate = releaseDate;
    if (director !== undefined) this.director = director;
    if (cast !== undefined) this.cast = cast;
    if (certification !== undefined) this.certification = certification;
    if (trailerUrl !== undefined) this.trailerUrl = trailerUrl;
    if (status !== undefined) this.status = status;
    if (rating !== undefined) this.rating = rating;
    if (profilePoster !== undefined) this.profilePoster = profilePoster;
    if (bannerPoster !== undefined) this.bannerPoster = bannerPoster;
    return await this.save();
  }

  // Update rating
  async rateMovie(userRating) {
    this.rating =
      ((this.rating * this.totalVotes) + userRating) /
      (this.totalVotes + 1);
    this.totalVotes += 1;
    await this.save();
    return this.rating;
  }

  static async findByGenre(genre) {
    return await this.find({ genre });
  }

  static async findByLanguage(language) {
    return await this.find({ language }); // New: By language
  }

  static async findTopRated(limit = 5) {
    return await this.find({ status: "Now Showing" }).sort({ rating: -1 }).limit(limit); // Filter active
  }

  static async searchMovies(query, limit = 10) {
  if (!query || query.trim() === '') return [];
  return await this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  }).limit(limit).sort({ createdAt: -1 });
}

  getMovieInfo() {
    return {
      id: this._id,
      title: this.title,
      description: this.description,
      genre: this.genre,
      language: this.language,
      duration: this.duration,
      releaseDate: this.releaseDate,
      director: this.director,
      cast: this.cast,
      certification: this.certification,
      trailerUrl: this.trailerUrl,
      status: this.status,
      rating: this.rating,
      profilePoster: this.profilePoster,
      bannerPoster: this.bannerPoster
    };
  }
}

// Attach class
movieSchema.loadClass(MovieClass);

// Export model
export default mongoose.model("Movie", movieSchema);
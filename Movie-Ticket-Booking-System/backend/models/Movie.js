import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  cast: [{ type: String, required: true }],
  rating: { type: Number, min: 0, max: 10, default: 0 },
  totalVotes: { type: Number, default: 0 },
  profilePoster: { type: String, required: true }, // stored in /public/posters/
  bannerPoster: { type: String, required: true }   // stored in /public/posters/
}, { timestamps: true });

// Class
class MovieClass {
  constructor(title, genre, language, duration, cast, rating = 0, profilePoster, bannerPoster) {
    this.title = title;
    this.genre = genre;
    this.language = language;
    this.duration = duration;
    this.cast = cast;
    this.rating = rating;
    this.profilePoster = profilePoster;
    this.bannerPoster = bannerPoster;
  }

  // Factory: Add new movie
  static async addMovie({ title, genre, language, duration, cast, rating, profilePoster, bannerPoster }) {
    const movie = new this({ title, genre, language, duration, cast, rating, profilePoster, bannerPoster });
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
  async updateMovieDetails({ title, genre, language, duration, cast, rating, profilePoster, bannerPoster }) {
    if (title) this.title = title;
    if (genre) this.genre = genre;
    if (language) this.language = language;
    if (duration) this.duration = duration;
    if (cast) this.cast = cast;
    if (rating !== undefined) this.rating = rating;
    if (profilePoster) this.profilePoster = profilePoster;
    if (bannerPoster) this.bannerPoster = bannerPoster;
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

  static async findTopRated(limit = 5) {
    return await this.find().sort({ rating: -1 }).limit(limit);
  }

  getMovieInfo() {
    return {
      id: this._id,
      title: this.title,
      genre: this.genre,
      language: this.language,
      duration: this.duration,
      cast: this.cast,
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

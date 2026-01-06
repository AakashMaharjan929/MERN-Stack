import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 1000 },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  duration: { type: Number, required: true, min: 1 },
  releaseDate: { type: Date, required: true },
  director: { type: [String], required: true },
  cast: [{ type: String, required: true }],
  certification: { type: String, enum: ["U", "U/A", "A", "S"], default: "U" },
  trailerUrl: { type: String },
  status: { type: String, enum: ["Upcoming", "Now Showing", "Completed"], default: "Upcoming" },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  totalVotes: { type: Number, default: 0 },
  profilePoster: { type: String, required: true },
  bannerPoster: { type: String, required: true }
}, { timestamps: true });

movieSchema.index({ title: "text", description: "text" });
movieSchema.index({ genre: 1, language: 1, status: 1 });

class MovieClass {
  title!: string;
  description!: string;
  genre!: string;
  language!: string;
  duration!: number;
  releaseDate!: Date;
  director!: string[];
  cast!: string[];
  certification!: string;
  trailerUrl?: string;
  status!: string;
  rating!: number;
  totalVotes!: number;
  profilePoster!: string;
  bannerPoster!: string;

  static async addMovie(data: Record<string, any>) {
    const movie = new (this as any)(data);
    return await movie.save();
  }

  async deleteMovie() {
    const posters = [this.profilePoster, this.bannerPoster];
    posters.forEach(file => {
      if (file) {
        const filePath = path.join(process.cwd(), "public", "posters", file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });
    await (this as unknown as mongoose.Document).deleteOne();
    return true;
  }

  async updateMovieDetails(data: Record<string, any>) {
    Object.assign(this as Record<string, any>, data);
    return await (this as unknown as mongoose.Document).save();
  }

  async rateMovie(userRating: number) {
    this.rating = ((this.rating * this.totalVotes) + userRating) / (this.totalVotes + 1);
    this.totalVotes += 1;
    await (this as unknown as mongoose.Document).save();
    return this.rating;
  }

  static async findByGenre(genre: string) {
    return await (this as any).find({ genre });
  }

  static async findByLanguage(language: string) {
    return await (this as any).find({ language });
  }

  static async findTopRated(limit = 5) {
    return await (this as any).find({ status: "Now Showing" }).sort({ rating: -1 }).limit(limit);
  }

  static async searchMovies(query: string, limit = 10) {
    if (!query || query.trim() === '') return [];
    return await (this as any).find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(limit).sort({ createdAt: -1 });
  }

  getMovieInfo() {
    return {
      id: (this as any)._id,
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

movieSchema.loadClass(MovieClass);
export type IMovieDocument = mongoose.HydratedDocument<MovieClass>;
export type IMovieModel = mongoose.Model<MovieClass> & typeof MovieClass;

const Movie = mongoose.model<MovieClass, IMovieModel>("Movie", movieSchema);

export default Movie;

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
  // Properties
  title!: string;
  description!: string;
  genre!: string;
  language!: string;
  duration!: number;
  releaseDate!: Date;
  director!: string[];
  cast!: string[];
  certification!: "U" | "U/A" | "A" | "S";
  trailerUrl?: string;
  status!: "Upcoming" | "Now Showing" | "Completed";
  rating!: number;
  totalVotes!: number;
  profilePoster!: string;
  bannerPoster!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validate movie data
   */
  isValid(): boolean {
    return !!(this.title && this.description && this.genre && this.language &&
           this.duration > 0 && this.releaseDate && this.director.length > 0 &&
           this.cast.length > 0 && this.profilePoster && this.bannerPoster);
  }

  /**
   * Validate status
   */
  private isValidStatus(status: string): boolean {
    return ["Upcoming", "Now Showing", "Completed"].includes(status);
  }

  /**
   * Validate certification
   */
  private isValidCertification(cert: string): boolean {
    return ["U", "U/A", "A", "S"].includes(cert);
  }

  /**
   * Validate duration
   */
  private isValidDuration(duration: number): boolean {
    return duration > 0 && duration <= 600; // Max 10 hours
  }

  // ==================== STATUS MANAGEMENT ====================
  /**
   * Mark movie as upcoming
   */
  async markAsUpcoming(): Promise<MovieClass> {
    try {
      this.status = "Upcoming";
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to mark as upcoming: ${(error as Error).message}`);
    }
  }

  /**
   * Mark movie as now showing
   */
  async markAsNowShowing(): Promise<MovieClass> {
    try {
      this.status = "Now Showing";
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to mark as now showing: ${(error as Error).message}`);
    }
  }

  /**
   * Mark movie as completed
   */
  async markAsCompleted(): Promise<MovieClass> {
    try {
      this.status = "Completed";
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to mark as completed: ${(error as Error).message}`);
    }
  }

  /**
   * Check if movie is upcoming
   */
  isUpcoming(): boolean {
    return this.status === "Upcoming";
  }

  /**
   * Check if movie is now showing
   */
  isNowShowing(): boolean {
    return this.status === "Now Showing";
  }

  /**
   * Check if movie is completed
   */
  isCompleted(): boolean {
    return this.status === "Completed";
  }

  /**
   * Get movie status
   */
  getStatus(): string {
    return this.status;
  }

  // ==================== RATING & REVIEWS ====================
  /**
   * Add user rating
   */
  async rateMovie(userRating: number): Promise<number> {
    try {
      if (userRating < 0 || userRating > 10) {
        throw new Error("Rating must be between 0 and 10");
      }

      this.rating = ((this.rating * this.totalVotes) + userRating) / (this.totalVotes + 1);
      this.totalVotes += 1;
      await (this as unknown as mongoose.Document).save();
      return this.rating;
    } catch (error) {
      throw new Error(`Failed to rate movie: ${(error as Error).message}`);
    }
  }

  /**
   * Get average rating
   */
  getAverageRating(): number {
    return Math.round(this.rating * 10) / 10;
  }

  /**
   * Get total votes
   */
  getTotalVotes(): number {
    return this.totalVotes;
  }

  /**
   * Get rating percentage
   */
  getRatingPercentage(): number {
    return Math.round((this.rating / 10) * 100);
  }

  /**
   * Check if movie is highly rated
   */
  isHighlyRated(threshold = 7): boolean {
    return this.rating >= threshold;
  }

  // ==================== MOVIE INFORMATION ====================
  /**
   * Get movie duration in format (HH:MM)
   */
  getFormattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }

  /**
   * Get movie duration in minutes
   */
  getDurationInMinutes(): number {
    return this.duration;
  }

  /**
   * Get movie duration in seconds
   */
  getDurationInSeconds(): number {
    return this.duration * 60;
  }

  /**
   * Check if movie is released
   */
  isReleased(): boolean {
    return this.releaseDate <= new Date();
  }

  /**
   * Check if movie is releasing soon
   */
  isReleasingSoon(daysThreshold = 7): boolean {
    const releaseTime = this.releaseDate.getTime();
    const nowTime = new Date().getTime();
    const daysToRelease = (releaseTime - nowTime) / (1000 * 60 * 60 * 24);
    return daysToRelease > 0 && daysToRelease <= daysThreshold;
  }

  /**
   * Get days until release
   */
  daysUntilRelease(): number {
    const daysToRelease = (this.releaseDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil(daysToRelease);
  }

  /**
   * Get full movie info
   */
  getMovieInfo(): Record<string, any> {
    return {
      id: (this as any)._id,
      title: this.title,
      description: this.description,
      genre: this.genre,
      language: this.language,
      duration: this.getFormattedDuration(),
      durationMinutes: this.duration,
      releaseDate: this.releaseDate,
      director: this.director,
      cast: this.cast,
      certification: this.certification,
      trailerUrl: this.trailerUrl,
      status: this.status,
      rating: this.getAverageRating(),
      ratingPercentage: this.getRatingPercentage(),
      totalVotes: this.totalVotes,
      profilePoster: this.profilePoster,
      bannerPoster: this.bannerPoster,
      isReleased: this.isReleased(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Get basic movie info
   */
  getBasicInfo(): Record<string, any> {
    return {
      id: (this as any)._id,
      title: this.title,
      genre: this.genre,
      rating: this.getAverageRating(),
      status: this.status,
      profilePoster: this.profilePoster
    };
  }

  // ==================== CONTENT MANAGEMENT ====================
  /**
   * Update movie details
   */
  async updateMovieDetails(data: {
    title?: string;
    description?: string;
    genre?: string;
    language?: string;
    duration?: number;
    trailerUrl?: string;
    cast?: string[];
    director?: string[];
  }): Promise<any> {
    try {
      if (data.title) this.title = data.title;
      if (data.description) this.description = data.description;
      if (data.genre) this.genre = data.genre;
      if (data.language) this.language = data.language;
      if (data.duration) {
        if (!this.isValidDuration(data.duration)) {
          throw new Error("Invalid duration");
        }
        this.duration = data.duration;
      }
      if (data.trailerUrl) this.trailerUrl = data.trailerUrl;
      if (data.cast) this.cast = data.cast;
      if (data.director) this.director = data.director;

      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to update movie details: ${(error as Error).message}`);
    }
  }

  /**
   * Delete movie and associated files
   */
  async deleteMovie(): Promise<boolean> {
    try {
      const posters = [this.profilePoster, this.bannerPoster];
      posters.forEach(file => {
        if (file) {
          const filePath = path.join(process.cwd(), "public", "posters", file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
      await (this as unknown as mongoose.Document).deleteOne();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete movie: ${(error as Error).message}`);
    }
  }

  /**
   * Update poster images
   */
  async updatePosters(profilePoster?: string, bannerPoster?: string): Promise<any> {
    try {
      if (profilePoster) {
        if (this.profilePoster && fs.existsSync(path.join(process.cwd(), "public", "posters", this.profilePoster))) {
          fs.unlinkSync(path.join(process.cwd(), "public", "posters", this.profilePoster));
        }
        this.profilePoster = profilePoster;
      }

      if (bannerPoster) {
        if (this.bannerPoster && fs.existsSync(path.join(process.cwd(), "public", "posters", this.bannerPoster))) {
          fs.unlinkSync(path.join(process.cwd(), "public", "posters", this.bannerPoster));
        }
        this.bannerPoster = bannerPoster;
      }

      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to update posters: ${(error as Error).message}`);
    }
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create new movie
   */
  static async addMovie(data: Record<string, any>): Promise<MovieClass> {
    try {
      const movie = new (this as any)(data);
      if (!movie.isValid()) {
        throw new Error("Invalid movie data");
      }
      await movie.save();
      return movie;
    } catch (error) {
      throw new Error(`Failed to create movie: ${(error as Error).message}`);
    }
  }

  // ==================== QUERY METHODS ====================
  /**
   * Find movies by genre
   */
  static async findByGenre(genre: string): Promise<MovieClass[]> {
    return await (this as any).find({ genre, status: "Now Showing" }).sort({ rating: -1 });
  }

  /**
   * Find movies by language
   */
  static async findByLanguage(language: string): Promise<MovieClass[]> {
    return await (this as any).find({ language, status: "Now Showing" }).sort({ rating: -1 });
  }

  /**
   * Find top rated movies
   */
  static async findTopRated(limit = 5): Promise<MovieClass[]> {
    return await (this as any)
      .find({ status: "Now Showing" })
      .sort({ rating: -1 })
      .limit(limit);
  }

  /**
   * Find upcoming movies
   */
  static async findUpcoming(limit = 10): Promise<MovieClass[]> {
    return await (this as any)
      .find({ status: "Upcoming" })
      .sort({ releaseDate: 1 })
      .limit(limit);
  }

  /**
   * Find movies by status
   */
  static async findByStatus(status: "Upcoming" | "Now Showing" | "Completed"): Promise<MovieClass[]> {
    return await (this as any).find({ status }).sort({ createdAt: -1 });
  }

  /**
   * Search movies
   */
  static async searchMovies(query: string, limit = 10): Promise<MovieClass[]> {
    if (!query || query.trim() === '') return [];
    return await (this as any)
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  /**
   * Find by title
   */
  static async findByTitle(title: string): Promise<MovieClass | null> {
    return await (this as any).findOne({ title });
  }

  /**
   * Get all now showing movies
   */
  static async getNowShowing(): Promise<MovieClass[]> {
    return await (this as any).find({ status: "Now Showing" }).sort({ rating: -1 });
  }

  /**
   * Get trending movies
   */
  static async getTrendingMovies(limit = 10): Promise<MovieClass[]> {
    return await (this as any)
      .find({ status: "Now Showing" })
      .sort({ totalVotes: -1, rating: -1 })
      .limit(limit);
  }
}

movieSchema.loadClass(MovieClass);
export type IMovieDocument = mongoose.HydratedDocument<MovieClass>;
export type IMovieModel = mongoose.Model<MovieClass> & typeof MovieClass;

const Movie = mongoose.model<MovieClass, IMovieModel>("Movie", movieSchema);

export default Movie;

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
    static async addMovie(data) {
        const movie = new this(data);
        return await movie.save();
    }
    async deleteMovie() {
        const posters = [this.profilePoster, this.bannerPoster];
        posters.forEach(file => {
            if (file) {
                const filePath = path.join(process.cwd(), "public", "posters", file);
                if (fs.existsSync(filePath))
                    fs.unlinkSync(filePath);
            }
        });
        await this.deleteOne();
        return true;
    }
    async updateMovieDetails(data) {
        Object.assign(this, data);
        return await this.save();
    }
    async rateMovie(userRating) {
        this.rating = ((this.rating * this.totalVotes) + userRating) / (this.totalVotes + 1);
        this.totalVotes += 1;
        await this.save();
        return this.rating;
    }
    static async findByGenre(genre) {
        return await this.find({ genre });
    }
    static async findByLanguage(language) {
        return await this.find({ language });
    }
    static async findTopRated(limit = 5) {
        return await this.find({ status: "Now Showing" }).sort({ rating: -1 }).limit(limit);
    }
    static async searchMovies(query, limit = 10) {
        if (!query || query.trim() === '')
            return [];
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
movieSchema.loadClass(MovieClass);
const Movie = mongoose.model("Movie", movieSchema);
export default Movie;

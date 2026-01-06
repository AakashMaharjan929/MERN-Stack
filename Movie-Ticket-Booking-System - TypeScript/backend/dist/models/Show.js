import mongoose from "mongoose";
import Movie from "../models/Movie.js";
const showSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
    startTime: { type: Date, required: true },
    endTime: {
        type: Date,
        required: true,
        validate: [
            function (value) {
                return value > this.startTime;
            },
            'End time must be after start time'
        ]
    },
    showType: { type: String, enum: ['Regular', 'Special'], default: 'Regular' },
    pricingRules: {
        standardBasePrice: { type: Number, required: true },
        premiumBasePrice: { type: Number, required: true },
        alpha: { type: Number, default: 0.1 },
        beta: { type: Number, default: 0.05 },
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Completed'],
        default: 'Upcoming'
    },
    availableSeats: [mongoose.Schema.Types.Mixed],
    totalSeatCount: { type: Number, required: true },
    pricingHistory: [
        {
            timestamp: { type: Date, default: Date.now },
            soldSeats: { type: Number, default: 0 },
            calculatedPrice: {
                standard: { type: Number },
                premium: { type: Number }
            },
            revenue: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });
showSchema.index({ screenId: 1, startTime: 1, endTime: 1 });
showSchema.pre('save', async function (next) {
    const ShowModel = mongoose.model('Show');
    const existing = await ShowModel.find({
        screenId: this.screenId,
        _id: { $ne: this._id },
        startTime: { $lt: this.endTime },
        endTime: { $gt: this.startTime }
    });
    if (existing.length > 0) {
        const conflictTimes = existing.map((s) => s.startTime.toISOString().split('T')[1].slice(0, 5)).join(', ');
        return next(new Error(`Conflict with existing shows at times: ${conflictTimes}`));
    }
    next();
});
class ShowClass {
    static async suggestFactors(movieId, startTime) {
        const movie = await Movie.findById(movieId);
        const genre = movie?.genre?.toLowerCase() || 'other';
        const hour = new Date(startTime).getHours();
        let baseAlpha = 0.1;
        const highDemandGenres = ['action', 'thriller', 'horror', 'science fiction', 'fantasy'];
        const lowDemandGenres = ['drama', 'romance', 'family', 'documentary'];
        if (highDemandGenres.includes(genre))
            baseAlpha = 0.15;
        else if (lowDemandGenres.includes(genre))
            baseAlpha = 0.08;
        else if (['comedy', 'animation', 'music'].includes(genre))
            baseAlpha = 0.12;
        else if (['crime', 'mystery', 'history', 'war', 'western', 'adventure'].includes(genre))
            baseAlpha = 0.13;
        let baseBeta = 0.05;
        if (hour >= 18 && hour <= 22)
            baseBeta = 0.08;
        else if (hour >= 12 && hour <= 17)
            baseBeta = 0.03;
        else if (hour < 12 || hour > 22)
            baseBeta = 0.04;
        const historical = await this.aggregate([
            {
                $lookup: {
                    from: 'movies',
                    localField: 'movieId',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            { $unwind: '$movie' },
            { $match: { 'movie.genre': { $eq: genre.charAt(0).toUpperCase() + genre.slice(1) } } },
            {
                $group: {
                    _id: null,
                    avgAlpha: { $avg: '$pricingRules.alpha' },
                    avgBeta: { $avg: '$pricingRules.beta' }
                }
            }
        ]);
        const histAlpha = historical[0]?.avgAlpha || baseAlpha;
        const histBeta = historical[0]?.avgBeta || baseBeta;
        const alpha = Math.max(0, Math.min(0.2, Math.round((histAlpha * 0.7 + baseAlpha * 0.3) * 100) / 100));
        const beta = Math.max(0, Math.min(0.1, Math.round((histBeta * 0.7 + baseBeta * 0.3) * 100) / 100));
        const rationale = `Genre: ${genre}, Time: ${hour}:00h, Historical avg: α=${histAlpha.toFixed(2)}, β=${histBeta.toFixed(2)}`;
        return { alpha, beta, rationale };
    }
    async calculateOptimalFactors() {
        if (this.endTime > new Date()) {
            throw new Error('Show has not ended yet');
        }
        const totalSeats = this.totalSeatCount;
        const finalSoldSeats = this.availableSeats.filter((s) => s && s.isBooked).length;
        const finalFillRate = finalSoldSeats / totalSeats || 0;
        const targetFillRate = 0.8;
        const history = this.pricingHistory || [];
        const elasticity = 2;
        const k = 0.5;
        const alphaOpt = Math.max(0.05, Math.min(0.2, this.pricingRules.alpha + k * (finalFillRate - targetFillRate) * elasticity));
        let salesAcceleration = 0;
        if (history.length > 1) {
            const last24hStart = new Date(this.endTime.getTime() - 24 * 60 * 60 * 1000);
            const last24hSales = history.filter((h) => h.timestamp > last24hStart)
                .reduce((sum, h, idx) => {
                const prevSold = history[idx - 1]?.soldSeats || 0;
                return sum + (h.soldSeats - prevSold);
            }, 0);
            const totalSales = finalSoldSeats;
            salesAcceleration = totalSales ? last24hSales / totalSales : 0;
        }
        const targetAcceleration = 0.3;
        const betaOpt = Math.max(0.02, Math.min(0.1, this.pricingRules.beta + 0.3 * (targetAcceleration - salesAcceleration)));
        this.pricingRules.alpha = alphaOpt;
        this.pricingRules.beta = betaOpt;
        const rationale = `Optimal post-analysis: Fill=${(finalFillRate * 100).toFixed(1)}%, Last24h=${(salesAcceleration * 100).toFixed(1)}% sales. Target: 80% fill, 30% final-day.`;
        console.log(`Optimal update for show ${this._id}: α→${alphaOpt.toFixed(3)}, β→${betaOpt.toFixed(3)}. ${rationale}`);
        await this.save();
        return { alpha: alphaOpt, beta: betaOpt, rationale };
    }
    calculatePrice(seatType) {
        const { standardBasePrice, premiumBasePrice, alpha, beta } = this.pricingRules;
        const totalSeats = this.totalSeatCount;
        const soldSeats = this.availableSeats.filter((s) => s && s.isBooked).length;
        const now = new Date();
        const maxTime = this.startTime.getTime() - this.createdAt.getTime();
        const timeToShow = this.startTime.getTime() - now.getTime();
        let base = seatType === "Premium" ? premiumBasePrice : standardBasePrice;
        if (this.showType === 'Special') {
            base = Math.round(base * 1.2);
        }
        const demandFactor = alpha * (soldSeats / totalSeats) * base;
        const hoursToShow = Math.max(0, (this.startTime.valueOf() - now.valueOf()) / (1000 * 60 * 60));
        let urgencyMultiplier = 0;
        if (hoursToShow <= 2) {
            urgencyMultiplier = 1.0;
        }
        else if (hoursToShow <= 24) {
            urgencyMultiplier = 0.7;
        }
        else if (hoursToShow <= 72) {
            urgencyMultiplier = 0.4;
        }
        else if (hoursToShow <= 168) {
            urgencyMultiplier = 0.2;
        }
        else {
            urgencyMultiplier = 0;
        }
        const timeFactor = beta * urgencyMultiplier * base;
        const price = base + demandFactor + timeFactor;
        return Math.round(price);
    }
    getAvailableSeats() {
        return this.availableSeats.filter((s) => s && !s.isBooked);
    }
    isSeatAvailable(seatId) {
        const seat = this.availableSeats.find((s) => s && s.seatNumber === seatId);
        return seat && !seat.isBooked;
    }
    async bookSeats(seatIds) {
        const now = new Date();
        const bookingCutoff = new Date(this.startTime.getTime() - 15 * 60 * 1000);
        if (now > bookingCutoff) {
            throw new Error("Booking closed: Show has started or starts soon.");
        }
        if (this.status === 'Live' || this.status === 'Completed') {
            throw new Error("Cannot book seats for a live or completed show.");
        }
        const notAvailable = [];
        this.availableSeats.forEach((seat) => {
            if (seatIds.includes(seat?.seatNumber)) {
                if (!seat) {
                    notAvailable.push('Aisle (non-bookable)');
                    return;
                }
                if (seat.isBooked) {
                    notAvailable.push(seat.seatNumber);
                }
                else {
                    seat.isBooked = true;
                }
            }
        });
        if (notAvailable.length > 0) {
            throw new Error(`Seats not available: ${notAvailable.join(", ")}`);
        }
        this.markModified('availableSeats');
    }
    async cancelBooking(seatIds) {
        this.availableSeats.forEach((seat) => {
            const seatNumber = seat?.seatNumber;
            if (!seatNumber)
                return;
            if (seatIds.includes(seatNumber)) {
                seat.isBooked = false;
            }
        });
        this.markModified('availableSeats');
        await this.save();
        return { success: true, cancelled: seatIds };
    }
    async updateShow(details) {
        this.set(details);
        if (details.pricingRules) {
            this.pricingRules = { ...this.pricingRules, ...details.pricingRules };
        }
        await this.save();
        return this;
    }
    async deleteShow() {
        await this.deleteOne();
        return { success: true, message: "Show deleted successfully" };
    }
    static async bulkCreate(showDataArray) {
        const shows = showDataArray.map(data => new this(data));
        await Promise.all(shows.map((s) => s.validate()));
        return await this.insertMany(shows);
    }
    static async checkConflicts(screenId, proposedStart, proposedEnd) {
        const conflicts = await this.find({
            screenId,
            startTime: { $lt: proposedEnd },
            endTime: { $gt: proposedStart }
        }).populate('movieId', 'title');
        return conflicts.map((c) => ({
            id: c._id,
            movie: c.movieId?.title || 'Unknown',
            time: `${c.startTime.toLocaleTimeString()} - ${c.endTime.toLocaleTimeString()}`
        }));
    }
    static async updateAllShowStatuses() {
        const now = new Date();
        await this.updateMany({
            startTime: { $lte: now },
            endTime: { $gt: now },
            status: { $ne: 'Live' }
        }, { $set: { status: 'Live' } });
        await this.updateMany({
            endTime: { $lte: now },
            status: { $ne: 'Completed' }
        }, { $set: { status: 'Completed' } });
        await this.updateMany({
            startTime: { $gt: now },
            status: { $ne: 'Upcoming' }
        }, { $set: { status: 'Upcoming' } });
        console.log(`Show statuses updated at ${now.toISOString()}`);
    }
}
showSchema.loadClass(ShowClass);
const Show = mongoose.model("Show", showSchema);
export default Show;

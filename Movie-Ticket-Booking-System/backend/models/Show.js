import mongoose from "mongoose";
import Movie from "../models/Movie.js"; // Import for suggestFactors

// ---------------------------
// Schema
// ---------------------------
const showSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
      validate: [
        function(value) {
          return value > this.startTime;
        },
        'End time must be after start time'
      ]
    },
    showType: { type: String, enum: ['Regular', 'Special'], default: 'Regular' },
    pricingRules: { 
      standardBasePrice: { type: Number, required: true }, // e.g., 200
      premiumBasePrice: { type: Number, required: true },  // e.g., 300
      alpha: { type: Number, default: 0.1 }, // demand factor
      beta: { type: Number, default: 0.05 }, // time factor
    },
    // In models/Show.js
status: {
  type: String,
  enum: ['Upcoming', 'Live', 'Completed'],
  default: 'Upcoming'
},
    availableSeats: [mongoose.Schema.Types.Mixed],  // UPDATED: Mixed to allow nulls (aisles) or seat objects
    totalSeatCount: { type: Number, required: true },  // Bookable seats only (excludes nulls)
    pricingHistory: [  // NEW: Track sales snapshots for post-show analysis
      {
        timestamp: { type: Date, default: Date.now },
        soldSeats: { type: Number, default: 0 },
        calculatedPrice: { 
          standard: { type: Number },
          premium: { type: Number }
        },
        revenue: { type: Number, default: 0 }  // Cumulative revenue
      }
    ]
  },
  
  { timestamps: true }
);

// ---------------------------
// Indexes for Performance
// ---------------------------
showSchema.index({ screenId: 1, startTime: 1, endTime: 1 });

// ---------------------------
// Middleware: Overlap Validation
// ---------------------------
showSchema.pre('save', async function(next) {
  const Show = mongoose.model('Show');
  const existing = await Show.find({
    screenId: this.screenId,
    _id: { $ne: this._id }, // Exclude self for updates
    startTime: { $lt: this.endTime },
    endTime: { $gt: this.startTime }
  });
  if (existing.length > 0) {
    const conflictTimes = existing.map(s => s.startTime.toISOString().split('T')[1].slice(0,5)).join(', ');
    return next(new Error(`Conflict with existing shows at times: ${conflictTimes}`));
  }
  next();
});

// ---------------------------
// Class
// ---------------------------
class ShowClass {
  // ---------------------------
  // Static: Suggest Factors (genre rules + historical averages)
  // ---------------------------
  static async suggestFactors(movieId, startTime) {
    const movie = await Movie.findById(movieId);
    const genre = movie?.genre?.toLowerCase() || 'other';
    const hour = new Date(startTime).getHours();

    // Genre-based defaults for demand (alpha)
    let baseAlpha = 0.1; // Default
    const highDemandGenres = ['action', 'thriller', 'horror', 'science fiction', 'fantasy'];
    const lowDemandGenres = ['drama', 'romance', 'family', 'documentary'];
    if (highDemandGenres.includes(genre)) baseAlpha = 0.15;
    else if (lowDemandGenres.includes(genre)) baseAlpha = 0.08;
    else if (['comedy', 'animation', 'music'].includes(genre)) baseAlpha = 0.12;
    else if (['crime', 'mystery', 'history', 'war', 'western', 'adventure'].includes(genre)) baseAlpha = 0.13;

    // Time-based defaults for time (beta)
    let baseBeta = 0.05; // Default
    if (hour >= 18 && hour <= 22) baseBeta = 0.08; // Evening peak
    else if (hour >= 12 && hour <= 17) baseBeta = 0.03; // Matinee
    else if (hour < 12 || hour > 22) baseBeta = 0.04; // Off-peak

    // Historical averages: Aggregate past shows with same genre using $lookup
    const historical = await this.aggregate([
      {
        $lookup: {
          from: 'movies', // Collection name for Movie
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      { $match: { 'movie.genre': { $eq: genre.charAt(0).toUpperCase() + genre.slice(1) } } }, // Match case-sensitive genre
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

    // Blend: 70% historical + 30% base (smooths outliers, clamp 0-0.2 for alpha, 0-0.1 for beta)
    const alpha = Math.max(0, Math.min(0.2, Math.round((histAlpha * 0.7 + baseAlpha * 0.3) * 100) / 100));
    const beta = Math.max(0, Math.min(0.1, Math.round((histBeta * 0.7 + baseBeta * 0.3) * 100) / 100));

    const rationale = `Genre: ${genre}, Time: ${hour}:00h, Historical avg: α=${histAlpha.toFixed(2)}, β=${histBeta.toFixed(2)}`;

    return { alpha, beta, rationale };
  }

  // ---------------------------
  // NEW: Post-show optimal factor calculation
  // ---------------------------
  async calculateOptimalFactors() {
    if (this.endTime > new Date()) {
      throw new Error('Show has not ended yet');
    }

    const totalSeats = this.totalSeatCount;  // Bookable (non-null)
    const finalSoldSeats = this.availableSeats.filter(s => s && s.isBooked).length;  // UPDATED: Filter non-null + booked
    const finalFillRate = finalSoldSeats / totalSeats || 0;  // Avoid div-by-zero
    const targetFillRate = 0.8;  // Desired 80% occupancy
    const history = this.pricingHistory || [];

    // Alpha: Optimize for demand elasticity (simple linear: adjust based on fill deviation)
    // Formula: alpha_opt = initial_alpha + k * (fill_rate - target) * elasticity_factor
    // (k=0.5 tunes sensitivity; elasticity=2 assumes doubling impact)
    const elasticity = 2;  // How much alpha affects fill (tune via A/B tests)
    const k = 0.5;
    const alphaOpt = Math.max(0.05, Math.min(0.2, 
      this.pricingRules.alpha + k * (finalFillRate - targetFillRate) * elasticity
    ));

    // Beta: Optimize for time urgency (e.g., % sales in final 24h)
    let salesAcceleration = 0;
    if (history.length > 1) {
      const last24hStart = new Date(this.endTime.getTime() - 24 * 60 * 60 * 1000);
      const last24hSales = history.filter(h => h.timestamp > last24hStart)
                                  .reduce((sum, h, idx) => {
                                    const prevSold = history[idx - 1]?.soldSeats || 0;
                                    return sum + (h.soldSeats - prevSold);
                                  }, 0);
      const totalSales = finalSoldSeats;
      salesAcceleration = last24hSales / totalSales || 0;  // Fraction sold last 24h
    }
    const targetAcceleration = 0.3;  // Ideal 30% in final day
    const betaOpt = Math.max(0.02, Math.min(0.1, 
      this.pricingRules.beta + 0.3 * (targetAcceleration - salesAcceleration)  // Milder tuning
    ));

    // Update stored factors (for historical avgs in suggestFactors)
    this.pricingRules.alpha = alphaOpt;
    this.pricingRules.beta = betaOpt;

    // Log rationale
    const rationale = `Optimal post-analysis: Fill=${(finalFillRate*100).toFixed(1)}%, Last24h=${(salesAcceleration*100).toFixed(1)}% sales. Target: 80% fill, 30% final-day.`;
    console.log(`Optimal update for show ${this._id}: α→${alphaOpt.toFixed(3)}, β→${betaOpt.toFixed(3)}. ${rationale}`);

    await this.save();
    return { alpha: alphaOpt, beta: betaOpt, rationale };
  }

  // ---------------------------
  // Dynamic Pricing per seat type
  // ---------------------------
  calculatePrice(seatType) {
    const { standardBasePrice, premiumBasePrice, alpha, beta } = this.pricingRules;
    const totalSeats = this.totalSeatCount;  // Bookable only
    const soldSeats = this.availableSeats.filter(s => s && s.isBooked).length;  // UPDATED: Non-null + booked

    const now = new Date();
    const maxTime = this.startTime.getTime() - this.createdAt.getTime();
    const timeToShow = this.startTime.getTime() - now.getTime();

    // Base depends on seatType
    let base = seatType === "Premium" ? premiumBasePrice : standardBasePrice;

    // Apply showType markup: +20% for Special shows
    if (this.showType === 'Special') {
      base = Math.round(base * 1.2);
    }

    const demandFactor = alpha * (soldSeats / totalSeats) * base;
    
    // Clamp time factor to [0,1] to avoid NaN/negative
    const normalizedTime = Math.max(0, Math.min(1, timeToShow / (maxTime || 1))); // Avoid div by zero
    const timeFactor = beta * (1 - normalizedTime) * base;
    
    const price = base + demandFactor + timeFactor;
    
    return Math.round(price);
  }

  // ---------------------------
  // Seat Helpers
  // ---------------------------
  getAvailableSeats() {
    return this.availableSeats.filter(s => s && !s.isBooked);  // UPDATED: Non-null + available
  }

  isSeatAvailable(seatId) {
    const seat = this.availableSeats.find(s => s && s.seatNumber === seatId);
    return seat && !seat.isBooked;
  }

  // ---------------------------
  // Booking Methods
  // ---------------------------
// Replace or update the beginning of bookSeats method
async bookSeats(seatIds) {
  const now = new Date();

  // Allow booking only up to 15 minutes before show starts
  const bookingCutoff = new Date(this.startTime.getTime() - 15 * 60 * 1000);

  if (now > bookingCutoff) {
    throw new Error("Booking closed: Show has started or starts soon.");
  }

  // Optional: Explicit status check (extra safety)
  if (this.status === 'Live' || this.status === 'Completed') {
    throw new Error("Cannot book seats for a live or completed show.");
  }

  // ... rest of your existing seat booking logic (unchanged)
  const notAvailable = [];
  this.availableSeats.forEach(seat => {
    if (seatIds.includes(seat?.seatNumber)) {
      if (!seat) {
        notAvailable.push('Aisle (non-bookable)');
        return;
      }
      if (seat.isBooked) {
        notAvailable.push(seat.seatNumber);
      } else {
        seat.isBooked = true;
      }
    }
  });

  if (notAvailable.length > 0) {
    throw new Error(`Seats not available: ${notAvailable.join(", ")}`);
  }

  // ... rest of pricingHistory logging and save
}

  async cancelBooking(seatIds) {
    this.availableSeats.forEach(seat => {
      if (seatIds.includes(seat.seatNumber)) {
        if (seat) {  // UPDATED: Skip null aisles
          seat.isBooked = false;
        }
      }
    });

    await this.save();
    return { success: true, cancelled: seatIds };
  }

  // ---------------------------
  // Update Show Details
  // ---------------------------
  async updateShow(details) {
    // Use Mongoose's set for safer updates
    this.set(details);
    // Handle nested pricingRules merge
    if (details.pricingRules) {
      this.pricingRules = { ...this.pricingRules, ...details.pricingRules };
    }
    await this.save();
    return this;
  }

  // ---------------------------
  // Delete Show
  // ---------------------------
  async deleteShow() {
    await this.deleteOne();
    return { success: true, message: "Show deleted successfully" };
  }

  // ---------------------------
  // Static: Bulk Create
  // ---------------------------
  static async bulkCreate(showDataArray) {
    const shows = showDataArray.map(data => new this(data));
    // Validate all (triggers pre-save hooks)
    await Promise.all(shows.map(s => s.validate()));
    return await this.insertMany(shows);
  }

  // ---------------------------
  // Static: Conflict Check
  // ---------------------------
  static async checkConflicts(screenId, proposedStart, proposedEnd) {
    const conflicts = await this.find({
      screenId,
      startTime: { $lt: proposedEnd },
      endTime: { $gt: proposedStart }
    }).populate('movieId', 'title');
    return conflicts.map(c => ({ 
      id: c._id, 
      movie: c.movieId?.title || 'Unknown', 
      time: `${c.startTime.toLocaleTimeString()} - ${c.endTime.toLocaleTimeString()}` 
    }));
  }

  // Inside ShowClass in models/Show.js

static async updateAllShowStatuses() {
  const now = new Date();

  // Update shows that have started but not ended → Live
  await this.updateMany(
    {
      startTime: { $lte: now },
      endTime: { $gt: now },
      status: { $ne: 'Live' }
    },
    { $set: { status: 'Live' } }
  );

  // Update shows that have ended → Completed
  await this.updateMany(
    {
      endTime: { $lte: now },
      status: { $ne: 'Completed' }
    },
    { $set: { status: 'Completed' } }
  );

  // Optional: Reset any future shows back to Upcoming (in case of manual override)
  await this.updateMany(
    {
      startTime: { $gt: now },
      status: { $ne: 'Upcoming' }
    },
    { $set: { status: 'Upcoming' } }
  );

  console.log(`Show statuses updated at ${now.toISOString()}`);
}
}



// Attach class
showSchema.loadClass(ShowClass);

// Export model
export default mongoose.model("Show", showSchema);
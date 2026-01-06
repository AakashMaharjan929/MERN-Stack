import mongoose from "mongoose";
import Movie from "../models/Movie.js";

const showSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
      required: true,
      validate: [
        function (this: any, value: Date) {
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
  },
  { timestamps: true }
);

showSchema.index({ screenId: 1, startTime: 1, endTime: 1 });

showSchema.pre('save', async function (next) {
  const ShowModel = mongoose.model('Show');
  const existing = await ShowModel.find({
    screenId: (this as any).screenId,
    _id: { $ne: (this as any)._id },
    startTime: { $lt: (this as any).endTime },
    endTime: { $gt: (this as any).startTime }
  });
  if (existing.length > 0) {
    const conflictTimes = existing.map((s: any) => s.startTime.toISOString().split('T')[1].slice(0, 5)).join(', ');
    return next(new Error(`Conflict with existing shows at times: ${conflictTimes}`));
  }
  next();
});

class ShowClass {
  movieId!: mongoose.Schema.Types.ObjectId;
  screenId!: mongoose.Schema.Types.ObjectId;
  startTime!: Date;
  endTime!: Date;
  showType!: string;
  pricingRules!: any;
  status!: string;
  availableSeats!: any[];
  totalSeatCount!: number;
  pricingHistory!: any[];
  createdAt!: Date;

  static async suggestFactors(movieId: string, startTime: string | Date) {
    const movie = await Movie.findById(movieId);
    const genre = movie?.genre?.toLowerCase() || 'other';
    const hour = new Date(startTime).getHours();

    let baseAlpha = 0.1;
    const highDemandGenres = ['action', 'thriller', 'horror', 'science fiction', 'fantasy'];
    const lowDemandGenres = ['drama', 'romance', 'family', 'documentary'];
    if (highDemandGenres.includes(genre)) baseAlpha = 0.15;
    else if (lowDemandGenres.includes(genre)) baseAlpha = 0.08;
    else if (['comedy', 'animation', 'music'].includes(genre)) baseAlpha = 0.12;
    else if (['crime', 'mystery', 'history', 'war', 'western', 'adventure'].includes(genre)) baseAlpha = 0.13;

    let baseBeta = 0.05;
    if (hour >= 18 && hour <= 22) baseBeta = 0.08;
    else if (hour >= 12 && hour <= 17) baseBeta = 0.03;
    else if (hour < 12 || hour > 22) baseBeta = 0.04;

    const historical = await (this as any).aggregate([
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
    const finalSoldSeats = this.availableSeats.filter((s: any) => s && s.isBooked).length;
    const finalFillRate = finalSoldSeats / totalSeats || 0;
    const targetFillRate = 0.8;
    const history = this.pricingHistory || [];

    const elasticity = 2;
    const k = 0.5;
    const alphaOpt = Math.max(0.05, Math.min(0.2,
      this.pricingRules.alpha + k * (finalFillRate - targetFillRate) * elasticity
    ));

    let salesAcceleration = 0;
    if (history.length > 1) {
      const last24hStart = new Date(this.endTime.getTime() - 24 * 60 * 60 * 1000);
      const last24hSales = history.filter((h: any) => h.timestamp > last24hStart)
        .reduce((sum: number, h: any, idx: number) => {
          const prevSold = history[idx - 1]?.soldSeats || 0;
          return sum + (h.soldSeats - prevSold);
        }, 0);
      const totalSales = finalSoldSeats;
      salesAcceleration = totalSales ? last24hSales / totalSales : 0;
    }
    const targetAcceleration = 0.3;
    const betaOpt = Math.max(0.02, Math.min(0.1,
      this.pricingRules.beta + 0.3 * (targetAcceleration - salesAcceleration)
    ));

    this.pricingRules.alpha = alphaOpt;
    this.pricingRules.beta = betaOpt;

    const rationale = `Optimal post-analysis: Fill=${(finalFillRate * 100).toFixed(1)}%, Last24h=${(salesAcceleration * 100).toFixed(1)}% sales. Target: 80% fill, 30% final-day.`;
    console.log(`Optimal update for show ${(this as any)._id}: α→${alphaOpt.toFixed(3)}, β→${betaOpt.toFixed(3)}. ${rationale}`);

    await (this as unknown as mongoose.Document).save();
    return { alpha: alphaOpt, beta: betaOpt, rationale };
  }

  calculatePrice(seatType: string) {
    const { standardBasePrice, premiumBasePrice, alpha, beta } = this.pricingRules;
    const totalSeats = this.totalSeatCount;
    const soldSeats = this.availableSeats.filter((s: any) => s && s.isBooked).length;

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
    } else if (hoursToShow <= 24) {
      urgencyMultiplier = 0.7;
    } else if (hoursToShow <= 72) {
      urgencyMultiplier = 0.4;
    } else if (hoursToShow <= 168) {
      urgencyMultiplier = 0.2;
    } else {
      urgencyMultiplier = 0;
    }

    const timeFactor = beta * urgencyMultiplier * base;
    const price = base + demandFactor + timeFactor;

    return Math.round(price);
  }

  getAvailableSeats() {
    return this.availableSeats.filter((s: any) => s && !s.isBooked);
  }

  isSeatAvailable(seatId: string) {
    const seat = this.availableSeats.find((s: any) => s && s.seatNumber === seatId);
    return seat && !seat.isBooked;
  }

  async bookSeats(seatIds: string[]) {
    const now = new Date();
    const bookingCutoff = new Date(this.startTime.getTime() - 15 * 60 * 1000);

    if (now > bookingCutoff) {
      throw new Error("Booking closed: Show has started or starts soon.");
    }

    if (this.status === 'Live' || this.status === 'Completed') {
      throw new Error("Cannot book seats for a live or completed show.");
    }

    const notAvailable: string[] = [];
    this.availableSeats.forEach((seat: any) => {
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

    (this as any).markModified('availableSeats');
  }

  async cancelBooking(seatIds: string[]) {
    this.availableSeats.forEach((seat: any) => {
      const seatNumber = seat?.seatNumber;
      if (!seatNumber) return;

      if (seatIds.includes(seatNumber)) {
        seat.isBooked = false;
      }
    });

    (this as any).markModified('availableSeats');

    await (this as unknown as mongoose.Document).save();
    return { success: true, cancelled: seatIds };
  }

  async updateShow(details: any) {
    (this as any).set(details);
    if (details.pricingRules) {
      this.pricingRules = { ...this.pricingRules, ...details.pricingRules };
    }
    await (this as unknown as mongoose.Document).save();
    return this;
  }

  async deleteShow() {
    await (this as unknown as mongoose.Document).deleteOne();
    return { success: true, message: "Show deleted successfully" };
  }

  static async bulkCreate(showDataArray: any[]) {
    const shows = showDataArray.map(data => new (this as any)(data));
    await Promise.all(shows.map((s: any) => s.validate()));
    return await (this as any).insertMany(shows);
  }

  static async checkConflicts(screenId: mongoose.Schema.Types.ObjectId, proposedStart: Date, proposedEnd: Date) {
    const conflicts = await (this as any).find({
      screenId,
      startTime: { $lt: proposedEnd },
      endTime: { $gt: proposedStart }
    }).populate('movieId', 'title');
    return conflicts.map((c: any) => ({
      id: c._id,
      movie: c.movieId?.title || 'Unknown',
      time: `${c.startTime.toLocaleTimeString()} - ${c.endTime.toLocaleTimeString()}`
    }));
  }

  static async updateAllShowStatuses() {
    const now = new Date();

    await (this as any).updateMany(
      {
        startTime: { $lte: now },
        endTime: { $gt: now },
        status: { $ne: 'Live' }
      },
      { $set: { status: 'Live' } }
    );

    await (this as any).updateMany(
      {
        endTime: { $lte: now },
        status: { $ne: 'Completed' }
      },
      { $set: { status: 'Completed' } }
    );

    await (this as any).updateMany(
      {
        startTime: { $gt: now },
        status: { $ne: 'Upcoming' }
      },
      { $set: { status: 'Upcoming' } }
    );

    console.log(`Show statuses updated at ${now.toISOString()}`);
  }
}

showSchema.loadClass(ShowClass);
export type IShowDocument = mongoose.HydratedDocument<ShowClass>;
export type IShowModel = mongoose.Model<ShowClass> & typeof ShowClass;

const Show = mongoose.model<ShowClass, IShowModel>("Show", showSchema);

export default Show;

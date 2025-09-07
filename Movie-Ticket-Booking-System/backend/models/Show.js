import mongoose from "mongoose";

// ---------------------------
// Schema
// ---------------------------
const showSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    pricingRules: { 
      standardBasePrice: { type: Number, required: true }, // e.g., 200
      premiumBasePrice: { type: Number, required: true },  // e.g., 300
      alpha: { type: Number, default: 0.1 }, // demand factor
      beta: { type: Number, default: 0.05 }, // time factor
    },
    availableSeats: [
      {
        seatNumber: { type: String, required: true },   // A1, B2
        seatType: { type: String, enum: ["Standard", "Premium"], required: true },
        isBooked: { type: Boolean, default: false }
      }
    ],
    totalSeatCount: { type: Number, required: true }
  },
  { timestamps: true }
);

// ---------------------------
// Class
// ---------------------------
class ShowClass {
  // ---------------------------
  // Dynamic Pricing per seat type
  // ---------------------------
  calculatePrice(seatType) {
    const { standardBasePrice, premiumBasePrice, alpha, beta } = this.pricingRules;
    const totalSeats = this.totalSeatCount;
    const soldSeats = this.availableSeats.filter(s => s.isBooked).length;

    const now = new Date();
    const maxTime = this.startTime - this.createdAt;
    const timeToShow = this.startTime - now;

    // Base depends on seatType
    const base = seatType === "Premium" ? premiumBasePrice : standardBasePrice;

    const demandFactor = alpha * (soldSeats / totalSeats) * base;
    const timeFactor = beta * (1 - timeToShow / maxTime) * base;
    
    const price = base + demandFactor + timeFactor;
    
    return Math.round(price);

  }

  // ---------------------------
  // Seat Helpers
  // ---------------------------
  getAvailableSeats() {
    return this.availableSeats.filter(s => !s.isBooked);
  }

  isSeatAvailable(seatId) {
    const seat = this.availableSeats.find(s => s.seatNumber === seatId);
    return seat && !seat.isBooked;
  }

  // ---------------------------
  // Booking Methods
  // ---------------------------
  async bookSeats(seatIds) {
    const notAvailable = [];
    this.availableSeats.forEach(seat => {
      if (seatIds.includes(seat.seatNumber)) {
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

    await this.save();
    return { success: true, booked: seatIds };
  }

  async cancelBooking(seatIds) {
    this.availableSeats.forEach(seat => {
      if (seatIds.includes(seat.seatNumber)) {
        seat.isBooked = false;
      }
    });

    await this.save();
    return { success: true, cancelled: seatIds };
  }

  // ---------------------------
  // Update Show Details
  // ---------------------------
  async updateShow(details) {
    Object.keys(details).forEach(key => {
      if (key in this) this[key] = details[key];
      if (key === "pricingRules") {
        this.pricingRules = { ...this.pricingRules, ...details.pricingRules };
      }
    });
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
}

// Attach class
showSchema.loadClass(ShowClass);

// Export model
export default mongoose.model("Show", showSchema);

// Updated Screen.js - Model with support for nulls (aisles/walkways) in seatLayout
import mongoose from "mongoose";

// ---------------------------
// Seat Sub-Schema (unchanged, for actual seats only)
// ---------------------------
const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true, unique: true }, // e.g., "A1" - unique per screen
    type: { type: String, enum: ["Standard", "Premium", "VIP"], default: "Standard" }, // Expanded enum for future-proofing
    price: { type: Number, default: 0 }, // Optional: Base price per type (e.g., 100 for Standard)
  },
  { _id: false } // No separate _id for embedded seats
);

// ---------------------------
// Main Screen Schema - Updated for Mixed (allows null for aisles)
// ---------------------------
const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    seatLayout: { 
      type: [[mongoose.Schema.Types.Mixed]], // Mixed to allow seat objects or null (aisles)
      required: true, 
      validate: {
        validator: function(v) {
          const flatSeats = v.flat().filter(seat => seat !== null); // Ignore nulls for validation
          return flatSeats.length > 0 && flatSeats.every(seat => seat.seatNumber && seat.type);
        },
        message: 'Seat layout must contain at least one valid seat (aisles are allowed as null)'
      }
    }, // 2D array: seats or null
    totalSeats: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

// Cascade delete middleware: Remove screen ref from Theater on delete
screenSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await mongoose.model('Theater').findByIdAndUpdate(this.theaterId, { $pull: { screens: this._id } });
    next();
  } catch (err) {
    next(err);
  }
});

// ---------------------------
// Class Methods - Updated to filter nulls
// ---------------------------
class ScreenClass {
  constructor(name, theaterId, seatLayout) {
    this.name = name;
    this.theaterId = theaterId;
    this.seatLayout = seatLayout;
    this.totalSeats = this.calculateTotalSeats();
  }

  // Count total seats (exclude nulls/aisles)
  calculateTotalSeats() {
    return this.seatLayout.flat().filter(seat => seat !== null).length;
  }

  // Return the seat layout (includes nulls for aisles)
  getSeatLayout() {
    return this.seatLayout;
  }

  // Update the seat layout
  async updateSeatLayout(newLayout) {
    this.seatLayout = newLayout;
    this.totalSeats = this.calculateTotalSeats();
    await this.save();
    return this;
  }

  // Get seats by type (exclude nulls)
  getSeatsByType(type) {
    return this.seatLayout.flat().filter((seat) => seat !== null && seat.type === type);
  }

  // Get only Standard seats (legacy, use getSeatsByType for generality)
  getStandardSeats() {
    return this.getSeatsByType("Standard");
  }

  // Get only Premium seats (legacy)
  getPremiumSeats() {
    return this.getSeatsByType("Premium");
  }

  // Reset seat layout
  async resetSeatLayout(defaultLayout) {
    this.seatLayout = defaultLayout;
    this.totalSeats = this.calculateTotalSeats();
    await this.save();
    return this;
  }

  // Get capacity breakdown by type (for reports, exclude nulls)
  getCapacityBreakdown() {
    const breakdown = {};
    const validSeats = this.seatLayout.flat().filter(s => s !== null);
    const types = [...new Set(validSeats.map(s => s.type))];
    types.forEach(type => {
      breakdown[type] = this.getSeatsByType(type).length;
    });
    return breakdown; // e.g., { Standard: 100, Premium: 50 }
  }
}

// Attach class
screenSchema.loadClass(ScreenClass);

// Export model
export default mongoose.model("Screen", screenSchema);
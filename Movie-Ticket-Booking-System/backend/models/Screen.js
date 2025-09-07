import mongoose from "mongoose";

// ---------------------------
// Schema
// ---------------------------
const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true }, // e.g., "A1"
    type: { type: String, enum: ["Standard", "Premium"], default: "Standard" }
  },
  { _id: false } // don't need separate _id for each seat
);

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    seatLayout: { type: [[seatSchema]], required: true }, // 2D array of seat objects
    totalSeats: { type: Number, required: true }
  },
  { timestamps: true }
);

// ---------------------------
// Class
// ---------------------------
class ScreenClass {
  constructor(name, theaterId, seatLayout) {
    this.name = name;
    this.theaterId = theaterId;
    this.seatLayout = seatLayout;
    this.totalSeats = this.calculateTotalSeats();
  }

  // Count total seats
  calculateTotalSeats() {
    return this.seatLayout.flat().length;
  }

  // Return the seat layout
  getSeatLayout() {
    return this.seatLayout;
  }

  // Update the seat layout
  updateSeatLayout(newLayout) {
    this.seatLayout = newLayout;
    this.totalSeats = this.calculateTotalSeats();
    return this.save();
  }

  // Get only Standard seats
  getStandardSeats() {
    return this.seatLayout.flat().filter((seat) => seat.type === "Standard");
  }

  // Get only Premium seats
  getPremiumSeats() {
    return this.seatLayout.flat().filter((seat) => seat.type === "Premium");
  }

  // Reset seat layout
  resetSeatLayout(defaultLayout) {
    this.seatLayout = defaultLayout;
    this.totalSeats = this.calculateTotalSeats();
    return this.save();
  }
}

// Attach class
screenSchema.loadClass(ScreenClass);

// Export model
export default mongoose.model("Screen", screenSchema);

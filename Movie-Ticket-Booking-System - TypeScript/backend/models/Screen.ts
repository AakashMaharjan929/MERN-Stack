import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Standard", "Premium", "VIP"], default: "Standard" },
    price: { type: Number, default: 0 },
  },
  { _id: false }
);

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    seatLayout: {
      type: [[mongoose.Schema.Types.Mixed]],
      required: true,
      validate: {
        validator: function (v: any[]) {
          const flatSeats = v.flat().filter(seat => seat !== null);
          return flatSeats.length > 0 && flatSeats.every((seat: any) => seat.seatNumber && seat.type);
        },
        message: 'Seat layout must contain at least one valid seat (aisles are allowed as null)'
      }
    },
    totalSeats: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

screenSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await mongoose.model('Theater').findByIdAndUpdate((this as any).theaterId, { $pull: { screens: (this as any)._id } });
    next();
  } catch (err) {
    next(err as any);
  }
});

class ScreenClass {
  name!: string;
  theaterId!: mongoose.Schema.Types.ObjectId;
  seatLayout!: any[][];
  totalSeats!: number;

  calculateTotalSeats() {
    return this.seatLayout.flat().filter((seat: any) => seat !== null).length;
  }

  getSeatLayout() {
    return this.seatLayout;
  }

  async updateSeatLayout(newLayout: any[][]) {
    this.seatLayout = newLayout;
    this.totalSeats = this.calculateTotalSeats();
    await (this as unknown as mongoose.Document).save();
    return this;
  }

  getSeatsByType(type: string) {
    return this.seatLayout.flat().filter((seat: any) => seat !== null && seat.type === type);
  }

  getStandardSeats() {
    return this.getSeatsByType("Standard");
  }

  getPremiumSeats() {
    return this.getSeatsByType("Premium");
  }

  async resetSeatLayout(defaultLayout: any[][]) {
    this.seatLayout = defaultLayout;
    this.totalSeats = this.calculateTotalSeats();
    await (this as unknown as mongoose.Document).save();
    return this;
  }

  getCapacityBreakdown() {
    const breakdown: Record<string, number> = {};
    const validSeats = this.seatLayout.flat().filter((s: any) => s !== null);
    const types = [...new Set(validSeats.map((s: any) => s.type))];
    types.forEach(type => {
      breakdown[type] = this.getSeatsByType(type).length;
    });
    return breakdown;
  }
}

screenSchema.loadClass(ScreenClass);

export type IScreenDocument = mongoose.HydratedDocument<ScreenClass>;
export default mongoose.model("Screen", screenSchema);

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
  // Properties
  name!: string;
  theaterId!: mongoose.Schema.Types.ObjectId;
  seatLayout!: any[][];
  totalSeats!: number;
  createdAt!: Date;
  updatedAt!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validate screen data
   */
  isValid(): boolean {
    return this.name && this.theaterId && this.seatLayout && this.seatLayout.length > 0 && this.totalSeats > 0;
  }

  /**
   * Validate seat layout
   */
  private isValidSeatLayout(layout: any[][]): boolean {
    const flatSeats = layout.flat().filter(seat => seat !== null);
    return flatSeats.length > 0 && flatSeats.every((seat: any) => seat.seatNumber && seat.type);
  }

  // ==================== SEAT CALCULATIONS ====================
  /**
   * Calculate total seats from layout
   */
  calculateTotalSeats(): number {
    return this.seatLayout.flat().filter((seat: any) => seat !== null).length;
  }

  /**
   * Get total seats
   */
  getTotalSeats(): number {
    return this.totalSeats;
  }

  /**
   * Get available seats count (approximation - from layout structure)
   */
  getAvailableSeatsCount(): number {
    return this.calculateTotalSeats();
  }

  /**
   * Get occupied seats count (to be implemented with Show model)
   */
  getOccupiedSeatsCount(): number {
    // TODO: Count from bookings
    return 0;
  }

  /**
   * Get occupancy percentage
   */
  getOccupancyPercentage(): number {
    return Math.round((this.getOccupiedSeatsCount() / this.totalSeats) * 100);
  }

  // ==================== SEAT LAYOUT MANAGEMENT ====================
  /**
   * Get seat layout
   */
  getSeatLayout(): any[][] {
    return this.seatLayout;
  }

  /**
   * Update seat layout
   */
  async updateSeatLayout(newLayout: any[][]): Promise<ScreenClass> {
    try {
      if (!this.isValidSeatLayout(newLayout)) {
        throw new Error("Invalid seat layout");
      }
      this.seatLayout = newLayout;
      this.totalSeats = this.calculateTotalSeats();
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to update seat layout: ${(error as Error).message}`);
    }
  }

  /**
   * Reset seat layout to default
   */
  async resetSeatLayout(defaultLayout: any[][]): Promise<ScreenClass> {
    try {
      if (!this.isValidSeatLayout(defaultLayout)) {
        throw new Error("Invalid default layout");
      }
      this.seatLayout = defaultLayout;
      this.totalSeats = this.calculateTotalSeats();
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to reset seat layout: ${(error as Error).message}`);
    }
  }

  // ==================== SEAT TYPE MANAGEMENT ====================
  /**
   * Get seats by type
   */
  getSeatsByType(type: string): any[] {
    return this.seatLayout.flat().filter((seat: any) => seat !== null && seat.type === type);
  }

  /**
   * Get standard seats
   */
  getStandardSeats(): any[] {
    return this.getSeatsByType("Standard");
  }

  /**
   * Get premium seats
   */
  getPremiumSeats(): any[] {
    return this.getSeatsByType("Premium");
  }

  /**
   * Get VIP seats
   */
  getVIPSeats(): any[] {
    return this.getSeatsByType("VIP");
  }

  /**
   * Get seat count by type
   */
  getSeatCountByType(type: string): number {
    return this.getSeatsByType(type).length;
  }

  /**
   * Get capacity breakdown
   */
  getCapacityBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    const validSeats = this.seatLayout.flat().filter((s: any) => s !== null);
    const types = [...new Set(validSeats.map((s: any) => s.type))];
    types.forEach(type => {
      breakdown[type as string] = this.getSeatCountByType(type as string);
    });
    return breakdown;
  }

  /**
   * Get capacity summary
   */
  getCapacitySummary(): Record<string, any> {
    return {
      totalSeats: this.totalSeats,
      standard: this.getSeatCountByType("Standard"),
      premium: this.getSeatCountByType("Premium"),
      vip: this.getSeatCountByType("VIP"),
      breakdown: this.getCapacityBreakdown(),
    };
  }

  /**
   * Get seat info
   */
  getSeatInfo(seatNumber: string): any | null {
    const seat = this.seatLayout.flat().find((s: any) => s && s.seatNumber === seatNumber);
    return seat || null;
  }

  // ==================== SCREEN INFORMATION ====================
  /**
   * Get screen info
   */
  getScreenInfo(): Record<string, any> {
    return {
      id: (this as any)._id,
      name: this.name,
      theaterId: this.theaterId,
      totalSeats: this.totalSeats,
      occupancy: this.getOccupancyPercentage(),
      capacity: this.getCapacitySummary(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Get basic info
   */
  getBasicInfo(): Record<string, any> {
    return {
      id: (this as any)._id,
      name: this.name,
      totalSeats: this.totalSeats,
    };
  }

  // ==================== SCREEN MANAGEMENT ====================
  /**
   * Update screen name
   */
  async updateName(newName: string): Promise<any> {
    try {
      if (!newName || newName.trim().length === 0) {
        throw new Error("Screen name cannot be empty");
      }
      this.name = newName;
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to update screen name: ${(error as Error).message}`);
    }
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create new screen
   */
  static async createScreen(data: {
    name: string;
    theaterId: string;
    seatLayout: any[][];
  }): Promise<ScreenClass> {
    try {
      const screen = new (this as any)(data);
      if (!screen.isValid()) {
        throw new Error("Invalid screen data");
      }
      screen.totalSeats = screen.calculateTotalSeats();
      await screen.save();
      return screen;
    } catch (error) {
      throw new Error(`Failed to create screen: ${(error as Error).message}`);
    }
  }

  // ==================== QUERY METHODS ====================
  /**
   * Get screens by theater
   */
  static async getScreensByTheater(theaterId: string): Promise<ScreenClass[]> {
    return await (this as any).find({ theaterId }).sort({ createdAt: -1 });
  }

  /**
   * Get screen by name and theater
   */
  static async getScreenByName(theaterId: string, name: string): Promise<ScreenClass | null> {
    return await (this as any).findOne({ theaterId, name });
  }
}

screenSchema.loadClass(ScreenClass);

export type IScreenDocument = mongoose.HydratedDocument<ScreenClass>;
export default mongoose.model("Screen", screenSchema);

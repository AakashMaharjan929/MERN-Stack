import mongoose from "mongoose";
import Show from "./Show.js";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showId: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seatIds: [{ type: String, required: true }],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    },
    bookingDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

bookingSchema.index({ showId: 1, status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ userId: 1, status: 1 });

class BookingClass {
  // Properties
  userId!: mongoose.Schema.Types.ObjectId;
  showId!: mongoose.Schema.Types.ObjectId;
  seatIds!: string[];
  totalPrice!: number;
  status!: "Pending" | "Confirmed" | "Cancelled";
  bookingDate!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validates if booking is in a valid state
   */
  isValid(): boolean {
    return (
      this.userId &&
      this.showId &&
      this.seatIds && this.seatIds.length > 0 &&
      this.totalPrice >= 0 &&
      ["Pending", "Confirmed", "Cancelled"].includes(this.status)
    );
  }

  /**
   * Checks if booking can be cancelled
   */
  canBeCancelled(): boolean {
    return this.status === "Pending" || this.status === "Confirmed";
  }

  /**
   * Checks if booking can be confirmed
   */
  canBeConfirmed(): boolean {
    return this.status === "Pending";
  }

  /**
   * Validates seat count is reasonable
   */
  private validateSeatCount(): void {
    if (!this.seatIds || this.seatIds.length === 0) {
      throw new Error("Booking must have at least one seat");
    }
    if (this.seatIds.length > 20) {
      throw new Error("Cannot book more than 20 seats per transaction");
    }
  }

  /**
   * Validates total price is positive
   */
  private validatePrice(): void {
    if (this.totalPrice < 0) {
      throw new Error("Total price cannot be negative");
    }
  }

  // ==================== PRICING METHODS ====================
  /**
   * Calculate total price based on seats and show pricing
   */
  async calculateTotalPrice(): Promise<number> {
    try {
      const show = await Show.findById(this.showId);
      if (!show) throw new Error("Show not found");

      this.validateSeatCount();

      let total = 0;
      this.seatIds.forEach((seatId: string) => {
        const seat = show.availableSeats.find((s: any) => s && s.seatNumber === seatId);
        if (!seat) throw new Error(`Seat ${seatId} not found`);
        total += show.calculatePrice(seat.seatType);
      });

      this.totalPrice = total;
      this.validatePrice();
      return this.totalPrice;
    } catch (error) {
      throw new Error(`Price calculation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get discounted price for a booking
   */
  getDiscountedPrice(discountPercentage: number): number {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Discount percentage must be between 0 and 100");
    }
    return Math.round(this.totalPrice * (1 - discountPercentage / 100));
  }

  /**
   * Get refund amount based on cancellation policy
   */
  getRefundAmount(): number {
    const hoursSinceBooking = (Date.now() - this.bookingDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceBooking < 2) return this.totalPrice; // Full refund
    if (hoursSinceBooking < 24) return Math.round(this.totalPrice * 0.75); // 75% refund
    return Math.round(this.totalPrice * 0.5); // 50% refund
  }

  // ==================== SEAT MANAGEMENT ====================
  /**
   * Check if all booked seats are available
   */
  async checkSeatAvailability(): Promise<{ allAvailable: boolean; unavailable: string[] }> {
    try {
      const show = await Show.findById(this.showId);
      if (!show) throw new Error("Show not found");

      const unavailable = this.seatIds.filter(id => !show.isSeatAvailable(id));
      return { allAvailable: unavailable.length === 0, unavailable };
    } catch (error) {
      throw new Error(`Seat availability check failed: ${(error as Error).message}`);
    }
  }

  /**
   * Update seats in the booking
   */
  async updateSeats(newSeatIds: string[]): Promise<BookingClass> {
    try {
      if (this.status !== "Pending") {
        throw new Error("Can only update seats for pending bookings");
      }

      const show = await Show.findById(this.showId);
      if (!show) throw new Error("Show not found");

      // Release old seats
      await show.cancelBooking(this.seatIds);
      
      // Book new seats
      await show.bookSeats(newSeatIds);

      // Update booking
      this.seatIds = newSeatIds;
      await this.calculateTotalPrice();
      await (this as unknown as mongoose.Document).save();

      return this;
    } catch (error) {
      throw new Error(`Failed to update seats: ${(error as Error).message}`);
    }
  }

  /**
   * Get total seat count
   */
  getTotalSeats(): number {
    return this.seatIds.length;
  }

  /**
   * Check if specific seat is booked
   */
  hasSeat(seatNumber: string): boolean {
    return this.seatIds.includes(seatNumber);
  }

  // ==================== BOOKING STATE MANAGEMENT ====================
  /**
   * Confirm the booking
   */
  async confirmBooking(): Promise<BookingClass> {
    try {
      if (!this.canBeConfirmed()) {
        throw new Error(`Cannot confirm booking with status: ${this.status}`);
      }

      const show = await Show.findById(this.showId);
      if (!show) throw new Error("Show not found");

      await show.bookSeats(this.seatIds);
      this.status = "Confirmed";
      await (this as unknown as mongoose.Document).save();

      await this.sendNotification("Booking Confirmed", "BookingConfirmed");
      return this;
    } catch (error) {
      throw new Error(`Failed to confirm booking: ${(error as Error).message}`);
    }
  }

  /**
   * Cancel the booking
   */
  async cancelBooking(): Promise<BookingClass> {
    try {
      if (!this.canBeCancelled()) {
        throw new Error(`Cannot cancel booking with status: ${this.status}`);
      }

      const show = await Show.findById(this.showId);
      if (!show) throw new Error("Show not found");

      await show.cancelBooking(this.seatIds);
      this.status = "Cancelled";
      await (this as unknown as mongoose.Document).save();

      await this.sendNotification("Booking Cancelled", "BookingCancelled");
      return this;
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${(error as Error).message}`);
    }
  }

  /**
   * Get booking status
   */
  getStatus(): string {
    return this.status;
  }

  /**
   * Check if booking is confirmed
   */
  isConfirmed(): boolean {
    return this.status === "Confirmed";
  }

  /**
   * Check if booking is cancelled
   */
  isCancelled(): boolean {
    return this.status === "Cancelled";
  }

  /**
   * Check if booking is pending
   */
  isPending(): boolean {
    return this.status === "Pending";
  }

  // ==================== DISCOUNT & OFFERS ====================
  /**
   * Apply discount code to booking
   */
  async applyDiscount(code: string): Promise<number> {
    try {
      const discountMap: Record<string, number> = {
        "DISCOUNT10": 10,
        "DISCOUNT20": 20,
        "EARLY_BIRD": 15,
        "STUDENT": 25,
        "SENIOR": 20
      };

      const discount = discountMap[code.toUpperCase()];
      if (!discount) {
        throw new Error(`Invalid discount code: ${code}`);
      }

      this.totalPrice = this.getDiscountedPrice(discount);
      await (this as unknown as mongoose.Document).save();
      return this.totalPrice;
    } catch (error) {
      throw new Error(`Failed to apply discount: ${(error as Error).message}`);
    }
  }

  /**
   * Check if discount code is valid
   */
  isValidDiscountCode(code: string): boolean {
    const validCodes = ["DISCOUNT10", "DISCOUNT20", "EARLY_BIRD", "STUDENT", "SENIOR"];
    return validCodes.includes(code.toUpperCase());
  }

  // ==================== NOTIFICATIONS ====================
  /**
   * Send notification to user
   */
  private async sendNotification(message: string, type: string): Promise<void> {
    try {
      const Notification = mongoose.model("Notification");
      await new Notification({
        userId: this.userId,
        bookingId: (this as any)._id,
        type,
        message,
      }).save();
    } catch (error) {
      console.error(`Failed to send notification: ${(error as Error).message}`);
    }
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create a new booking
   */
  static async createBooking(data: {
    userId: string;
    showId: string;
    seatIds: string[];
  }): Promise<BookingClass> {
    try {
      const booking = new (this as any)(data);
      if (!booking.isValid()) {
        throw new Error("Invalid booking data");
      }
      await booking.calculateTotalPrice();
      await booking.save();
      return booking;
    } catch (error) {
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  // ==================== QUERY METHODS ====================
  /**
   * Get user's booking history
   */
  static async getUserBookings(userId: string, limit = 10): Promise<BookingClass[]> {
    return await (this as any).find({ userId }).sort({ bookingDate: -1 }).limit(limit);
  }

  /**
   * Get confirmed bookings for a show
   */
  static async getConfirmedBookingsForShow(showId: string): Promise<BookingClass[]> {
    return await (this as any).find({ showId, status: "Confirmed" });
  }

  /**
   * Get pending bookings older than specified hours
   */
  static async getExpiredPendingBookings(hoursOld: number): Promise<BookingClass[]> {
    const expiryTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
    return await (this as any).find({ status: "Pending", bookingDate: { $lt: expiryTime } });
  }

  // ==================== UTILITY METHODS ====================
  /**
   * Get booking summary
   */
  getSummary(): Record<string, any> {
    return {
      id: (this as any)._id,
      userId: this.userId,
      showId: this.showId,
      seatIds: this.seatIds,
      totalSeats: this.getTotalSeats(),
      totalPrice: this.totalPrice,
      status: this.status,
      bookingDate: this.bookingDate,
      refundAmount: this.getRefundAmount(),
    };
  }
}

bookingSchema.loadClass(BookingClass);
export type IBookingDocument = mongoose.HydratedDocument<BookingClass>;
export type IBookingModel = mongoose.Model<BookingClass> & typeof BookingClass;

const Booking = mongoose.model<BookingClass, IBookingModel>("Booking", bookingSchema);

export default Booking;

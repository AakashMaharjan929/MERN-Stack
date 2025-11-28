// models/Booking.js - Updated with indexes for performance
import mongoose from "mongoose";
import Show from "./Show.js"; // we’ll need this for seat & price checks

// ---------------------------
// Schema
// ---------------------------
const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showId: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seatIds: [{ type: String, required: true }], // e.g. ["A1","A2"]
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

// Indexes for performance on high-traffic queries
bookingSchema.index({ showId: 1, status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ userId: 1, status: 1 });

// ---------------------------
// Class
// ---------------------------
class BookingClass {

  constructor(userId, showId, seatIds, totalPrice = 0, status = "Pending", bookingDate = new Date()) {
    this.userId = userId;
    this.showId = showId;
    this.seatIds = seatIds;
    this.totalPrice = totalPrice;
    this.status = status;
    this.bookingDate = bookingDate;
  }
  /**
   * Calculate total price based on Show pricing rules and seat types
   */
  async calculateTotalPrice() {
    const show = await Show.findById(this.showId);
    if (!show) throw new Error("Show not found");

    let total = 0;
    this.seatIds.forEach((seatId) => {
      const seat = show.availableSeats.find((s) => s.seatNumber === seatId);
      if (!seat) throw new Error(`Seat ${seatId} not found`);
      total += show.calculatePrice(seat.seatType);
    });

    this.totalPrice = total;
    return this.totalPrice;
  }

  /**
   * Confirm booking -> mark seats as booked in Show and set status
   */
  async confirmBooking() {
    const show = await Show.findById(this.showId);
    if (!show) throw new Error("Show not found");

    await show.bookSeats(this.seatIds);
    this.status = "Confirmed";
    await this.save();

    await this.sendNotification("Booking Confirmed");
    return this;
  }

  /**
   * Cancel booking -> free seats in Show
   */
  async cancelBooking() {
    const show = await Show.findById(this.showId);
    if (!show) throw new Error("Show not found");

    await show.cancelBooking(this.seatIds);
    this.status = "Cancelled";
    await this.save();

    await this.sendNotification("Booking Cancelled");
    return this;
  }

  /**
   * Check if seats are available
   */
  async checkSeatAvailability() {
    const show = await Show.findById(this.showId);
    if (!show) throw new Error("Show not found");

    const unavailable = this.seatIds.filter(id => !show.isSeatAvailable(id));
    return { allAvailable: unavailable.length === 0, unavailable };
  }

  /**
   * Update seats in a booking (recalculate price, adjust show seats)
   */
  async updateSeats(newSeatIds) {
    const show = await Show.findById(this.showId);
    if (!show) throw new Error("Show not found");

    // free old seats
    await show.cancelBooking(this.seatIds);
    // try booking new seats
    await show.bookSeats(newSeatIds);

    this.seatIds = newSeatIds;
    await this.calculateTotalPrice();
    await this.save();

    return this;
  }

  /**
   * Send notification (stub, you can integrate email/SMS later)
   */
  async sendNotification(message) {
    console.log(`Notification to user ${this.userId}: ${message}`);
    // Later: Save in Notification model or send email/SMS
  }

  /**
   * Apply discount (e.g. promo code)
   */
  async applyDiscount(code) {
    let discount = 0;
    if (code === "DISCOUNT10") discount = 0.1; // 10%
    else if (code === "DISCOUNT20") discount = 0.2; // 20%

    this.totalPrice = this.totalPrice - this.totalPrice * discount;
    this.totalPrice = Math.round(this.totalPrice); // round final price
    await this.save();
    return this.totalPrice;
  }
}

// Attach class
bookingSchema.loadClass(BookingClass);

// Export model
export default mongoose.model("Booking", bookingSchema);
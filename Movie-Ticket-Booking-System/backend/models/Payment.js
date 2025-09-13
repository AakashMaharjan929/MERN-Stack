import mongoose from "mongoose";
import Booking from "./Booking.js";

// ---------------------------
// Schema
// ---------------------------
const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    method: { 
      type: String, 
      enum: ["Card", "UPI", "NetBanking", "Wallet", "Cash"], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "Completed", "Failed", "Refunded"], 
      default: "Pending" 
    },
    transactionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// ---------------------------
// Class
// ---------------------------
class PaymentClass {
  constructor(bookingId, amount, method) {
    this.bookingId = bookingId;
    this.amount = amount;
    this.method = method;
    this.status = "Pending";
  }

  /**
   * Process payment (simulate gateway integration)
   */
  async processPayment() {
    console.log(`Processing ${this.method} payment of ₹${this.amount} for booking ${this.bookingId}`);

    try {
      // simulate success (later integrate Stripe, PayPal, Razorpay etc.)
      this.status = "Completed";
      await this.save();

      const booking = await Booking.findById(this.bookingId);
      if (booking) {
        booking.status = "Confirmed";
        await booking.save();
      }
      return this;
    } catch (err) {
      this.status = "Failed";
      await this.save();
      throw new Error("Payment failed: " + err.message);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment() {
    if (this.status !== "Completed") {
      throw new Error("Only completed payments can be refunded");
    }

    this.status = "Refunded";
    await this.save();

    const booking = await Booking.findById(this.bookingId);
    if (booking) {
      booking.status = "Cancelled";
      await booking.save();
    }

    console.log(`Refund of ₹${this.amount} processed for booking ${this.bookingId}`);
    return this;
  }

  /**
   * Get Payment Status
   */
  async getStatus() {
    return { id: this._id, status: this.status, amount: this.amount, method: this.method };
  }

  /**
   * Retry a failed payment
   */
  async retryPayment() {
    if (this.status !== "Failed") {
      throw new Error("Only failed payments can be retried");
    }
    return this.processPayment();
  }

  /**
   * Link payment with booking details
   */
  async getBookingDetails() {
    return await Booking.findById(this.bookingId).populate("showId userId");
  }
}

// Attach class
paymentSchema.loadClass(PaymentClass);

// Export model
export default mongoose.model("Payment", paymentSchema);

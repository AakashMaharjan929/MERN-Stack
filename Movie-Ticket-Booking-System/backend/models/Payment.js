// Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shows",
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Users", 
    required: false  // Optional if guest checkout allowed
  },

  // Denormalized for quick receipt/display without joins
  movieTitle: { type: String, required: true },
  cinemaName: { type: String, required: true },
  showDate: { type: Date, required: true },
  showTime: { type: String, required: true },
  seats: [{ type: String, required: true }],

  // Payment amount
  amount: { type: Number, required: true, min: 0 }, // in NPR
  currency: { type: String, default: "NPR", uppercase: true, trim: true },

  // Gateway info
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ["esewa", "khalti", "stripe", "fonepay", "imepay", "cash"], // add more as needed
  },
  gatewayTransactionId: { type: String }, // e.g., Stripe payment_intent, eSewa refId
  gatewayStatus: { 
    type: String, 
    enum: ["succeeded", "pending", "failed", "requires_action", "canceled"],
    default: "pending"
  },

  // Internal status
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },

  // eSewa/Khalti specific fields
  transactionUUID: { type: String, unique: true, sparse: true }, // Your internal UUID
  pid: { type: String }, // Product ID sent to gateway

  // Timestamps
  paidAt: { type: Date }, // Set when status becomes "completed"
  failureReason: { type: String },

}, { timestamps: true });

// Indexes for performance
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionUUID: 1 });
paymentSchema.index({ gatewayTransactionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ paidAt: -1 });

class PaymentClass {
  // Mark payment as successful
  async markAsCompleted({ gatewayTransactionId, gatewayStatus, paidAt = new Date() }) {
    this.gatewayTransactionId = gatewayTransactionId || this.gatewayTransactionId;
    this.gatewayStatus = gatewayStatus || "succeeded";
    this.status = "completed";
    this.paidAt = paidAt;

    return await this.save();
  }

  // Mark payment as failed
  async markAsFailed({ failureReason, gatewayStatus = "failed" }) {
    this.gatewayStatus = gatewayStatus;
    this.status = "failed";
    this.failureReason = failureReason;

    return await this.save();
  }

  // Refund (simple status update - actual refund logic should be in service)
  async markAsRefunded() {
    this.status = "refunded";
    return await this.save();
  }

  // Static: Create a new payment record (before redirecting to gateway)
  static async createPendingPayment({
    bookingId,
    showId,
    userId,
    movieTitle,
    cinemaName,
    showDate,
    showTime,
    seats,
    amount,
    paymentMethod,
    transactionUUID,
    pid,
  }) {
    const payment = new this({
      bookingId,
      showId,
      userId,
      movieTitle,
      cinemaName,
      showDate,
      showTime,
      seats,
      amount,
      paymentMethod,
      transactionUUID,
      pid,
      status: "pending",
      gatewayStatus: "pending",
    });

    return await payment.save();
  }

  // Find by internal transaction UUID (useful for eSewa/Khalti callback)
  static async findByTransactionUUID(uuid) {
    return await this.findOne({ transactionUUID: uuid });
  }

  // Find user's payment history
  static async getUserPayments(userId, { limit = 10, skip = 0, status } = {}) {
    const query = { userId };
    if (status) query.status = status;

    return await this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  // Get payment receipt info
  getReceiptInfo() {
    return {
      id: this._id,
      bookingId: this.bookingId,
      movieTitle: this.movieTitle,
      cinemaName: this.cinemaName,
      showDate: this.showDate,
      showTime: this.showTime,
      seats: this.seats,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      status: this.status,
      paidAt: this.paidAt,
      transactionUUID: this.transactionUUID,
      gatewayTransactionId: this.gatewayTransactionId,
    };
  }
}

// Load class methods
paymentSchema.loadClass(PaymentClass);

// Export model
export default mongoose.model("Payment", paymentSchema);
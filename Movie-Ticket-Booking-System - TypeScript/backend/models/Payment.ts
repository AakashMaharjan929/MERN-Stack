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
    required: false
  },
  movieTitle: { type: String, required: true },
  cinemaName: { type: String, required: true },
  showDate: { type: Date, required: true },
  showTime: { type: String, required: true },
  seats: [{ type: String, required: true }],
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "रु.", uppercase: true, trim: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["esewa", "khalti", "stripe", "fonepay", "imepay", "cash"],
  },
  gatewayTransactionId: { type: String },
  gatewayStatus: {
    type: String,
    enum: ["succeeded", "pending", "failed", "requires_action", "canceled"],
    default: "pending"
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  transactionUUID: { type: String, unique: true, sparse: true },
  pid: { type: String },
  paidAt: { type: Date },
  failureReason: { type: String },
}, { timestamps: true });

paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionUUID: 1 });
paymentSchema.index({ gatewayTransactionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ paidAt: -1 });

class PaymentClass {
  bookingId!: mongoose.Schema.Types.ObjectId;
  showId!: mongoose.Schema.Types.ObjectId;
  userId?: mongoose.Schema.Types.ObjectId;
  seats!: string[];
  amount!: number;
  currency!: string;
  paymentMethod!: string;
  gatewayTransactionId?: string;
  gatewayStatus!: string;
  status!: string;
  transactionUUID?: string;
  pid?: string;
  paidAt?: Date;
  failureReason?: string;
  movieTitle!: string;
  cinemaName!: string;
  showDate!: Date;
  showTime!: string;

  async markAsCompleted({ gatewayTransactionId, gatewayStatus, paidAt = new Date() }: { gatewayTransactionId?: string; gatewayStatus?: string; paidAt?: Date; }) {
    this.gatewayTransactionId = gatewayTransactionId || this.gatewayTransactionId;
    this.gatewayStatus = gatewayStatus || "succeeded";
    this.status = "completed";
    this.paidAt = paidAt;
    return await (this as unknown as mongoose.Document).save();
  }

  async markAsFailed({ failureReason, gatewayStatus = "failed" }: { failureReason?: string; gatewayStatus?: string; }) {
    this.gatewayStatus = gatewayStatus;
    this.status = "failed";
    this.failureReason = failureReason;
    return await (this as unknown as mongoose.Document).save();
  }

  async markAsRefunded() {
    this.status = "refunded";
    return await (this as unknown as mongoose.Document).save();
  }

  async processPayment() {
    this.status = "completed";
    return await (this as unknown as mongoose.Document).save();
  }

  async refundPayment() {
    this.status = "refunded";
    return await (this as unknown as mongoose.Document).save();
  }

  async retryPayment() {
    this.status = "pending";
    return await (this as unknown as mongoose.Document).save();
  }

  async getStatus() {
    return {
      status: this.status,
      gatewayStatus: this.gatewayStatus,
      paidAt: this.paidAt,
    };
  }

  static async createPendingPayment(data: Record<string, any>) {
    const payment = new (this as any)(data);
    return await payment.save();
  }

  static async findByTransactionUUID(uuid: string) {
    return await (this as any).findOne({ transactionUUID: uuid });
  }

  static async getUserPayments(userId: mongoose.Schema.Types.ObjectId, { limit = 10, skip = 0, status }: { limit?: number; skip?: number; status?: string } = {}) {
    const query: Record<string, any> = { userId };
    if (status) query.status = status;

    return await (this as any).find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  getReceiptInfo() {
    return {
      id: (this as any)._id,
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

paymentSchema.loadClass(PaymentClass);
export type IPaymentDocument = mongoose.HydratedDocument<PaymentClass>;
export type IPaymentModel = mongoose.Model<PaymentClass> & typeof PaymentClass;

const Payment = mongoose.model<PaymentClass, IPaymentModel>("Payment", paymentSchema);

export default Payment;

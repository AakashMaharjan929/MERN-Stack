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
  // Properties
  bookingId!: mongoose.Schema.Types.ObjectId;
  showId!: mongoose.Schema.Types.ObjectId;
  userId?: mongoose.Schema.Types.ObjectId;
  seats!: string[];
  amount!: number;
  currency!: string;
  paymentMethod!: "esewa" | "khalti" | "stripe" | "fonepay" | "imepay" | "cash";
  gatewayTransactionId?: string;
  gatewayStatus!: "succeeded" | "pending" | "failed" | "requires_action" | "canceled";
  status!: "pending" | "completed" | "failed" | "refunded";
  transactionUUID?: string;
  pid?: string;
  paidAt?: Date;
  failureReason?: string;
  movieTitle!: string;
  cinemaName!: string;
  showDate!: Date;
  showTime!: string;
  createdAt!: Date;
  updatedAt!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validate payment data
   */
  isValid(): boolean {
    return !!(this.bookingId && this.showId && this.amount > 0 && 
           this.seats && this.seats.length > 0 && this.paymentMethod);
  }

  /**
   * Validate amount
   */
  private isValidAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Max 1M
  }

  /**
   * Validate payment method
   */
  private isValidPaymentMethod(method: string): boolean {
    const methods = ["esewa", "khalti", "stripe", "fonepay", "imepay", "cash"];
    return methods.includes(method);
  }

  // ==================== PAYMENT STATUS MANAGEMENT ====================
  /**
   * Mark payment as completed
   */
  async markAsCompleted(data?: {
    gatewayTransactionId?: string;
    gatewayStatus?: string;
    paidAt?: Date;
  }): Promise<PaymentClass> {
    try {
      if (!this.isPending()) {
        throw new Error(`Cannot complete payment with status: ${this.status}`);
      }

      this.gatewayTransactionId = data?.gatewayTransactionId || this.gatewayTransactionId;
      this.gatewayStatus = (data?.gatewayStatus as any) || "succeeded";
      this.status = "completed";
      this.paidAt = data?.paidAt || new Date();
      return (await (this as unknown as mongoose.Document).save()) as any;
    } catch (error) {
      throw new Error(`Failed to mark as completed: ${(error as Error).message}`);
    }
  }

  /**
   * Mark payment as failed
   */
  async markAsFailed(data?: {
    failureReason?: string;
    gatewayStatus?: string;
  }): Promise<PaymentClass> {
    try {
      this.gatewayStatus = (data?.gatewayStatus as any) || "failed";
      this.status = "failed";
      this.failureReason = data?.failureReason;
      return (await (this as unknown as mongoose.Document).save()) as any;
    } catch (error) {
      throw new Error(`Failed to mark as failed: ${(error as Error).message}`);
    }
  }

  /**
   * Mark payment as refunded
   */
  async markAsRefunded(): Promise<PaymentClass> {
    try {
      if (this.status === "refunded") {
        throw new Error("Payment is already refunded");
      }
      this.status = "refunded";
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to mark as refunded: ${(error as Error).message}`);
    }
  }

  /**
   * Process payment (complete)
   */
  async processPayment(): Promise<PaymentClass> {
    try {
      return await this.markAsCompleted({ paidAt: new Date() });
    } catch (error) {
      throw new Error(`Failed to process payment: ${(error as Error).message}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(): Promise<PaymentClass> {
    try {
      if (!this.isCompleted()) {
        throw new Error("Only completed payments can be refunded");
      }
      return await this.markAsRefunded();
    } catch (error) {
      throw new Error(`Failed to refund payment: ${(error as Error).message}`);
    }
  }

  /**
   * Retry payment
   */
  async retryPayment(): Promise<PaymentClass> {
    try {
      if (!this.isFailed()) {
        throw new Error("Only failed payments can be retried");
      }
      this.status = "pending";
      this.failureReason = undefined;
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to retry payment: ${(error as Error).message}`);
    }
  }

  // ==================== STATUS CHECKS ====================
  /**
   * Check if payment is pending
   */
  isPending(): boolean {
    return this.status === "pending";
  }

  /**
   * Check if payment is completed
   */
  isCompleted(): boolean {
    return this.status === "completed";
  }

  /**
   * Check if payment is failed
   */
  isFailed(): boolean {
    return this.status === "failed";
  }

  /**
   * Check if payment is refunded
   */
  isRefunded(): boolean {
    return this.status === "refunded";
  }

  /**
   * Get payment status
   */
  getStatus(): "pending" | "completed" | "failed" | "refunded" {
    return this.status;
  }

  /**
   * Get gateway status
   */
  getGatewayStatus(): string {
    return this.gatewayStatus;
  }

  // ==================== PAYMENT INFORMATION ====================
  /**
   * Get payment summary
   */
  getSummary(): Record<string, any> {
    return {
      id: (this as any)._id,
      bookingId: this.bookingId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      status: this.status,
      gatewayStatus: this.gatewayStatus,
      paidAt: this.paidAt,
      transactionUUID: this.transactionUUID,
    };
  }

  /**
   * Get receipt information
   */
  getReceiptInfo(): Record<string, any> {
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

  /**
   * Get full payment details
   */
  getFullDetails(): Record<string, any> {
    return {
      ...this.getReceiptInfo(),
      gatewayStatus: this.gatewayStatus,
      failureReason: this.failureReason,
      pid: this.pid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Get payment amount formatted
   */
  getFormattedAmount(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  /**
   * Check if payment is recent
   */
  isRecent(minutesThreshold = 30): boolean {
    if (!this.paidAt) return false;
    const minutesPassed = (Date.now() - this.paidAt.getTime()) / (1000 * 60);
    return minutesPassed <= minutesThreshold;
  }

  /**
   * Check if payment is old
   */
  isOld(daysThreshold = 90): boolean {
    const daysPassed = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysPassed > daysThreshold;
  }

  // ==================== REFUND CALCULATIONS ====================
  /**
   * Get refund amount based on refund policy
   */
  getRefundAmount(): number {
    if (!this.isCompleted()) return 0;

    const hoursSincePayment = (Date.now() - (this.paidAt?.getTime() || 0)) / (1000 * 60 * 60);

    if (hoursSincePayment < 2) return this.amount; // Full refund
    if (hoursSincePayment < 24) return Math.round(this.amount * 0.75); // 75%
    return Math.round(this.amount * 0.5); // 50%
  }

  /**
   * Get refund status
   */
  getRefundStatus(): Record<string, any> {
    return {
      status: this.status,
      gatewayStatus: this.gatewayStatus,
      originalAmount: this.amount,
      refundableAmount: this.getRefundAmount(),
      isRefundable: this.isCompleted(),
      paidAt: this.paidAt,
    };
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create pending payment
   */
  static async createPendingPayment(data: Record<string, any>): Promise<PaymentClass> {
    try {
      const payment = new (this as any)(data);
      if (!payment.isValid()) {
        throw new Error("Invalid payment data");
      }
      return await payment.save();
    } catch (error) {
      throw new Error(`Failed to create payment: ${(error as Error).message}`);
    }
  }

  // ==================== QUERY METHODS ====================
  /**
   * Find by transaction UUID
   */
  static async findByTransactionUUID(uuid: string): Promise<PaymentClass | null> {
    return await (this as any).findOne({ transactionUUID: uuid });
  }

  /**
   * Find by gateway transaction ID
   */
  static async findByGatewayTransactionId(id: string): Promise<PaymentClass | null> {
    return await (this as any).findOne({ gatewayTransactionId: id });
  }

  /**
   * Get user payments
   */
  static async getUserPayments(
    userId: mongoose.Schema.Types.ObjectId,
    options?: { limit?: number; skip?: number; status?: string }
  ): Promise<PaymentClass[]> {
    const query: Record<string, any> = { userId };
    if (options?.status) query.status = options.status;

    return await (this as any)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 10);
  }

  /**
   * Get completed payments for user
   */
  static async getUserCompletedPayments(userId: mongoose.Schema.Types.ObjectId): Promise<PaymentClass[]> {
    return await (this as any).find({ userId, status: "completed" }).sort({ paidAt: -1 });
  }

  /**
   * Get refunded payments
   */
  static async getRefundedPayments(limit = 50): Promise<PaymentClass[]> {
    return await (this as any).find({ status: "refunded" }).sort({ updatedAt: -1 }).limit(limit);
  }

  /**
   * Get failed payments
   */
  static async getFailedPayments(limit = 50): Promise<PaymentClass[]> {
    return await (this as any).find({ status: "failed" }).sort({ createdAt: -1 }).limit(limit);
  }

  /**
   * Get pending payments (expired)
   */
  static async getExpiredPendingPayments(minutesOld: number): Promise<PaymentClass[]> {
    const expiryTime = new Date(Date.now() - minutesOld * 60 * 1000);
    return await (this as any).find({ status: "pending", createdAt: { $lt: expiryTime } });
  }

  /**
   * Get payments by method
   */
  static async getPaymentsByMethod(method: string): Promise<PaymentClass[]> {
    return await (this as any).find({ paymentMethod: method }).sort({ createdAt: -1 });
  }

  /**
   * Get revenue for date range
   */
  static async getRevenueForDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await (this as any).aggregate([
      {
        $match: {
          status: "completed",
          paidAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    return result[0]?.totalRevenue || 0;
  }
}

paymentSchema.loadClass(PaymentClass);
export type IPaymentDocument = mongoose.HydratedDocument<PaymentClass>;
export type IPaymentModel = mongoose.Model<PaymentClass> & typeof PaymentClass;

const Payment = mongoose.model<PaymentClass, IPaymentModel>("Payment", paymentSchema);

export default Payment;

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
    currency: { type: String, default: "NPR", uppercase: true, trim: true },
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
    async markAsCompleted({ gatewayTransactionId, gatewayStatus, paidAt = new Date() }) {
        this.gatewayTransactionId = gatewayTransactionId || this.gatewayTransactionId;
        this.gatewayStatus = gatewayStatus || "succeeded";
        this.status = "completed";
        this.paidAt = paidAt;
        return await this.save();
    }
    async markAsFailed({ failureReason, gatewayStatus = "failed" }) {
        this.gatewayStatus = gatewayStatus;
        this.status = "failed";
        this.failureReason = failureReason;
        return await this.save();
    }
    async markAsRefunded() {
        this.status = "refunded";
        return await this.save();
    }
    async processPayment() {
        this.status = "completed";
        return await this.save();
    }
    async refundPayment() {
        this.status = "refunded";
        return await this.save();
    }
    async retryPayment() {
        this.status = "pending";
        return await this.save();
    }
    async getStatus() {
        return {
            status: this.status,
            gatewayStatus: this.gatewayStatus,
            paidAt: this.paidAt,
        };
    }
    static async createPendingPayment(data) {
        const payment = new this(data);
        return await payment.save();
    }
    static async findByTransactionUUID(uuid) {
        return await this.findOne({ transactionUUID: uuid });
    }
    static async getUserPayments(userId, { limit = 10, skip = 0, status } = {}) {
        const query = { userId };
        if (status)
            query.status = status;
        return await this.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
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
paymentSchema.loadClass(PaymentClass);
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

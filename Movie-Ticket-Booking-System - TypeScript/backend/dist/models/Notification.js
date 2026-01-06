import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: false },
    type: {
        type: String,
        enum: ["BookingConfirmed", "BookingCancelled", "PaymentSuccess", "PaymentFailed", "Reminder"],
        required: true
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });
class NotificationClass {
    async send() {
        console.log(`Notification sent to user ${this.userId}: ${this.message}`);
        await this.save();
        return this;
    }
    async markAsRead() {
        this.isRead = true;
        await this.save();
        return this;
    }
    static async getUnreadForUser(userId) {
        return this.find({ userId, isRead: false });
    }
}
notificationSchema.loadClass(NotificationClass);
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;

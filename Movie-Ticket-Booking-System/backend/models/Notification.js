import mongoose from "mongoose";

// ---------------------------
// Schema
// ---------------------------
const notificationSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// ---------------------------
// Class
// ---------------------------
class NotificationClass {
  constructor(userId, bookingId, type, message) {
    this.userId = userId;
    this.bookingId = bookingId;
    this.type = type;
    this.message = message;
  }

  // Send notification (stub — later email/SMS/push)
  async send() {
    console.log(`📢 Notification sent to user ${this.userId}: ${this.message}`);
    await this.save();
    return this;
  }

  // Mark as read
  async markAsRead() {
    this.isRead = true;
    await this.save();
    return this;
  }

  // Get all unread notifications for a user
  static async getUnreadForUser(userId) {
    return this.find({ userId, isRead: false });
  }
}

// Attach class
notificationSchema.loadClass(NotificationClass);

// Export model
export default mongoose.model("Notification", notificationSchema);

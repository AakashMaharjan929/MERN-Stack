import mongoose from "mongoose";

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

class NotificationClass {
  userId!: mongoose.Schema.Types.ObjectId;
  bookingId?: mongoose.Schema.Types.ObjectId;
  type!: string;
  message!: string;
  isRead!: boolean;

  async send() {
    console.log(`Notification sent to user ${this.userId}: ${this.message}`);
    await (this as unknown as mongoose.Document).save();
    return this;
  }

  async markAsRead() {
    this.isRead = true;
    await (this as unknown as mongoose.Document).save();
    return this;
  }

  static async getUnreadForUser(userId: mongoose.Schema.Types.ObjectId) {
    return (this as any).find({ userId, isRead: false });
  }
}

notificationSchema.loadClass(NotificationClass);

export type INotificationDocument = mongoose.HydratedDocument<NotificationClass>;
export type INotificationModel = mongoose.Model<NotificationClass> & typeof NotificationClass;

const Notification = mongoose.model<NotificationClass, INotificationModel>("Notification", notificationSchema);

export default Notification;

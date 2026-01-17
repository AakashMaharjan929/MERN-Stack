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
  // Properties
  userId!: mongoose.Schema.Types.ObjectId;
  bookingId?: mongoose.Schema.Types.ObjectId;
  type!: "BookingConfirmed" | "BookingCancelled" | "PaymentSuccess" | "PaymentFailed" | "Reminder";
  message!: string;
  isRead!: boolean;
  sentAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  // ==================== VALIDATION METHODS ====================
  /**
   * Validate notification data
   */
  isValid(): boolean {
    return this.userId && this.type && this.message && 
           ["BookingConfirmed", "BookingCancelled", "PaymentSuccess", "PaymentFailed", "Reminder"].includes(this.type);
  }

  /**
   * Validate notification type
   */
  private isValidType(type: string): boolean {
    const validTypes = ["BookingConfirmed", "BookingCancelled", "PaymentSuccess", "PaymentFailed", "Reminder"];
    return validTypes.includes(type);
  }

  /**
   * Validate message length
   */
  private isValidMessage(message: string): boolean {
    return message && message.length > 0 && message.length <= 500;
  }

  // ==================== NOTIFICATION STATUS ====================
  /**
   * Mark as read
   */
  async markAsRead(): Promise<NotificationClass> {
    try {
      this.isRead = true;
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to mark as read: ${(error as Error).message}`);
    }
  }

  /**
   * Mark as unread
   */
  async markAsUnread(): Promise<NotificationClass> {
    try {
      this.isRead = false;
      return await (this as any).save();
    } catch (error) {
      throw new Error(`Failed to mark as unread: ${(error as Error).message}`);
    }
  }

  /**
   * Check if notification is read
   */
  isNotificationRead(): boolean {
    return this.isRead;
  }

  /**
   * Check if notification is unread
   */
  isNotificationUnread(): boolean {
    return !this.isRead;
  }

  /**
   * Get read status
   */
  getReadStatus(): string {
    return this.isRead ? "read" : "unread";
  }

  // ==================== NOTIFICATION SENDING ====================
  /**
   * Send notification (save to database)
   */
  async send(): Promise<NotificationClass> {
    try {
      if (!this.isValid()) {
        throw new Error("Invalid notification data");
      }
      if (!this.isValidMessage(this.message)) {
        throw new Error("Invalid message length (0-500 characters)");
      }
      if (!this.isValidType(this.type)) {
        throw new Error(`Invalid notification type: ${this.type}`);
      }

      this.sentAt = new Date();
      this.isRead = false;
      await (this as unknown as mongoose.Document).save();

      // TODO: Send via email, SMS, or push notification
      console.log(`Notification sent to user ${this.userId}: ${this.message}`);
      return this;
    } catch (error) {
      throw new Error(`Failed to send notification: ${(error as Error).message}`);
    }
  }

  /**
   * Get notification type label
   */
  getTypeLabel(): string {
    const labels: Record<string, string> = {
      BookingConfirmed: "Booking Confirmed",
      BookingCancelled: "Booking Cancelled",
      PaymentSuccess: "Payment Successful",
      PaymentFailed: "Payment Failed",
      Reminder: "Reminder",
    };
    return labels[this.type] || this.type;
  }

  // ==================== NOTIFICATION INFORMATION ====================
  /**
   * Get notification summary
   */
  getSummary(): Record<string, any> {
    return {
      id: (this as any)._id,
      userId: this.userId,
      type: this.type,
      typeLabel: this.getTypeLabel(),
      message: this.message,
      isRead: this.isRead,
      sentAt: this.sentAt,
      createdAt: this.createdAt,
    };
  }

  /**
   * Get full notification details
   */
  getFullDetails(): Record<string, any> {
    return {
      ...this.getSummary(),
      bookingId: this.bookingId,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Get notification display
   */
  getDisplay(): Record<string, any> {
    return {
      title: this.getTypeLabel(),
      message: this.message,
      type: this.type,
      timestamp: this.sentAt,
      read: this.isRead,
    };
  }

  /**
   * Check if notification is recent
   */
  isRecent(minutesThreshold = 60): boolean {
    const minutesPassed = (Date.now() - this.sentAt.getTime()) / (1000 * 60);
    return minutesPassed <= minutesThreshold;
  }

  /**
   * Get time since sent
   */
  getTimeSinceSent(): string {
    const minutesPassed = (Date.now() - this.sentAt.getTime()) / (1000 * 60);

    if (minutesPassed < 1) return "Just now";
    if (minutesPassed < 60) return `${Math.floor(minutesPassed)}m ago`;

    const hoursPassed = minutesPassed / 60;
    if (hoursPassed < 24) return `${Math.floor(hoursPassed)}h ago`;

    const daysPassed = hoursPassed / 24;
    if (daysPassed < 30) return `${Math.floor(daysPassed)}d ago`;

    const monthsPassed = daysPassed / 30;
    return `${Math.floor(monthsPassed)}mo ago`;
  }

  // ==================== NOTIFICATION TYPES ====================
  /**
   * Is booking confirmation notification
   */
  isBookingConfirmation(): boolean {
    return this.type === "BookingConfirmed";
  }

  /**
   * Is booking cancellation notification
   */
  isBookingCancellation(): boolean {
    return this.type === "BookingCancelled";
  }

  /**
   * Is payment success notification
   */
  isPaymentSuccess(): boolean {
    return this.type === "PaymentSuccess";
  }

  /**
   * Is payment failure notification
   */
  isPaymentFailure(): boolean {
    return this.type === "PaymentFailed";
  }

  /**
   * Is reminder notification
   */
  isReminder(): boolean {
    return this.type === "Reminder";
  }

  // ==================== FACTORY METHODS ====================
  /**
   * Create notification
   */
  static async createNotification(data: {
    userId: string;
    type: string;
    message: string;
    bookingId?: string;
  }): Promise<NotificationClass> {
    try {
      const notification = new (this as any)(data);
      if (!notification.isValid()) {
        throw new Error("Invalid notification data");
      }
      await notification.send();
      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${(error as Error).message}`);
    }
  }

  /**
   * Create booking confirmation
   */
  static async createBookingConfirmation(
    userId: string,
    bookingId: string,
    movieTitle: string
  ): Promise<NotificationClass> {
    return await this.createNotification({
      userId,
      bookingId,
      type: "BookingConfirmed",
      message: `Your booking for ${movieTitle} has been confirmed!`,
    });
  }

  /**
   * Create booking cancellation
   */
  static async createBookingCancellation(
    userId: string,
    bookingId: string,
    movieTitle: string
  ): Promise<NotificationClass> {
    return await this.createNotification({
      userId,
      bookingId,
      type: "BookingCancelled",
      message: `Your booking for ${movieTitle} has been cancelled.`,
    });
  }

  /**
   * Create payment success
   */
  static async createPaymentSuccess(
    userId: string,
    bookingId: string,
    amount: number
  ): Promise<NotificationClass> {
    return await this.createNotification({
      userId,
      bookingId,
      type: "PaymentSuccess",
      message: `Payment of रु. ${amount} has been successfully processed!`,
    });
  }

  /**
   * Create payment failure
   */
  static async createPaymentFailure(
    userId: string,
    bookingId: string,
    reason?: string
  ): Promise<NotificationClass> {
    const message = reason 
      ? `Payment failed: ${reason}` 
      : "Your payment could not be processed. Please try again.";
    
    return await this.createNotification({
      userId,
      bookingId,
      type: "PaymentFailed",
      message,
    });
  }

  /**
   * Create reminder
   */
  static async createReminder(
    userId: string,
    bookingId: string,
    movieTitle: string,
    showTime: string
  ): Promise<NotificationClass> {
    return await this.createNotification({
      userId,
      bookingId,
      type: "Reminder",
      message: `Reminder: ${movieTitle} is starting at ${showTime}!`,
    });
  }

  // ==================== QUERY METHODS ====================
  /**
   * Get unread notifications for user
   */
  static async getUnreadForUser(userId: mongoose.Schema.Types.ObjectId, limit = 20): Promise<NotificationClass[]> {
    return (this as any)
      .find({ userId, isRead: false })
      .sort({ sentAt: -1 })
      .limit(limit);
  }

  /**
   * Get read notifications for user
   */
  static async getReadForUser(userId: mongoose.Schema.Types.ObjectId, limit = 20): Promise<NotificationClass[]> {
    return (this as any)
      .find({ userId, isRead: true })
      .sort({ sentAt: -1 })
      .limit(limit);
  }

  /**
   * Get all notifications for user
   */
  static async getAllForUser(userId: mongoose.Schema.Types.ObjectId, limit = 50): Promise<NotificationClass[]> {
    return (this as any)
      .find({ userId })
      .sort({ sentAt: -1 })
      .limit(limit);
  }

  /**
   * Get unread count for user
   */
  static async getUnreadCountForUser(userId: mongoose.Schema.Types.ObjectId): Promise<number> {
    return (this as any).countDocuments({ userId, isRead: false });
  }

  /**
   * Get notifications by type
   */
  static async getByType(userId: mongoose.Schema.Types.ObjectId, type: string): Promise<NotificationClass[]> {
    return (this as any)
      .find({ userId, type })
      .sort({ sentAt: -1 });
  }

  /**
   * Get notifications by booking
   */
  static async getByBooking(bookingId: string): Promise<NotificationClass[]> {
    return (this as any)
      .find({ bookingId })
      .sort({ sentAt: -1 });
  }

  /**
   * Mark all as read for user
   */
  static async markAllAsReadForUser(userId: mongoose.Schema.Types.ObjectId): Promise<any> {
    return (this as any).updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
  }

  /**
   * Delete old notifications
   */
  static async deleteOlderThan(days: number): Promise<any> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return (this as any).deleteMany({ sentAt: { $lt: cutoffDate } });
  }
}

notificationSchema.loadClass(NotificationClass);

export type INotificationDocument = mongoose.HydratedDocument<NotificationClass>;
export type INotificationModel = mongoose.Model<NotificationClass> & typeof NotificationClass;

const Notification = mongoose.model<NotificationClass, INotificationModel>("Notification", notificationSchema);

export default Notification;

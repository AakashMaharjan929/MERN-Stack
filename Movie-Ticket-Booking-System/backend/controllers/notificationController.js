import Notification from "../models/Notification.js";

// ---------------------------
// Create & send a notification
// ---------------------------
export const sendNotification = async (req, res) => {
  try {
    const { userId, bookingId, type, message } = req.body;

    const notification = new Notification({ userId, bookingId, type, message });
    await notification.send();

    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all notifications for a user
// ---------------------------
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Get all unread notifications for a user
// ---------------------------
export const getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.getUnreadForUser(userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Mark a notification as read
// ---------------------------
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    await notification.markAsRead();
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------
// Delete a notification
// ---------------------------
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import express from "express";
import {
  sendNotification,
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// ---------------------------
// Notification Routes
// ---------------------------

// Send a notification
router.post("/", sendNotification);

// Get all notifications for a user
router.get("/:userId", getUserNotifications);

// Get unread notifications for a user
router.get("/:userId/unread", getUnreadNotifications);

// Mark a notification as read
router.patch("/:id/read", markAsRead);

// Delete a notification
router.delete("/:id", deleteNotification);

export default router;

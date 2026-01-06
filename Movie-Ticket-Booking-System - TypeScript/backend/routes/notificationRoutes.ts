import express from "express";
import {
  sendNotification,
  getUserNotifications,
  getUnreadNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", sendNotification);
router.get("/:userId", getUserNotifications);
router.get("/:userId/unread", getUnreadNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;

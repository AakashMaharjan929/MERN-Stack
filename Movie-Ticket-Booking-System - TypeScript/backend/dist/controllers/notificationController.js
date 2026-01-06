import Notification from '../models/Notification.js';
export const sendNotification = async (req, res) => {
    try {
        const { userId, bookingId, type, message } = req.body;
        if (!userId || !type || !message) {
            return res.status(400).json({ message: 'userId, type, and message are required' });
        }
        const notification = await Notification.create({ userId, bookingId, type, message });
        await notification.send?.();
        res.status(201).json(notification);
    }
    catch (err) {
        console.error('Send notification error:', err);
        res.status(500).json({ message: err.message || 'Failed to send notification' });
    }
};
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch notifications' });
    }
};
export const getUnreadNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const unread = await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
        res.json(unread);
    }
    catch (err) {
        console.error('Get unread notifications error:', err);
        res.status(500).json({ message: err.message || 'Failed to fetch unread notifications' });
    }
};
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Notification not found' });
        res.json(updated);
    }
    catch (err) {
        console.error('Mark notification read error:', err);
        res.status(500).json({ message: err.message || 'Failed to mark as read' });
    }
};
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Notification.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ message: 'Notification not found' });
        res.json({ message: 'Notification deleted' });
    }
    catch (err) {
        console.error('Delete notification error:', err);
        res.status(500).json({ message: err.message || 'Failed to delete notification' });
    }
};

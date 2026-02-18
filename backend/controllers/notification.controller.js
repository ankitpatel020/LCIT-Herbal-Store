import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notification not found',
        });
    }

    if (notification.user.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized',
        });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
        success: true,
        data: notification,
    });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user.id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
    });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notification not found',
        });
    }

    if (notification.user.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized',
        });
    }

    await notification.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Notification removed',
    });
});

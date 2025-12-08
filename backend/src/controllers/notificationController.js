import { Notification } from '../models/Notification.js';
import { AppError, asyncHandler } from '../utils/errorHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { limit = 50, unreadOnly = false } = req.query;

  const query = { userId };
  if (unreadOnly === 'true') {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  res.json({
    success: true,
    count: notifications.length,
    unreadCount,
    data: notifications,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { notificationId } = req.params;

  const notification = await Notification.findOne({ _id: notificationId, userId });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.userId;

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { notificationId } = req.params;

  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  res.json({
    success: true,
    message: 'Notification deleted',
  });
});



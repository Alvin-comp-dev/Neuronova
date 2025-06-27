import express from 'express';
import { auth } from '../middleware/auth';
import * as notificationController from '../controllers/notification';

const router = express.Router();

// Get user notifications
router.get('/', auth, notificationController.getNotifications);

// Get unread notification count
router.get('/unread-count', auth, notificationController.getUnreadCount);

// Get notification statistics
router.get('/stats', auth, notificationController.getNotificationStats);

// Get notification preferences
router.get('/preferences', auth, notificationController.getPreferences);

// Update notification preferences
router.put('/preferences', auth, notificationController.updatePreferences);

// Mark specific notification as read
router.patch('/:notificationId/read', auth, notificationController.markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', auth, notificationController.markAllAsRead);

// Archive notification
router.patch('/:notificationId/archive', auth, notificationController.archiveNotification);

// Delete notification
router.delete('/:notificationId', auth, notificationController.deleteNotification);

export default router; 
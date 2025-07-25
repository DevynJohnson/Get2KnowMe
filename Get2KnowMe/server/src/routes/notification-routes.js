import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { authenticateToken } from '../utils/auth.js'; // Assuming you have auth middleware

const router = express.Router();

// Get user's notifications (now filters out hidden users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;

    // Get user's hidden notifications list
    const currentUser = await User.findById(req.user._id).select('hiddenNotifications');
    const hiddenUserIds = currentUser.hiddenNotifications || [];

    // Build query - exclude notifications from hidden users
    const query = { 
      recipient: req.user._id,
      sender: { $nin: hiddenUserIds } // Exclude hidden users
    };
    
    if (type && ['follow_request', 'follow_accepted', 'passport_update'].includes(type)) {
      query.type = type;
    }
    
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'username communicationPassport.preferredName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Notification.countDocuments(query);
    
    // Unread count also excludes hidden users
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false,
      sender: { $nin: hiddenUserIds }
    });

    const formattedNotifications = notifications.map(notification => ({
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      sender: {
        _id: notification.sender._id,
        username: notification.sender.username,
        displayName: notification.sender.communicationPassport?.preferredName || notification.sender.username
      },
      data: notification.data,
      read: notification.read,
      readAt: notification.readAt,
      actionTaken: notification.actionTaken,
      actionTakenAt: notification.actionTakenAt,
      createdAt: notification.createdAt,
      timeAgo: notification.timeAgo
    }));

    res.json({
      notifications: formattedNotifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore: skip + notifications.length < totalCount
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Get user's hidden notification preferences
router.get('/hidden', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('hiddenNotifications');
    res.json({ 
      hiddenUserIds: user.hiddenNotifications.map(id => id.toString()) 
    });
  } catch (error) {
    console.error('Get hidden notifications error:', error);
    res.status(500).json({ error: 'Failed to get hidden notifications' });
  }
});

// Hide notifications from a specific user
router.post('/hide/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(req.user._id);
    
    await currentUser.hideNotificationsFrom(userId);
    
    res.json({ message: 'Notifications hidden successfully' });
  } catch (error) {
    console.error('Hide notifications error:', error);
    res.status(500).json({ error: 'Failed to hide notifications' });
  }
});

// Unhide notifications from a specific user
router.post('/unhide/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(req.user._id);
    
    await currentUser.unhideNotificationsFrom(userId);
    
    res.json({ message: 'Notifications unhidden successfully' });
  } catch (error) {
    console.error('Unhide notifications error:', error);
    res.status(500).json({ error: 'Failed to unhide notifications' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.markAsRead();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read (excludes hidden users)
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    // Get user's hidden notifications list
    const currentUser = await User.findById(req.user._id).select('hiddenNotifications');
    const hiddenUserIds = currentUser.hiddenNotifications || [];

    await Notification.updateMany(
      { 
        recipient: req.user._id, 
        read: false,
        sender: { $nin: hiddenUserIds } // Only mark non-hidden notifications as read
      },
      { 
        read: true, 
        readAt: new Date() 
      }
    );

    res.json({ message: 'All visible notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Get notification counts by type (excludes hidden users)
router.get('/counts', authenticateToken, async (req, res) => {
  try {
    // Get user's hidden notifications list
    const currentUser = await User.findById(req.user._id).select('hiddenNotifications');
    const hiddenUserIds = currentUser.hiddenNotifications || [];

    const counts = await Notification.aggregate([
      { 
        $match: { 
          recipient: req.user._id,
          sender: { $nin: hiddenUserIds } // Exclude hidden users
        } 
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          unread: { 
            $sum: { 
              $cond: [{ $eq: ['$read', false] }, 1, 0] 
            } 
          }
        }
      }
    ]);

    const totalUnread = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
      sender: { $nin: hiddenUserIds } // Exclude hidden users
    });

    const formattedCounts = counts.reduce((acc, count) => {
      acc[count._id] = {
        total: count.total,
        unread: count.unread
      };
      return acc;
    }, {});

    res.json({
      byType: formattedCounts,
      totalUnread
    });
  } catch (error) {
    console.error('Get notification counts error:', error);
    res.status(500).json({ error: 'Failed to get notification counts' });
  }
});

export default router;
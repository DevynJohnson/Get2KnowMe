import express from 'express';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// Search for users to follow
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    const currentUserId = req.user._id;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    // Build search conditions: only username (exact match) and passcode
    const searchConditions = [
      // Username must match exactly (case-insensitive)
      { username: { $regex: `^${q}$`, $options: 'i' } }
    ];

    // If the query looks like a passcode (alphanumeric, 6-20 chars, possibly with dashes), add passcode search
    const passcodePattern = /^[A-Z0-9\-]{6,20}$/i;
    if (passcodePattern.test(q.replace(/-/g, ''))) {
      searchConditions.push({ 'communicationPassport.profilePasscode': { $regex: q.replace(/-/g, ''), $options: 'i' } });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $or: searchConditions },
        { 'privacySettings.showInSearch': true }
      ]
    })
      .select('username email communicationPassport.preferredName privacySettings communicationPassport.profilePasscode')
      .limit(parseInt(limit));

    // Check follow status for each user
    const currentUser = await User.findById(currentUserId)
      .select('following sentFollowRequests');

    const usersWithFollowStatus = users.map(user => {
      const isFollowing = currentUser.following.some(f => f.user.equals(user._id));
      const requestSent = currentUser.sentFollowRequests.some(r => r.to.equals(user._id));

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        passcode: user.communicationPassport?.profilePasscode || '',
        isFollowing,
        requestSent,
        allowsFollowRequests: user.privacySettings?.allowFollowRequests !== false
      };
    });

    res.json(usersWithFollowStatus);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Send follow request
router.post('/request/:userId', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUser = await User.findById(req.user._id);

    await currentUser.sendFollowRequest(targetUserId);
    await Notification.createFollowRequestNotification(req.user._id, targetUserId);

    res.json({ message: 'Follow request sent successfully' });
  } catch (error) {
    console.error('Follow request error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Accept follow request
router.post('/accept/:fromUserId', authenticateToken, async (req, res) => {
  try {
    const fromUserId = req.params.fromUserId;
    const currentUser = await User.findById(req.user._id);

    await currentUser.acceptFollowRequest(fromUserId);
    await Notification.createFollowAcceptedNotification(req.user._id, fromUserId);

    // Mark the follow request notification as action taken
    await Notification.findOneAndUpdate(
      { 
        recipient: req.user._id, 
        sender: fromUserId, 
        type: 'follow_request',
        actionTaken: false
      },
      { 
        actionTaken: true, 
        actionTakenAt: new Date() 
      }
    );

    res.json({ message: 'Follow request accepted' });
  } catch (error) {
    console.error('Accept follow error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Reject follow request
router.post('/reject/:fromUserId', authenticateToken, async (req, res) => {
  try {
    const fromUserId = req.params.fromUserId;
    const currentUser = await User.findById(req.user._id);

    await currentUser.rejectFollowRequest(fromUserId);

    // Mark the follow request notification as action taken
    await Notification.findOneAndUpdate(
      { 
        recipient: req.user._id, 
        sender: fromUserId, 
        type: 'follow_request',
        actionTaken: false
      },
      { 
        actionTaken: true, 
        actionTakenAt: new Date() 
      }
    );

    res.json({ message: 'Follow request rejected' });
  } catch (error) {
    console.error('Reject follow error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Unfollow user
router.delete('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUser = await User.findById(req.user._id);

    await currentUser.unfollowUser(targetUserId);

    res.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get user's followers
router.get('/followers', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers.user', 'username communicationPassport.preferredName')
      .select('followers');

    const followers = user.followers.map(f => ({
      _id: f.user._id,
      username: f.user.username,
      email: f.user.email,
      followedAt: f.followedAt
    }));

    res.json(followers);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to get followers' });
  }
});

// Get users being followed
router.get('/following', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following.user', 'username communicationPassport.preferredName')
      .select('following');

    const following = user.following.map(f => ({
      _id: f.user._id,
      username: f.user.username,
      email: f.user.email,
      followedAt: f.followedAt
    }));

    res.json(following);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Failed to get following list' });
  }
});

// Get pending follow requests (received)
router.get('/requests/pending', authenticateToken, async (req, res) => {
  console.log('Received request for /api/follow/requests/pending');
  try {
    const user = await User.findById(req.user._id)
      .populate('pendingFollowRequests.from', 'username email communicationPassport.preferredName')
      .select('pendingFollowRequests');
    console.log('User found:', user);

    const requests = user.pendingFollowRequests.map(r => ({
      _id: r.from._id,
      username: r.from.username,
      email: r.from.email,
      requestedAt: r.requestedAt
    }));

    console.log('Requests mapped:', requests);
    res.json(requests);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Failed to get pending requests' });
  }
});

// Get sent follow requests
router.get('/requests/sent', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('sentFollowRequests.to', 'username communicationPassport.preferredName')
      .select('sentFollowRequests');

    const requests = user.sentFollowRequests.map(r => ({
      _id: r.to._id,
      username: r.to.username,
      email: r.to.email,
      requestedAt: r.requestedAt
    }));

    res.json(requests);
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ error: 'Failed to get sent requests' });
  }
});

// Cancel sent follow request
router.delete('/request/cancel/:userId', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove from sent requests
    const sentRequestIndex = currentUser.sentFollowRequests.findIndex(r => r.to.equals(targetUserId));
    if (sentRequestIndex === -1) {
      return res.status(400).json({ error: 'No pending request found' });
    }

    currentUser.sentFollowRequests.splice(sentRequestIndex, 1);

    // Remove from target user's pending requests
    const pendingRequestIndex = targetUser.pendingFollowRequests.findIndex(r => r.from.equals(req.user._id));
    if (pendingRequestIndex !== -1) {
      targetUser.pendingFollowRequests.splice(pendingRequestIndex, 1);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Follow request cancelled' });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

export default router;
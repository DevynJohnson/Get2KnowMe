import React, { useState, useEffect, useCallback } from 'react';
import QRCodeScanner from '../QRCodeScanner.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'react-bootstrap';
import '../../styles/SocialDashboard.css';

// Followed Users Component
function FollowedUsers({ hiddenNotifications, setHiddenNotifications, onHiddenNotificationsChange }) {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const response = await fetch('/api/follow/following', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowing(data);
      }
    } catch (error) {
      console.error('Fetch following error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading followed users...</div>;
  }

  if (following.length === 0) {
    return (
      <div className="empty-state">
        <FontAwesomeIcon icon="users" className="empty-state-icon" />
        <p>You're not following anyone yet</p>
      </div>
    );
  }

  // Delete followed user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to unfollow this user?')) return;
    try {
      const response = await fetch(`/api/follow/unfollow/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        setFollowing(following.filter(u => u._id !== userId));
      }
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  // Toggle hide notifications for a user - now persists to backend
  const handleToggleHideNotifications = async (userId) => {
    const isCurrentlyHidden = hiddenNotifications.includes(userId);
    const action = isCurrentlyHidden ? 'unhide' : 'hide';
    
    try {
      const response = await fetch(`/api/notifications/${action}/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setHiddenNotifications(prev =>
          isCurrentlyHidden
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
        );
        
        // Trigger a refresh of the notifications to update the count
        if (onHiddenNotificationsChange) {
          onHiddenNotificationsChange();
        }
      } else {
        console.error('Failed to update notification preferences');
      }
    } catch (error) {
      console.error('Toggle hide notifications error:', error);
    }
  };

  return (
    <div className="followed-users-container">
      {following.map((user) => (
        <Card
          className="followed-user-card"
          key={user._id}
        >
          <div className="followed-user-card-content">
            <div className="user-info">
              <span className="username">{user.username}</span>
              {user.email && <span className="user-email">{user.email}</span>}
            </div>
            <div className="user-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleToggleHideNotifications(user._id)}
                type="button"
              >
                {hiddenNotifications.includes(user._id) ? 'Unmute' : 'Mute'}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(user._id)}
                title="Unfollow user"
                type="button"
              >
                Unfollow
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Followers Component - shows users who are following you
const Followers = ({ refreshTrigger }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, [refreshTrigger]);

  const fetchFollowers = async () => {
    try {
      const response = await fetch('/api/follow/followers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowers(data);
      }
    } catch (error) {
      console.error('Fetch followers error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove follower (they stop following you)
  const handleRemoveFollower = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this follower? They will no longer be able to see your updates.')) return;
    try {
      const response = await fetch(`/api/follow/remove-follower/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        setFollowers(followers.filter(f => f._id !== userId));
      } else {
        console.error('Failed to remove follower');
      }
    } catch (error) {
      console.error('Remove follower error:', error);
    }
  };

  // Block user (prevents them from following you and removes current follow)
  const handleBlockUser = async (userId) => {
    if (!window.confirm('Are you sure you want to block this user? They will not be able to follow you or send you requests in the future.')) return;
    try {
      const response = await fetch(`/api/follow/block/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        setFollowers(followers.filter(f => f._id !== userId));
      } else {
        console.error('Failed to block user');
      }
    } catch (error) {
      console.error('Block user error:', error);
    }
  };

  // Follow back user
  const handleFollowBack = async (userId) => {
    try {
      const response = await fetch(`/api/follow/request/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        // Update the follower to show they now have a follow request sent
        setFollowers(followers.map(f => 
          f._id === userId 
            ? { ...f, followRequestSent: true, isFollowedBack: true }
            : f
        ));
      } else {
        console.error('Failed to send follow request');
      }
    } catch (error) {
      console.error('Follow back error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading followers...</div>;
  }

  if (followers.length === 0) {
    return (
      <div className="empty-state">
        <FontAwesomeIcon icon="user-friends" className="empty-state-icon" />
        <p>No followers yet</p>
      </div>
    );
  }

  return (
    <div className="followers-container">
      {followers.map((follower) => (
        <Card
          className="follower-card"
          key={follower._id}
        >
          <div className="follower-card-content">
            <div className="user-info">
              <span className="username">{follower.username}</span>
              {follower.email && <span className="user-email">{follower.email}</span>}
            </div>
            <div className="follower-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleFollowBack(follower._id)}
                disabled={follower.isFollowing || follower.followRequestSent || follower.isFollowedBack}
                title={follower.isFollowing ? "Already following this user" : 
                       follower.followRequestSent ? "Follow request already sent" : 
                       "Send follow request"}
                type="button"
              >
                {follower.isFollowing ? 'Already Following' : 
                 follower.followRequestSent || follower.isFollowedBack ? 'Request Sent' : 
                 'Follow Back'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleRemoveFollower(follower._id)}
                title="Remove follower"
                type="button"
              >
                Remove
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleBlockUser(follower._id)}
                title="Block user"
                type="button"
              >
                Block
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// User Search Component
const UserSearch = ({ onFollowUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [blockedLoading, setBlockedLoading] = useState(false);
    
    const searchUsers = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/follow/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
    }
    } catch (error) {
        console.error('Search error:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Handle QR code scan success
  const handleScanSuccess = (scannedValue) => {
    setShowScanner(false);
    setSearchQuery(scannedValue);
    // Optionally, trigger search immediately:
    searchUsers(scannedValue);
};

// Fetch blocked users
const fetchBlockedUsers = async () => {
  setBlockedLoading(true);
  try {
    const response = await fetch('/api/follow/blocked', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('id_token')}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setBlockedUsers(data);
    }
  } catch (error) {
    console.error('Fetch blocked users error:', error);
  } finally {
    setBlockedLoading(false);
  }
};

// Handle unblock user
const handleUnblockUser = async (userId) => {
  if (!window.confirm('Are you sure you want to unblock this user? They will be able to send you follow requests and appear in searches again.')) return;
  
  try {
    const response = await fetch(`/api/follow/unblock/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('id_token')}`
      }
    });
    if (response.ok) {
      setBlockedUsers(blockedUsers.filter(u => u._id !== userId));
    } else {
      console.error('Failed to unblock user');
    }
  } catch (error) {
    console.error('Unblock user error:', error);
  }
};

// Toggle blocked users view
const toggleBlockedUsers = () => {
  if (!showBlockedUsers) {
    fetchBlockedUsers();
  }
  setShowBlockedUsers(!showBlockedUsers);
};

const handleFollowRequest = async (userId) => {
    try {
        const response = await fetch(`/api/follow/request/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        setSearchResults(results =>
          results.map(user =>
            user._id === userId
              ? { ...user, requestSent: true }
              : user
          )
        );
        if (onFollowUser) onFollowUser();
      }
    } catch (error) {
      console.error('Follow request error:', error);
    }
  };

  const getFollowButtonContent = (user) => {
    if (user.isFollowing) {
      return {
        icon: <FontAwesomeIcon icon="user-check" className="button-icon" />,
        text: 'Following',
        className: 'btn-success',
        disabled: true
      };
    }
    if (user.requestSent) {
      return {
        icon: <FontAwesomeIcon icon="user-times" className="button-icon" />,
        text: 'Requested',
        className: 'btn-warning',
        disabled: true
    };
}
if (!user.allowsFollowRequests) {
      return {
        icon: <FontAwesomeIcon icon="user-times" className="button-icon" />,
        text: 'Private',
        className: 'btn-secondary',
        disabled: true
    };
}
return {
      icon: <FontAwesomeIcon icon="user-plus" className="button-icon" />,
      text: 'Follow',
      className: 'btn-primary',
      disabled: false
    };
  };

  // Track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  // Mark as searched when searchQuery changes and is long enough
  useEffect(() => {
    if (searchQuery.length >= 2) setHasSearched(true);
    else setHasSearched(false);
  }, [searchQuery]);

  return (
    <div className="user-search-container">
      <div className="search-form-container">
        <div className="search-input-section">
          <div className="search-controls">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search Username, Email or Passcode"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control social-dashboard-search-input"
                onKeyDown={(e) => { if (e.key === 'Enter') searchUsers(searchQuery); }}
              />
            </div>
            <button
              type="button"
              className="btn social-dashboard-action-btn search-btn"
              onClick={() => searchUsers(searchQuery)}
              title="Search"
            >
              <FontAwesomeIcon icon="search" className="btn-icon" />
              <span>Search</span>
            </button>
            <h4 className="search-divider">----- OR -----</h4>
            <button
              type="button"
              className="btn btn-outline-white social-dashboard-action-btn scan-qr-button"
              onClick={() => setShowScanner(true)}
              title="Scan QR Code"
            >
              <FontAwesomeIcon icon="user-plus" className="btn-icon" />
              <span>Scan QR</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary social-dashboard-action-btn blocked-users-button"
              onClick={toggleBlockedUsers}
              title="View Blocked Users"
            >
              <FontAwesomeIcon icon="user-slash" className="btn-icon" />
              <span>{showBlockedUsers ? 'Hide Blocked' : 'View Blocked'}</span>
            </button>
          </div>
          {loading && (
            <div className="search-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
        <QRCodeScanner
          show={showScanner}
          onHide={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
        {/* Always show a result area after a search */}
        {hasSearched && (
          <div className="search-results-container">
            {searchResults.length === 0 && !loading ? (
              <div className="no-results-card">
                <FontAwesomeIcon icon="users" className="no-results-icon" />
                <div>No users found. Make sure to enter their entire username, email address or passcode.</div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="search-results-list">
                {searchResults.map((user) => {
                  const buttonProps = getFollowButtonContent(user);
                  return (
                    <Card
                      className="search-result-card"
                      key={user._id}
                    >
                      <div className="search-result-content">
                        <div className="search-result-user-info">
                          <p className="search-result-username">{user.username}</p>
                          <p className="search-result-email">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handleFollowRequest(user._id)}
                          disabled={buttonProps.disabled}
                          className={`btn ${buttonProps.className} follow-action-btn`}
                        >
                          {buttonProps.icon}
                          <span className="follow-btn-text">{buttonProps.text}</span>
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
        {/* Blocked users section */}
        {showBlockedUsers && (
          <div className="blocked-users-container">
            <h4 className="blocked-users-title">
              <FontAwesomeIcon icon="user-slash" className="blocked-users-icon" />
              Blocked Users
            </h4>
            {blockedLoading ? (
              <div className="text-center py-4">Loading blocked users...</div>
            ) : blockedUsers.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon="user-slash" className="empty-state-icon" />
                <p>No blocked users</p>
              </div>
            ) : (
              <div className="blocked-users-list">
                {blockedUsers.map((user) => (
                  <Card
                    className="blocked-user-card"
                    key={user._id}
                  >
                    <div className="blocked-user-content">
                      <div className="blocked-user-info">
                        <span className="blocked-username">{user.username}</span>
                        {user.email && <span className="blocked-user-email">{user.email}</span>}
                        <span className="blocked-date">
                          Blocked {new Date(user.blockedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUnblockUser(user._id)}
                        title="Unblock user"
                        type="button"
                      >
                        <FontAwesomeIcon icon="user-check" className="btn-icon" />
                        Unblock
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Follow Requests Component
const FollowRequests = ({ onRequestHandled }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/follow/requests/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (userId, action) => {
    try {
      const response = await fetch(`/api/follow/${action}/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        setRequests(requests.filter(req => req._id !== userId));
        if (onRequestHandled) onRequestHandled();
      }
    } catch (error) {
      console.error(`${action} request error:`, error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <FontAwesomeIcon icon="users" className="empty-state-icon" />
        <p>No pending follow requests</p>
      </div>
    );
  }

  return (
    <div className="follow-requests-container">
      {requests.map((request) => (
        <div key={request._id} className="follow-request-card">
          <div className="request-info">
            <p className="request-username">From User: {request.username || request.email || request._id}</p>
            <p className="request-date">
              Requested {new Date(request.requestedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="request-actions">
            <button
              onClick={() => handleRequest(request._id, 'accept')}
              className="btn btn-success request-btn"
            >
              <FontAwesomeIcon icon="user-check" className="request-btn-icon" />
              Accept
            </button>
            <button
              onClick={() => handleRequest(request._id, 'reject')}
              className="btn btn-danger request-btn"
            >
              <FontAwesomeIcon icon="user-times" className="request-btn-icon" />
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Notifications Component - now expects backend to handle filtering
const NotificationsList = ({ refreshTrigger, onNotificationCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Backend now handles filtering hidden notifications
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        
        // Notify parent component of count change
        if (onNotificationCountChange) {
          onNotificationCountChange(data.unreadCount);
        }
        
        console.log('[Notifications Debug] Raw notifications:', data.notifications);
        data.notifications.forEach(n => {
          if (n.type === 'passport_update') {
            console.log('[Notifications Debug] passport_update notification:', n);
            if (n.data && n.data.passcode) {
              console.log('[Notifications Debug] Passcode found:', n.data.passcode);
            } else {
              console.warn('[Notifications Debug] Passcode missing in notification.data:', n.data);
            }
          }
        });
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  }, [onNotificationCountChange]);

  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger, fetchNotifications]);

  // Dismiss notification handler
  const handleDismiss = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        const updatedNotifications = notifications.filter(n => n._id !== notificationId);
        setNotifications(updatedNotifications);
        const newUnreadCount = updatedNotifications.filter(n => !n.read).length;
        setUnreadCount(newUnreadCount);
        
        // Notify parent component of count change
        if (onNotificationCountChange) {
          onNotificationCountChange(newUnreadCount);
        }
      }
    } catch (error) {
      console.error('Dismiss notification error:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('id_token')}`
        }
      });
      if (response.ok) {
        setNotifications(notifications.map(notif =>
          notif._id === notificationId
            ? { ...notif, read: true }
            : notif
        ));
        const newUnreadCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newUnreadCount);
        
        // Notify parent component of count change
        if (onNotificationCountChange) {
          onNotificationCountChange(newUnreadCount);
        }
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      {unreadCount > 0 && (
        <div className="unread-count-container">
          <span className="unread-count-badge">
            {unreadCount} unread
          </span>
        </div>
      )}
      {notifications.length === 0 ? (
        <div className="empty-state">
          <FontAwesomeIcon icon="bell" className="empty-state-icon" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            let message = '';
            const username = notification.data && notification.data.username ? notification.data.username : notification.sender.username;
            if (notification.type === 'follow_request') {
              message = `You have a new follow request from ${username}`;
            } else if (notification.type === 'follow_accepted') {
              message = `${username} has accepted your follow request`;
            } else if (notification.type === 'follow_denied') {
              message = `${username} has denied your follow request`;
            } else {
              message = notification.message || notification.title || 'You have a new notification';
            }
            // Passport update: add View Passport button
            let showViewPassport = false;
            let passportUrl = null;
            if (notification.type === 'passport_update') {
              // Try to get passcode from notification.data, fallback to sender.passcode if available
              const passcode = notification.data && notification.data.passcode
                ? notification.data.passcode
                : (notification.sender && notification.sender.passcode ? notification.sender.passcode : null);
              if (passcode) {
                showViewPassport = true;
                passportUrl = `/passport/view/${passcode}`;
              }
            }
            return (
              <div
                key={notification._id}
                className={`notification-card ${!notification.read ? 'unread' : ''}`}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="notification-message">{message}</div>
                <div className="notification-actions">
                  {showViewPassport && (
                    <a
                      href={passportUrl}
                      className="btn btn-primary notification-action-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      View Passport
                    </a>
                  )}
                  <button
                    className="btn btn-danger notification-action-btn"
                    onClick={e => {
                      e.stopPropagation();
                      handleDismiss(notification._id);
                    }}
                    title="Dismiss notification"
                    type="button"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main Social Dashboard Component - now fetches hidden notifications from backend
const SocialDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [hiddenNotifications, setHiddenNotifications] = useState([]); // user IDs for which notifications are hidden
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleHiddenNotificationsChange = () => {
    // Force refresh of notifications to get updated count
    setRefreshKey(prev => prev + 1);
  };

  const handleNotificationCountChange = (newCount) => {
    setNotificationCount(newCount);
  };

  // Fetch hidden notifications from backend on component mount
  useEffect(() => {
    const fetchHiddenNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/hidden', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('id_token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHiddenNotifications(data.hiddenUserIds || []);
        }
      } catch (error) {
        console.error('Fetch hidden notifications error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenNotifications();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="social-dashboard-grid">
      <div className="social-dashboard-card find-people">
        <h2 className="card-title">
          <FontAwesomeIcon icon="search" className="title-icon" /> Find People
        </h2>
        <UserSearch onFollowUser={handleRefresh} />
      </div>
      <div className="social-dashboard-card followers">
        <h2 className="card-title">
          <FontAwesomeIcon icon="user-friends" className="title-icon" /> Who Is Following Me?
        </h2>
        <Followers refreshTrigger={refreshKey} />
      </div>
      <div className="social-dashboard-card requests">
        <h2 className="card-title">
          <FontAwesomeIcon icon="user-plus" className="title-icon" /> Requests
        </h2>
        <FollowRequests key={refreshKey} onRequestHandled={handleRefresh} />
      </div>
      <div className="social-dashboard-card notifications">
        <h2 className="card-title">
          <FontAwesomeIcon icon="bell" className="title-icon" /> 
          Notifications
          {notificationCount > 0 && (
            <span className="notification-count-badge">
              {notificationCount}
            </span>
          )}
        </h2>
        <NotificationsList 
          refreshTrigger={refreshKey} 
          onNotificationCountChange={handleNotificationCountChange}
        />
      </div>
      <div className="social-dashboard-card following">
        <h2 className="card-title">
          <FontAwesomeIcon icon="users" className="title-icon" /> Following
        </h2>
        <FollowedUsers 
          hiddenNotifications={hiddenNotifications} 
          setHiddenNotifications={setHiddenNotifications} 
          onHiddenNotificationsChange={handleHiddenNotificationsChange}
        />
      </div>
    </div>
  );
};

export default SocialDashboard;

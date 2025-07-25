import React, { useState, useEffect } from 'react';
import QRCodeScanner from '../QRCodeScanner.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUserPlus,
  faUserCheck,
  faUserTimes,
  faBell,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
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
      <div className="text-center py-8 text-gray-500">
        <FontAwesomeIcon icon={faUsers} className="h-12 w-12 mx-auto mb-2 text-gray-300" />
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
    <div className="flex flex-col items-center w-full">
      {following.map((user) => (
        <Card
          className="mb-2 mx-auto"
          key={user._id}
          style={{ maxWidth: '350px', width: '100%' }}
        >
          <div className="p-4 d-flex align-items-center justify-content-between flex-row">
            <div className="d-flex flex-column">
              <span className="fw-bold text-dark" style={{ fontWeight: 700 }}>{user.username}</span>
              {user.email && <span className="text-sm text-gray-500 mb-0">{user.email}</span>}
            </div>
            <div className="d-flex flex-row gap-2 ms-3">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(user._id)}
                title="Unfollow user"
                type="button"
              >
                Unfollow
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleToggleHideNotifications(user._id)}
                type="button"
              >
                {hiddenNotifications.includes(user._id) ? 'Show Notifications' : 'Hide Notifications'}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// User Search Component (unchanged)
const UserSearch = ({ onFollowUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    
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
        icon: <FontAwesomeIcon icon={faUserCheck} className="h-4 w-4" />,
        text: 'Following',
        className: 'bg-green-500 text-white cursor-default',
        disabled: true
      };
    }
    if (user.requestSent) {
      return {
        icon: <FontAwesomeIcon icon={faUserTimes} className="h-4 w-4" />,
        text: 'Requested',
        className: 'bg-yellow-500 text-white cursor-default',
        disabled: true
    };
}
if (!user.allowsFollowRequests) {
      return {
        icon: <FontAwesomeIcon icon={faUserTimes} className="h-4 w-4" />,
        text: 'Private',
        className: 'bg-gray-400 text-white cursor-default',
        disabled: true
    };
}
return {
      icon: <FontAwesomeIcon icon={faUserPlus} className="h-4 w-4" />,
      text: 'Follow',
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
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
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="relative mb-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2" style={{ width: 'auto' }}>
              <input
                type="text"
                placeholder="Search Username or Passcode"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control social-dashboard-search-input"
                onKeyDown={(e) => { if (e.key === 'Enter') searchUsers(searchQuery); }}
              />
              <button
                type="button"
                className="btn social-dashboard-action-btn d-inline-flex align-items-center"
                style={{ minWidth: '80px' }}
                onClick={() => searchUsers(searchQuery)}
                title="Search"
              >
                <FontAwesomeIcon icon={faSearch} className="me-1" />
                <span>Search</span>
              </button>
            </div>
            <h4 className="mb-1 text-center search-divider">----- OR -----</h4>
            <button
              type="button"
              className="btn btn-outline-white social-dashboard-action-btn d-inline-flex align-items-center scan-qr-button mx-auto"
              onClick={() => setShowScanner(true)}
              title="Scan QR Code"
            >
              <FontAwesomeIcon icon={faUserPlus} className="me-1" />
              <span>Scan QR</span>
            </button>
          </div>
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
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
          <div className="flex flex-col items-center mt-4">
            {searchResults.length === 0 && !loading ? (
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 max-w-xs mx-auto">
                <FontAwesomeIcon icon={faUsers} className="h-8 w-8 mb-2 text-gray-300" />
                <div>No users found matching your search.</div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col items-center w-full">
                {searchResults.map((user) => {
                  const buttonProps = getFollowButtonContent(user);
                  return (
                    <Card
                      className="mb-2 mx-auto"
                      key={user._id}
                      style={{ maxWidth: '350px', width: '100%' }}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handleFollowRequest(user._id)}
                          disabled={buttonProps.disabled}
                          className={`btn ${
                            buttonProps.disabled
                              ? buttonProps.text === 'Following'
                                ? 'btn-success'
                                : buttonProps.text === 'Requested'
                                ? 'btn-warning'
                                : buttonProps.text === 'Private'
                                ? 'btn-secondary'
                                : 'btn-secondary'
                              : buttonProps.text === 'Follow'
                              ? 'btn-primary'
                              : 'btn-secondary'
                          } d-inline-flex align-items-center`}
                        >
                          {buttonProps.icon}
                          <span className="ms-2">{buttonProps.text}</span>
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// Follow Requests Component (unchanged)
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
      <div className="text-center py-8 text-gray-500">
        <FontAwesomeIcon icon={faUsers} className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p>No pending follow requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request._id} className="follow-request-card bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between" style={{ color: '#111' }}>
          <div>
            <p className="font-medium" style={{ color: '#111' }}>From User: {request.username || request.email || request._id}</p>
            <p className="text-xs" style={{ color: '#666' }}>
              Requested {new Date(request.requestedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleRequest(request._id, 'accept')}
              className="btn btn-success d-inline-flex align-items-center me-2"
            >
              <FontAwesomeIcon icon={faUserCheck} className="h-4 w-4 me-1" />
              Accept
            </button>
            <button
              onClick={() => handleRequest(request._id, 'reject')}
              className="btn btn-danger d-inline-flex align-items-center"
            >
              <FontAwesomeIcon icon={faUserTimes} className="h-4 w-4 me-1" />
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

  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger]);

  const fetchNotifications = async () => {
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
  };

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
    <div className="max-w-2xl mx-auto">
      {unreadCount > 0 && (
        <div className="flex items-center justify-end mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {unreadCount} unread
          </span>
        </div>
      )}
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FontAwesomeIcon icon={faBell} className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
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
                className="cursor-pointer bg-white p-4 shadow border border-gray-200 text-black d-flex flex-column align-items-stretch"
                style={{ borderRadius: '24px' }}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="mb-2 w-100">{message}</div>
                <div className="d-flex flex-row gap-2 w-100">
                  {showViewPassport && (
                    <a
                      href={passportUrl}
                      className="btn btn-primary flex-fill"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      View Passport
                    </a>
                  )}
                  <button
                    className="btn btn-danger flex-fill"
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
    <div className="social-dashboard-grid p-6">
      <div className="social-dashboard-card find-people">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FontAwesomeIcon icon={faSearch} /> Find People</h2>
        <UserSearch onFollowUser={handleRefresh} />
      </div>
      <div className="social-dashboard-card requests">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FontAwesomeIcon icon={faUserPlus} /> Requests</h2>
        <FollowRequests key={refreshKey} onRequestHandled={handleRefresh} />
      </div>
      <div className="social-dashboard-card notifications">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBell} /> 
          Notifications
          {notificationCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
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
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FontAwesomeIcon icon={faUsers} /> Following</h2>
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
import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaTimesCircle, FaRecycle, FaSpinner, FaCheckDouble, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'approved':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500 text-xl" />;
      case 'warning':
        return <FaBell className="text-yellow-500 text-xl" />;
      default:
        return <FaRecycle className="text-primary-500 text-xl" />;
    }
  };

  const getStatusColor = (type) => {
    switch(type) {
      case 'approved': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-primary-100 p-3 rounded-full">
              <FaBell className="text-primary-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-sm text-primary-600">{unreadCount} unread</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter Buttons */}
            <div className="flex bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'unread' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'read' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Read
              </button>
            </div>
            
            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <FaCheckDouble />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-primary-500' : 'border-gray-200'
                } ${getStatusColor(notification.type)}`}
              >
                <div className="p-5">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {format(new Date(notification.createdAt), 'MMM dd, yyyy • h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-4 mt-3">
                        {notification.relatedId && notification.type === 'approved' && (
                          <Link
                            to={`/incentives`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View Points →
                          </Link>
                        )}
                        {notification.relatedId && notification.type === 'rejected' && (
                          <Link
                            to={`/submit-contribution`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Submit New →
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <FaCheckDouble size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {notifications.length} total notifications • {unreadCount} unread
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
import React, { useState, useEffect } from 'react';
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaCheckDouble,
  FaTrash,
  FaEnvelope,
  FaUsers,
  FaSearch,
  FaEye,
} from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendForm, setSendForm] = useState({
    title: '',
    message: '',
    type: 'info',
    userId: 'all',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/admin/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/admin/notifications/${id}`);
        setNotifications(notifications.filter(n => n._id !== id));
        toast.success('Notification deleted');
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleSendNotification = async () => {
    if (!sendForm.title.trim() || !sendForm.message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    setSending(true);
    try {
      await api.post('/admin/notifications/send', sendForm);
      toast.success('Notification sent successfully!');
      setShowSendModal(false);
      setSendForm({ title: '', message: '', type: 'info', userId: 'all' });
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'approved': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Rejected</span>;
      case 'warning': return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Warning</span>;
      default: return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Info</span>;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filter === 'all' || n.type === filter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Notifications</h1>
          <p className="text-gray-600">View and send system notifications</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaEnvelope />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Total Notifications</p><p className="text-3xl font-bold text-gray-800">{notifications.length}</p></div>
            <div className="bg-blue-100 p-3 rounded-full"><FaBell className="text-blue-600 text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Unread</p><p className="text-3xl font-bold text-yellow-600">{notifications.filter(n => !n.read).length}</p></div>
            <div className="bg-yellow-100 p-3 rounded-full"><FaEye className="text-yellow-600 text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Approved</p><p className="text-3xl font-bold text-green-600">{notifications.filter(n => n.type === 'approved').length}</p></div>
            <div className="bg-green-100 p-3 rounded-full"><FaCheckCircle className="text-green-600 text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Rejected</p><p className="text-3xl font-bold text-red-600">{notifications.filter(n => n.type === 'rejected').length}</p></div>
            <div className="bg-red-100 p-3 rounded-full"><FaTimesCircle className="text-red-600 text-2xl" /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, message, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Types</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Message</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Sent</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <tr key={notification._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUsers className="text-primary-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium">{notification.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-800">{notification.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 max-w-xs truncate">{notification.message}</p>
                  </td>
                  <td className="py-4 px-6">{getTypeBadge(notification.type)}</td>
                  <td className="py-4 px-6">
                    {notification.read ? (
                      <span className="text-green-600 text-sm">Read</span>
                    ) : (
                      <span className="text-yellow-600 text-sm">Unread</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-500">{format(new Date(notification.createdAt), 'MMM dd, yyyy')}</p>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredNotifications.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">No notifications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Send Notification</h2>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send to</label>
                <select
                  value={sendForm.userId}
                  onChange={(e) => setSendForm({ ...sendForm, userId: e.target.value })}
                  className="input-field"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users Only</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select
                  value={sendForm.type}
                  onChange={(e) => setSendForm({ ...sendForm, type: e.target.value })}
                  className="input-field"
                >
                  <option value="info">Info</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={sendForm.title}
                  onChange={(e) => setSendForm({ ...sendForm, title: e.target.value })}
                  placeholder="Enter notification title"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={sendForm.message}
                  onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
                  placeholder="Enter notification message"
                  rows="4"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button onClick={() => setShowSendModal(false)} className="btn-outline">Cancel</button>
                <button onClick={handleSendNotification} disabled={sending} className="btn-primary flex items-center space-x-2">
                  {sending ? <FaSpinner className="animate-spin" /> : <FaEnvelope />}
                  <span>{sending ? 'Sending...' : 'Send Notification'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageNotifications;
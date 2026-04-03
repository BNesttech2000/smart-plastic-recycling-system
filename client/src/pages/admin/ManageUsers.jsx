import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  FaSearch, FaFilter, FaUserEdit, FaTrash, FaBan, FaCheckCircle,
  FaExclamationTriangle, FaDownload, FaPlus, FaEnvelope, FaPhone,
  FaCalendarAlt, FaStar,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(currentPage, 10);
      if (response.success) {
        setUsers(response.data.users || []);
        setTotalUsers(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' ? user.isActive === true : user.isActive === false);
    const matchesTier = filterTier === 'all' || user.rewardTier?.toLowerCase() === filterTier.toLowerCase();
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'bg-purple-100 text-purple-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getStatusColor = (isActive) => isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    setUsers(users.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
    try {
      await adminService.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: currentStatus } : u));
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await adminService.deleteUser(selectedUser._id);
      setUsers(users.filter(u => u._id !== selectedUser._id));
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await adminService.updateUser(selectedUser._id, selectedUser);
      setUsers(users.map(u => u._id === selectedUser._id ? selectedUser : u));
      toast.success('User updated successfully');
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="h-12 bg-gray-200 rounded mb-8"></div>
        <div className="bg-gray-200 rounded-lg h-96"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-gray-800">Manage Users</h1><p className="text-gray-600">View and manage all system users</p></div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button onClick={() => toast.info('Add user feature coming soon')} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"><FaPlus /><span>Add User</span></button>
          <button onClick={() => toast.info('Export feature coming soon')} className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"><FaDownload /><span>Export</span></button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1"><FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-32"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="input-field w-32"><option value="all">All Tiers</option><option value="bronze">Bronze</option><option value="silver">Silver</option><option value="gold">Gold</option><option value="platinum">Platinum</option></select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Contact</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Stats</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tier</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Joined</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"><span className="text-white font-medium">{user.name?.split(' ').map(n => n[0]).join('') || 'U'}</span></div><div><p className="font-medium text-gray-800">{user.name}</p><p className="text-sm text-gray-500">ID: {user._id?.slice(-6)}</p></div></div></td>
                  <td className="py-4 px-6"><p className="flex items-center text-sm text-gray-600"><FaEnvelope className="mr-2 text-gray-400" size={12} />{user.email}</p><p className="flex items-center text-sm text-gray-600 mt-1"><FaPhone className="mr-2 text-gray-400" size={12} />{user.phone || 'Not provided'}</p></td>
                  <td className="py-4 px-6"><p className="text-sm text-gray-600">Points: {user.totalPoints || 0}</p><p className="text-sm text-gray-600">Contributions: {user.totalContributions || 0}</p><p className="text-sm text-gray-600">Weight: {user.totalWeight || 0} kg</p></td>
                  <td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(user.rewardTier)}`}>{user.rewardTier || 'Bronze'}</span></td>
                  <td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>{user.isActive ? 'active' : 'inactive'}</span></td>
                  <td className="py-4 px-6"><p className="flex items-center text-sm text-gray-600"><FaCalendarAlt className="mr-2 text-gray-400" size={12} />{user.joinedDate ? format(new Date(user.joinedDate), 'MMM dd, yyyy') : 'N/A'}</p></td>
                  <td className="py-4 px-6"><div className="flex items-center space-x-2"><button onClick={() => { setSelectedUser(user); setShowUserModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaUserEdit /></button><button onClick={() => handleStatusChange(user._id, user.isActive)} className={`p-2 rounded-lg ${user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>{user.isActive ? <FaBan /> : <FaCheckCircle />}</button><button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button></div></td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-500">No users found</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">Showing {filteredUsers.length} of {totalUsers} users</p>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
              <span className="px-3 py-1 text-sm">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowUserModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={selectedUser.name || ''} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" value={selectedUser.phone || ''} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Address</label><textarea value={selectedUser.address || ''} onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })} rows="3" className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Reward Tier</label><select value={selectedUser.rewardTier || 'Bronze'} onChange={(e) => setSelectedUser({ ...selectedUser, rewardTier: e.target.value })} className="input-field"><option value="Bronze">Bronze</option><option value="Silver">Silver</option><option value="Gold">Gold</option><option value="Platinum">Platinum</option></select></div>
                <div className="flex justify-end space-x-4 pt-4"><button onClick={() => setShowUserModal(false)} className="btn-outline">Cancel</button><button onClick={handleUpdateUser} className="btn-primary">Save Changes</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4"><FaExclamationTriangle className="text-red-600 text-3xl" /></div>
              <h2 className="text-xl font-bold text-center mb-2">Delete User</h2>
              <p className="text-gray-600 text-center mb-6">Are you sure you want to delete {selectedUser.name}? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4"><button onClick={() => setShowDeleteModal(false)} className="btn-outline">Cancel</button><button onClick={handleDeleteUser} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManageUsers;
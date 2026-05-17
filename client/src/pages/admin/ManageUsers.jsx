import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  FaSearch, FaUserEdit, FaTrash, FaBan, FaCheckCircle,
  FaExclamationTriangle, FaDownload, FaPlus, FaEnvelope, FaPhone,
  FaCalendarAlt, FaTimes, FaSpinner, FaFileExcel, FaFileCsv,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [addingUser, setAddingUser] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filterStatus, filterTier]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(currentPage, 10, searchTerm, filterStatus, filterTier);
      if (response.success) {
        setUsers(response.data.users || []);
        setTotalUsers(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // ADD USER FUNCTION
  const handleAddUser = async () => {
    if (!addUserForm.name || !addUserForm.email || !addUserForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (addUserForm.password.length < 6) {
      toast.error('Password must be at least 6 characters and include a letter and a number');
      return;
    }

    setAddingUser(true);
    try {
      const response = await adminService.addUser({
        name: addUserForm.name,
        email: addUserForm.email,
        password: addUserForm.password,
        phone: addUserForm.phone,
        address: addUserForm.address
      });

      if (response.success) {
        toast.success('User added successfully!');
        setShowAddModal(false);
        setAddUserForm({ name: '', email: '', password: '', phone: '', address: '' });
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      const errorMessage = validationErrors?.length
        ? validationErrors.map(err => err.message).join(' | ')
        : serverMessage || 'Failed to add user';
      toast.error(errorMessage);
    } finally {
      setAddingUser(false);
    }
  };

  // EXPORT USERS TO CSV
  const handleExportCSV = async () => {
    setExporting(true);
    setShowExportMenu(false);
    try {
      const blob = await adminService.exportUsersToCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported to CSV successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    } finally {
      setExporting(false);
    }
  };

  // EXPORT USERS TO EXCEL
  const handleExportExcel = async () => {
    setExporting(true);
    setShowExportMenu(false);
    try {
      const blob = await adminService.exportUsersToExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Users exported to Excel successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    } finally {
      setExporting(false);
    }
  };

  // FRONTEND EXPORT (Fallback - creates CSV directly)
  const handleExportFrontend = () => {
    setExporting(true);
    setShowExportMenu(false);
    try {
      const csvData = users.map(user => ({
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'Total Points': user.totalPoints || 0,
        'Total Contributions': user.totalContributions || 0,
        'Total Weight (kg)': user.totalWeight || 0,
        'Reward Tier': user.rewardTier || 'Bronze',
        'Status': user.isActive ? 'Active' : 'Inactive',
        'Joined Date': user.joinedDate ? format(new Date(user.joinedDate), 'yyyy-MM-dd') : 'N/A',
        'User ID': user._id
      }));

      const headers = Object.keys(csvData[0] || {});
      const csvRows = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
      ];
      const csv = csvRows.join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${users.length} users successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    } finally {
      setExporting(false);
    }
  };

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
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
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
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterTier('all');
    setCurrentPage(1);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
          <p className="text-gray-600">View and manage all system users</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button 
            onClick={() => setShowAddModal(true)} 
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /><span>Add User</span>
          </button>
          
          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exporting}
              className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 border border-gray-200"
            >
              {exporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
              <span>{exporting ? 'Exporting...' : 'Export'}</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFileCsv className="text-green-600" />
                    <span>Export as CSV</span>
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFileExcel className="text-green-700" />
                    <span>Export as Excel</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleExportFrontend}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaDownload className="text-blue-600" />
                    <span>Export Current Page</span>
                  </button>
                </div>
              </div>
            )}
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
              placeholder="Search by name or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select 
            value={filterTier} 
            onChange={(e) => setFilterTier(e.target.value)} 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
          <button 
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Stats</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tier</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{user.name?.split(' ').map(n => n[0]).join('') || 'U'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: {user._id?.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="flex items-center text-sm text-gray-600"><FaEnvelope className="mr-2 text-gray-400" size={12} />{user.email}</p>
                    <p className="flex items-center text-sm text-gray-600 mt-1"><FaPhone className="mr-2 text-gray-400" size={12} />{user.phone || 'Not provided'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600">Points: {user.totalPoints || 0}</p>
                    <p className="text-sm text-gray-600">Contributions: {user.totalContributions || 0}</p>
                    <p className="text-sm text-gray-600">Weight: {user.totalWeight || 0} kg</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(user.rewardTier)}`}>
                      {user.rewardTier || 'Bronze'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                      {user.joinedDate ? format(new Date(user.joinedDate), 'MMM dd, yyyy') : 'N/A'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => { setSelectedUser(user); setShowUserModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit User">
                        <FaUserEdit />
                      </button>
                      <button onClick={() => handleStatusChange(user._id, user.isActive)} className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} title={user.isActive ? 'Deactivate' : 'Activate'}>
                        {user.isActive ? <FaBan /> : <FaCheckCircle />}
                      </button>
                      <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">Showing {users.length} of {totalUsers} users</p>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">Previous</button>
              <span className="px-3 py-1 text-sm">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ADD USER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New User</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input type="text" value={addUserForm.name} onChange={(e) => setAddUserForm({...addUserForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" value={addUserForm.email} onChange={(e) => setAddUserForm({...addUserForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="user@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password * (min 6 characters, include letters and numbers)</label>
                  <input type="password" value={addUserForm.password} onChange={(e) => setAddUserForm({...addUserForm, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={addUserForm.phone} onChange={(e) => setAddUserForm({...addUserForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="+260XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea value={addUserForm.address} onChange={(e) => setAddUserForm({...addUserForm, address: e.target.value})} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Lusaka, Zambia"></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleAddUser} disabled={addingUser} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {addingUser ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                  {addingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT USER MODAL */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowUserModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit User</h2>
                <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={selectedUser.name || ''} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" value={selectedUser.phone || ''} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Address</label><textarea value={selectedUser.address || ''} onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })} rows="3" className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">Reward Tier</label><select value={selectedUser.rewardTier || 'Bronze'} onChange={(e) => setSelectedUser({ ...selectedUser, rewardTier: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="Bronze">Bronze</option><option value="Silver">Silver</option><option value="Gold">Gold</option><option value="Platinum">Platinum</option></select></div>
              </div>
              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                <button onClick={() => setShowUserModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleUpdateUser} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4"><FaExclamationTriangle className="text-red-600 text-3xl" /></div>
              <h2 className="text-xl font-bold text-center mb-2">Delete User</h2>
              <p className="text-gray-600 text-center mb-6">Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.</p>
              <div className="flex justify-center space-x-4">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleDeleteUser} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManageUsers;



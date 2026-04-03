import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaRecycle,
  FaUser,
  FaCalendarAlt,
  FaWeightHanging,
  FaTag,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaPrint,
  FaSpinner,
  FaCamera,
  FaLocationArrow,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ApproveContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterType, setFilterType] = useState('all');
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalPending: 0,
    approvedToday: 0,
    rejectedToday: 0,
  });

  useEffect(() => {
    fetchContributions();
  }, []);

  // Update stats whenever contributions change
  useEffect(() => {
    if (contributions.length > 0) {
      calculateStats();
    }
  }, [contributions]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getContributions();
      if (response.success) {
        setContributions(response.data.contributions || []);
      } else {
        toast.error('Failed to fetch contributions');
      }
    } catch (error) {
      console.error('Error fetching contributions:', error);
      toast.error('Failed to fetch contributions');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const pendingCount = contributions.filter(c => c.status === 'pending').length;
    const approvedCount = contributions.filter(c => c.status === 'approved').length;
    const rejectedCount = contributions.filter(c => c.status === 'rejected').length;
    
    setStats({
      totalPending: pendingCount,
      approvedToday: approvedCount,
      rejectedToday: rejectedCount,
    });
  };

  const createNotification = async (userId, title, message, type, contributionId) => {
    try {
      await api.post('/notifications', {
        user: userId,
        title,
        message,
        type,
        relatedId: contributionId,
        relatedModel: 'PlasticContribution'
      });
      console.log('✅ Notification created for user:', userId);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleApprove = async (contribution) => {
    try {
      const response = await adminService.updateContributionStatus(contribution._id, 'approved');
      if (response.success) {
        setContributions(prev => 
          prev.map(c => c._id === contribution._id ? { ...c, status: 'approved' } : c)
        );
        
        await createNotification(
          contribution.user._id,
          'Contribution Approved! 🎉',
          `Your ${contribution.quantity}kg ${contribution.plasticType} contribution has been approved! You earned ${contribution.pointsEarned} points.`,
          'approved',
          contribution._id
        );
        
        toast.success('Contribution approved successfully!');
      } else {
        toast.error('Failed to approve contribution');
      }
    } catch (error) {
      console.error('Error approving contribution:', error);
      toast.error('Failed to approve contribution');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      const response = await adminService.updateContributionStatus(
        selectedContribution._id, 
        'rejected', 
        rejectionReason
      );
      if (response.success) {
        setContributions(prev => 
          prev.map(c => c._id === selectedContribution._id ? { ...c, status: 'rejected' } : c)
        );
        
        await createNotification(
          selectedContribution.user._id,
          'Contribution Rejected',
          `Your ${selectedContribution.quantity}kg ${selectedContribution.plasticType} contribution was rejected. Reason: ${rejectionReason}`,
          'rejected',
          selectedContribution._id
        );
        
        toast.success('Contribution rejected');
        setShowRejectModal(false);
        setRejectionReason('');
      } else {
        toast.error('Failed to reject contribution');
      }
    } catch (error) {
      console.error('Error rejecting contribution:', error);
      toast.error('Failed to reject contribution');
    }
  };

  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = contribution.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contribution.status === filterStatus;
    const matchesType = filterType === 'all' || contribution.plasticType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContributions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPlasticTypeColor = (type) => {
    const colors = {
      PET: 'bg-blue-100 text-blue-800',
      HDPE: 'bg-green-100 text-green-800',
      PVC: 'bg-red-100 text-red-800',
      LDPE: 'bg-yellow-100 text-yellow-800',
      PP: 'bg-purple-100 text-purple-800',
      PS: 'bg-pink-100 text-pink-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Approve Contributions</h1>
          <p className="text-gray-600">Review and verify user contributions</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FaDownload /><span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FaPrint /><span>Print</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Total Pending</p><p className="text-3xl font-bold text-gray-800">{stats.totalPending}</p></div>
            <div className="bg-yellow-100 p-3 rounded-full"><FaRecycle className="text-yellow-600 text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Approved</p><p className="text-3xl font-bold text-green-600">{stats.approvedToday}</p></div>
            <div className="bg-green-100 p-3 rounded-full"><FaCheckCircle className="text-green-600 text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Rejected</p><p className="text-3xl font-bold text-red-600">{stats.rejectedToday}</p></div>
            <div className="bg-red-100 p-3 rounded-full"><FaTimesCircle className="text-red-600 text-2xl" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500 mb-1">Total Contributions</p><p className="text-3xl font-bold text-primary-600">{contributions.length}</p></div>
            <div className="bg-primary-100 p-3 rounded-full"><FaCalendarAlt className="text-primary-600 text-2xl" /></div>
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
              placeholder="Search by user or contribution ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="input-field w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)} 
            className="input-field w-40"
          >
            <option value="all">All Types</option>
            <option value="PET">PET</option>
            <option value="HDPE">HDPE</option>
            <option value="PVC">PVC</option>
            <option value="LDPE">LDPE</option>
            <option value="PP">PP</option>
            <option value="PS">PS</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Quantity</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Points</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Submitted</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.map((contribution) => (
                <tr key={contribution._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6"><span className="font-medium text-gray-800">#{contribution._id?.slice(-6)}</span></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-primary-600 text-sm" />
                      </div>
                      <span>{contribution.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlasticTypeColor(contribution.plasticType)}`}>
                      {contribution.plasticType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FaWeightHanging className="text-gray-400 mr-2" />
                      <span>{contribution.quantity} {contribution.unit || 'kg'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-primary-600">{contribution.pointsEarned}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" size={12} />
                      <span>{format(new Date(contribution.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contribution.status)}`}>
                      {contribution.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => { setSelectedContribution(contribution); setShowDetailsModal(true); }} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FaEye />
                      </button>
                      {contribution.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(contribution)} 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <FaCheckCircle />
                          </button>
                          <button 
                            onClick={() => { setSelectedContribution(contribution); setShowRejectModal(true); }} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No contributions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContributions.length)} of {filteredContributions.length}</p>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg disabled:opacity-50"><FaChevronLeft /></button>
              <span className="px-3 py-1 text-sm">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg disabled:opacity-50"><FaChevronRight /></button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal - COMPLETE WITH IMAGES, LOCATION, NOTES */}
      <AnimatePresence>
        {showDetailsModal && selectedContribution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Contribution Details</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                </div>

                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg ${
                    selectedContribution.status === 'approved' ? 'bg-green-50 border border-green-200' : 
                    selectedContribution.status === 'rejected' ? 'bg-red-50 border border-red-200' : 
                    'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div className="flex items-center space-x-3">
                        {selectedContribution.status === 'approved' && <FaCheckCircle className="text-green-600 text-2xl" />}
                        {selectedContribution.status === 'rejected' && <FaTimesCircle className="text-red-600 text-2xl" />}
                        {selectedContribution.status === 'pending' && <FaRecycle className="text-yellow-600 text-2xl" />}
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            Status: <span className="capitalize">{selectedContribution.status}</span>
                          </p>
                          {selectedContribution.status === 'pending' && (
                            <p className="text-sm text-gray-600 mt-1">This contribution is waiting for your review</p>
                          )}
                        </div>
                      </div>
                      {selectedContribution.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              handleApprove(selectedContribution);
                              setShowDetailsModal(false);
                            }}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <FaCheckCircle />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowDetailsModal(false);
                              setShowRejectModal(true);
                            }}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                          >
                            <FaTimesCircle />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User & Collection Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">User Information</p>
                      <p className="font-semibold text-gray-800">{selectedContribution.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{selectedContribution.user?.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Collection Point</p>
                      <p className="font-semibold text-gray-800">{selectedContribution.collectionPoint || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Contribution Details */}
                  <div className="border rounded-lg p-5">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">Contribution Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Plastic Type</p>
                        <p className="font-medium text-gray-800 mt-1">{selectedContribution.plasticType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-medium text-gray-800 mt-1">{selectedContribution.quantity} {selectedContribution.unit || 'kg'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Points Earned</p>
                        <p className="font-medium text-primary-600 mt-1">{selectedContribution.pointsEarned}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Submitted Date</p>
                        <p className="font-medium text-gray-800 mt-1">{format(new Date(selectedContribution.createdAt), 'PPP')}</p>
                      </div>
                    </div>
                  </div>

                  {/* LOCATION SECTION */}
                  {selectedContribution.location && selectedContribution.location.coordinates && (
                    <div className="border rounded-lg p-5">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-primary-500" />
                        Location Details
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Latitude</p>
                            <p className="font-mono text-sm text-gray-700 mt-1">{selectedContribution.location.coordinates[1]?.toFixed(6)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Longitude</p>
                            <p className="font-mono text-sm text-gray-700 mt-1">{selectedContribution.location.coordinates[0]?.toFixed(6)}</p>
                          </div>
                        </div>
                        <a 
                          href={`https://www.google.com/maps?q=${selectedContribution.location.coordinates[1]},${selectedContribution.location.coordinates[0]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 text-sm inline-flex items-center hover:underline"
                        >
                          <FaLocationArrow className="mr-1" size={12} />
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  )}

                  {/* IMAGES SECTION */}
                  {selectedContribution.images && selectedContribution.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <FaCamera className="mr-2 text-primary-500" />
                        Uploaded Images ({selectedContribution.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedContribution.images.map((image, index) => (
                          <div key={index} className="group">
                            <div 
                              className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative"
                              onClick={() => window.open(image.url, '_blank')}
                            >
                              <img 
                                src={image.url} 
                                alt={`Contribution ${index + 1}`} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Click to enlarge</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {image.uploadedAt ? format(new Date(image.uploadedAt), 'MMM dd, yyyy') : 'Unknown date'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NOTES SECTION */}
                  {selectedContribution.notes && (
                    <div className="border rounded-lg p-5">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <FaNotesMedical className="mr-2 text-primary-500" />
                        Additional Notes
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedContribution.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Empty State for missing data */}
                  {!selectedContribution.location && !selectedContribution.images?.length && !selectedContribution.notes && (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      <p>No additional information provided</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedContribution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Reject Contribution</h2>
              <p className="text-gray-600 mb-4">Please provide a reason for rejecting this contribution:</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Poor quality, incorrect type, insufficient quantity..."
                rows="4"
                className="input-field mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button onClick={() => setShowRejectModal(false)} className="btn-outline">Cancel</button>
                <button onClick={handleReject} disabled={!rejectionReason.trim()} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">Reject</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApproveContributions;
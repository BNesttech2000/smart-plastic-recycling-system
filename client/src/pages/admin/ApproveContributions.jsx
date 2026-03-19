import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
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
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Mock data - replace with actual API calls
const mockContributions = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  userId: Math.floor(Math.random() * 100) + 1,
  userName: `User ${Math.floor(Math.random() * 100) + 1}`,
  plasticType: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'][Math.floor(Math.random() * 7)],
  quantity: (Math.random() * 50 + 0.5).toFixed(1),
  unit: 'kg',
  points: Math.floor(Math.random() * 500) + 50,
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  collectionPoint: ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone', 'Chipata'][Math.floor(Math.random() * 5)],
  collectionDate: new Date(2024, 2, Math.floor(Math.random() * 28) + 1),
  submittedDate: new Date(2024, 2, Math.floor(Math.random() * 28) + 1),
  images: Math.random() > 0.5 ? [1, 2, 3] : [],
  notes: Math.random() > 0.7 ? 'Additional notes about this contribution' : null,
  location: {
    lat: -15.3875 + (Math.random() - 0.5) * 2,
    lng: 28.3228 + (Math.random() - 0.5) * 2,
  },
}));

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

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContributions(mockContributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      toast.error('Failed to fetch contributions');
    } finally {
      setLoading(false);
    }
  };

  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = contribution.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.id.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || contribution.status === filterStatus;
    const matchesType = filterType === 'all' || contribution.plasticType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContributions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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

  const handleApprove = async (contribution) => {
    try {
      // Replace with actual API call
      setContributions(contributions.map(c => 
        c.id === contribution.id ? { ...c, status: 'approved' } : c
      ));
      toast.success('Contribution approved successfully');
    } catch (error) {
      toast.error('Failed to approve contribution');
    }
  };

  const handleReject = async () => {
    try {
      // Replace with actual API call
      setContributions(contributions.map(c => 
        c.id === selectedContribution.id ? { ...c, status: 'rejected' } : c
      ));
      toast.success('Contribution rejected');
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject contribution');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Approve Contributions</h1>
          <p className="text-gray-600">Review and verify user contributions</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FaDownload />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FaPrint />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-gray-800">
                {contributions.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaRecycle className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Approved Today</p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rejected Today</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FaTimesCircle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Response Time</p>
              <p className="text-3xl font-bold text-primary-600">2.5h</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <FaCalendarAlt className="text-primary-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
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

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
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
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <FaTag className="text-gray-400" />
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
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                <motion.tr
                  key={contribution.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-800">#{contribution.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-primary-600 text-sm" />
                      </div>
                      <span className="text-gray-800">{contribution.userName}</span>
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
                      <span>{contribution.quantity} {contribution.unit}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-primary-600">{contribution.points}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" size={12} />
                      <span className="text-sm text-gray-600">
                        {format(contribution.submittedDate, 'MMM dd, yyyy')}
                      </span>
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
                        onClick={() => {
                          setSelectedContribution(contribution);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {contribution.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(contribution)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContribution(contribution);
                              setShowRejectModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContributions.length)} of {filteredContributions.length} contributions
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
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
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Contribution Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg ${
                    selectedContribution.status === 'approved' ? 'bg-green-50' :
                    selectedContribution.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {selectedContribution.status === 'approved' && <FaCheckCircle className="text-green-600 text-xl" />}
                        {selectedContribution.status === 'rejected' && <FaTimesCircle className="text-red-600 text-xl" />}
                        {selectedContribution.status === 'pending' && <FaRecycle className="text-yellow-600 text-xl" />}
                        <div>
                          <p className="font-medium text-gray-800">
                            Status: <span className="capitalize">{selectedContribution.status}</span>
                          </p>
                          {selectedContribution.status === 'pending' && (
                            <p className="text-sm text-gray-600">This contribution is waiting for review</p>
                          )}
                        </div>
                      </div>
                      {selectedContribution.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              handleApprove(selectedContribution);
                              setShowDetailsModal(false);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setShowDetailsModal(false);
                              setShowRejectModal(true);
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">User</p>
                      <p className="font-medium text-gray-800">{selectedContribution.userName}</p>
                      <p className="text-sm text-gray-600">ID: #{selectedContribution.userId}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Collection Point</p>
                      <p className="font-medium text-gray-800">{selectedContribution.collectionPoint}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <FaMapMarkerAlt className="mr-1" size={10} />
                        {selectedContribution.location.lat.toFixed(4)}, {selectedContribution.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {/* Contribution Details */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Contribution Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Plastic Type</p>
                        <p className="font-medium text-gray-800">{selectedContribution.plasticType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium text-gray-800">{selectedContribution.quantity} {selectedContribution.unit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Points Earned</p>
                        <p className="font-medium text-primary-600">{selectedContribution.points}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Collection Date</p>
                        <p className="font-medium text-gray-800">{format(selectedContribution.collectionDate, 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted Date</p>
                        <p className="font-medium text-gray-800">{format(selectedContribution.submittedDate, 'PPP')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  {selectedContribution.images && selectedContribution.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Uploaded Images</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedContribution.images.map((_, index) => (
                          <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <FaRecycle className="text-gray-400 text-3xl" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedContribution.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Additional Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3">
                        <FaNotesMedical className="text-gray-400 mt-1" />
                        <p className="text-gray-700">{selectedContribution.notes}</p>
                      </div>
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
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Reject Contribution</h2>
                <p className="text-gray-600 mb-4">
                  Please provide a reason for rejecting this contribution:
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Poor quality, incorrect type, insufficient quantity..."
                  rows="4"
                  className="input-field mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim()}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ApproveContributions;
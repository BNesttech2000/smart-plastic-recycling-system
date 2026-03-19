import React, { useState, useEffect } from 'react';
import {
  FaRecycle,
  FaTrophy,
  FaStar,
  FaGift,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowLeft,
  FaMedal,
  FaCoins,
  FaCalendarAlt
} from 'react-icons/fa';
import { userService } from '../../services/userService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
  AWARDED: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
  REDEEMED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaGift },
  EXPIRED: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FaTimesCircle },
};

const IncentiveHistory = () => {
  const [loading, setLoading] = useState(true);
  const [incentives, setIncentives] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchIncentives();
  }, []);

  const fetchIncentives = async () => {
    try {
      const response = await userService.getIncentives();
      setIncentives(response.data.incentives);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching incentives:', error);
      toast.error('Failed to load incentives');
    } finally {
      setLoading(false);
    }
  };

  const filteredIncentives = filter === 'ALL' 
    ? incentives 
    : incentives.filter(i => i.rewardStatus === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Incentive History</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-gray-800">{summary?.totalPoints || 0}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FaStar className="text-primary-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Awarded</p>
                <p className="text-3xl font-bold text-green-600">{summary?.totalAwarded || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Redeemed</p>
                <p className="text-3xl font-bold text-blue-600">{summary?.totalRedeemed || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaGift className="text-blue-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{summary?.totalPending || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaHourglassHalf className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'AWARDED', 'REDEEMED', 'EXPIRED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Incentives List */}
        <div className="space-y-4">
          {filteredIncentives.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Incentives Found</h3>
              <p className="text-gray-500 mb-4">
                Start contributing to earn incentives and rewards!
              </p>
              <Link to="/submit-contribution" className="btn-primary inline-flex items-center">
                <FaRecycle className="mr-2" /> Submit Contribution
              </Link>
            </div>
          ) : (
            filteredIncentives.map((incentive, index) => {
              const StatusIcon = statusColors[incentive.rewardStatus]?.icon || FaClock;
              const statusColor = statusColors[incentive.rewardStatus] || statusColors.PENDING;

              return (
                <motion.div
                  key={incentive._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start space-x-4">
                      <div className={`${statusColor.bg} p-3 rounded-full`}>
                        <StatusIcon className={`${statusColor.text} text-xl`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {incentive.pointsEarned} Points
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                            {incentive.rewardStatus}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            Awarded: {format(new Date(incentive.awardedDate), 'PPP')}
                          </p>
                          {incentive.expiryDate && (
                            <p className="flex items-center">
                              <FaClock className="mr-2 text-gray-400" />
                              Expires: {format(new Date(incentive.expiryDate), 'PPP')}
                            </p>
                          )}
                          {incentive.rewardCode && (
                            <p className="flex items-center">
                              <FaGift className="mr-2 text-gray-400" />
                              Reward Code: <span className="font-mono font-medium ml-1">{incentive.rewardCode}</span>
                            </p>
                          )}
                          {incentive.description && (
                            <p className="text-gray-500 mt-2">{incentive.description}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                      {incentive.contribution && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">From Contribution</p>
                          <p className="font-medium text-gray-800">
                            {incentive.contribution.quantity}kg {incentive.contribution.plasticType}
                          </p>
                        </div>
                      )}

                      {incentive.rewardStatus === 'AWARDED' && incentive.rewardCode && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(incentive.rewardCode);
                            toast.success('Reward code copied to clipboard!');
                          }}
                          className="btn-outline text-sm"
                        >
                          Copy Code
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for Points */}
                  {incentive.rewardStatus === 'PENDING' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Verification Progress</span>
                        <span className="text-gray-600">Pending</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default IncentiveHistory;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rewardsService } from '../../services/rewardsService';
import { FaGift, FaStar, FaShoppingCart, FaCheck, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RewardsStore = () => {
  const { user, userPoints } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await rewardsService.getRewards();
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    if (userPoints < reward.points) {
      toast.error(`You need ${reward.points - userPoints} more points to redeem this reward`);
      return;
    }
    setSelectedReward(reward);
    setShowConfirmModal(true);
  };

  const confirmRedeem = async () => {
    setRedeeming(true);
    try {
      const response = await rewardsService.redeemReward(selectedReward.id);
      if (response.success) {
        toast.success(`Successfully redeemed ${selectedReward.name}!`);
        setShowConfirmModal(false);
        fetchRewards(); // Refresh rewards list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Points */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Rewards Store</h1>
              <p className="text-primary-100">Redeem your points for exciting rewards!</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-6 py-3 text-center">
              <p className="text-sm">Your Points</p>
              <p className="text-3xl font-bold">{userPoints}</p>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={reward.imageUrl || '/placeholder-reward.png'}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
                {reward.points <= userPoints && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Available
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{reward.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-bold text-gray-800">{reward.points}</span>
                    <span className="text-gray-500 text-sm">points</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <FaGift />
                    <span>{reward.stock > 0 ? `${reward.stock} left` : 'Out of stock'}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={reward.points > userPoints || reward.stock === 0}
                  className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    reward.points <= userPoints && reward.stock > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaShoppingCart />
                  <span>Redeem</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {rewards.length === 0 && (
          <div className="text-center py-12">
            <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rewards Available</h3>
            <p className="text-gray-500">Check back soon for exciting rewards!</p>
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirmModal && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Redemption</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to redeem <strong>{selectedReward.name}</strong> for <strong>{selectedReward.points} points</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedeem}
                  disabled={redeeming}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {redeeming ? <FaSpinner className="animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsStore;
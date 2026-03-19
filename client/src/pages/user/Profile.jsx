import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaSave,
  FaArrowLeft,
  FaMedal,
  FaRecycle,
  FaWeightHanging,
  FaStar,
  FaCalendarAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(URL.createObjectURL(file));
      // Here you would typically upload the image to your server
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum': return 'from-purple-500 to-pink-500';
      case 'gold': return 'from-yellow-500 to-orange-500';
      case 'silver': return 'from-gray-400 to-gray-600';
      default: return 'from-amber-600 to-amber-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden mb-6"
        >
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Profile Image */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {user?.name?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <FaCamera />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="ml-36 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Tier Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-r ${getTierColor(user?.rewardTier)} rounded-lg shadow-lg p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <FaMedal className="text-3xl" />
                <span className="text-sm opacity-90">Current Tier</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{user?.rewardTier || 'Bronze'}</h3>
              <p className="text-sm opacity-90">
                {user?.totalPoints || 0} points earned
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <FaRecycle className="mr-2" />
                    <span>Contributions</span>
                  </div>
                  <span className="font-semibold text-gray-800">{user?.totalContributions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <FaWeightHanging className="mr-2" />
                    <span>Total Weight</span>
                  </div>
                  <span className="font-semibold text-gray-800">{user?.totalWeight?.toFixed(1) || 0} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <FaStar className="mr-2" />
                    <span>Total Points</span>
                  </div>
                  <span className="font-semibold text-gray-800">{user?.totalPoints || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>Member Since</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {user?.joinedDate ? format(new Date(user.joinedDate), 'MMM yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                {isEditing ? 'Edit Profile' : 'Profile Information'}
              </h3>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={user?.email}
                        className="input-field pl-10 bg-gray-50"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="+260 97 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className="input-field pl-10"
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center justify-center flex-1"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <FaSave className="mr-2" /> Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                        });
                      }}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-32 text-gray-600">Full Name</div>
                    <div className="flex-1 font-medium text-gray-800">{user?.name}</div>
                  </div>
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-32 text-gray-600">Email</div>
                    <div className="flex-1 font-medium text-gray-800">{user?.email}</div>
                  </div>
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-32 text-gray-600">Phone</div>
                    <div className="flex-1 font-medium text-gray-800">
                      {user?.phone || 'Not provided'}
                    </div>
                  </div>
                  <div className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-32 text-gray-600">Address</div>
                    <div className="flex-1 font-medium text-gray-800">
                      {user?.address || 'Not provided'}
                    </div>
                  </div>
                  <div className="flex items-center py-3">
                    <div className="w-32 text-gray-600">Member Since</div>
                    <div className="flex-1 font-medium text-gray-800">
                      {user?.joinedDate ? format(new Date(user.joinedDate), 'PPP') : 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Notification Settings
                </button>
                <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Deactivate Account
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
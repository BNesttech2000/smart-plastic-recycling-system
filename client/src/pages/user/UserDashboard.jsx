import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import {
  FaRecycle,
  FaTrophy,
  FaWeightHanging,
  FaChartLine,
  FaHistory,
  FaArrowRight,
  FaLeaf,
  FaMedal,
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaSpinner,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gray-200 rounded-xl h-80"></div>
      <div className="bg-gray-200 rounded-xl h-80"></div>
    </div>
  </div>
);

// Contributions List Component
const ContributionsList = ({ contributions, loading, onRetry }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <FaSpinner className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-gray-500">Loading contributions...</p>
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="text-center py-12">
        <FaRecycle className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contributions Yet</h3>
        <p className="text-gray-500 mb-4">Start recycling to see your contributions here!</p>
        <Link to="/submit-contribution" className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          <FaRecycle className="mr-2" /> Submit Contribution
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contributions.map((contribution, index) => (
        <motion.div
          key={contribution._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                contribution.status === 'approved' ? 'bg-green-100' :
                contribution.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <FaRecycle className={`text-xl ${
                  contribution.status === 'approved' ? 'text-green-600' :
                  contribution.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                }`} />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-800">{contribution.quantity} kg</span>
                  <span className="text-sm text-gray-500">{contribution.plasticType}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    contribution.status === 'approved' ? 'bg-green-100 text-green-700' :
                    contribution.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {contribution.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
                  {format(new Date(contribution.createdAt), 'MMM dd, yyyy')}
                </p>
                {contribution.collectionPoint && (
                  <p className="text-xs text-gray-400 mt-1">📍 {contribution.collectionPoint}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Points Earned</p>
              <p className="text-xl font-bold text-primary-600">{contribution.pointsEarned || 0}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await userService.getDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      const response = await userService.getContributions(1, 50);
      if (response.success) {
        setContributions(response.data.contributions);
      }
    } catch (error) {
      console.error('Error fetching contributions:', error);
      toast.error('Failed to load contributions');
    } finally {
      setContributionsLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchContributions()]);
    setRefreshing(false);
    toast.success('Dashboard refreshed!');
  };

  useEffect(() => {
    fetchDashboardData();
    fetchContributions();
  }, [fetchDashboardData, fetchContributions]);

  // Calculate total stats from contributions
  const totalWeight = contributions.reduce((sum, c) => sum + (c.quantity || 0), 0);
  const totalPoints = contributions.reduce((sum, c) => sum + (c.pointsEarned || 0), 0);
  const approvedCount = contributions.filter(c => c.status === 'approved').length;
  const pendingCount = contributions.filter(c => c.status === 'pending').length;

  // Prepare monthly data for chart
  const monthlyData = stats?.monthlyContributions?.map(item => ({
    month: item._id?.month || 0,
    monthName: format(new Date(2024, (item._id?.month || 1) - 1, 1), 'MMM'),
    weight: item.totalWeight || 0,
    points: item.totalPoints || 0,
    count: item.count || 0
  })) || [];

  // Prepare plastic breakdown data
  const plasticData = stats?.plasticBreakdown?.map(item => ({
    name: item._id || 'Other',
    value: item.totalWeight || 0,
    percentage: ((item.totalWeight / totalWeight) * 100).toFixed(1)
  })) || [];

  // If showing history tab
  if (tab === 'history') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
              <FaArrowRight className="mr-2 rotate-180" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Contribution History</h1>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-primary-600 hover:text-primary-700"
            >
              <FaSpinner className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Contributions</p>
              <p className="text-3xl font-bold text-gray-800">{contributions.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Weight</p>
              <p className="text-3xl font-bold text-primary-600">{totalWeight.toFixed(1)} kg</p>
            </div>
          </div>

          {/* Contributions List */}
          <ContributionsList 
            contributions={contributions} 
            loading={contributionsLoading}
            onRetry={fetchContributions}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Submit Contribution',
      description: 'Log your plastic collection',
      icon: FaRecycle,
      color: 'bg-primary-500',
      link: '/submit-contribution',
    },
    {
      title: 'View Incentives',
      description: 'Check your rewards',
      icon: FaTrophy,
      color: 'bg-secondary-500',
      link: '/incentives',
    },
    {
      title: 'Contribution History',
      description: 'See your past submissions',
      icon: FaHistory,
      color: 'bg-green-500',
      link: '/dashboard?tab=history',
    },
    {
      title: 'Update Profile',
      description: 'Manage your account',
      icon: FaStar,
      color: 'bg-purple-500',
      link: '/profile',
    },
  ];

  // Calculate next milestone
  const nextMilestone = 50 - (stats?.totalStats?.weight || 0) % 50;
  const progressToNextMilestone = ((stats?.totalStats?.weight || 0) % 50) / 50 * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Section with Refresh */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'Recycler'}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your recycling journey today.
            </p>
          </motion.div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FaSpinner className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm text-gray-600">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <FaRecycle className="text-primary-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Total Contributions</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {stats?.totalStats?.contributions || 0}
            </div>
            <div className="text-sm text-green-600 flex items-center">
              <FaChartLine className="mr-1" /> Lifetime total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary-100 p-3 rounded-lg">
                <FaWeightHanging className="text-secondary-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Total Weight (kg)</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {stats?.totalStats?.weight?.toFixed(1) || 0} kg
            </div>
            <div className="text-sm text-gray-600">
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                <div 
                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNextMilestone}%` }}
                ></div>
              </div>
              {nextMilestone > 0 ? `${nextMilestone.toFixed(1)} kg to next milestone` : 'Milestone reached! 🎉'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaTrophy className="text-green-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Total Points</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {stats?.totalStats?.points || 0}
            </div>
            <div className="text-sm text-primary-600 flex items-center">
              <FaMedal className="mr-1" /> {stats?.totalStats?.rewardTier || 'Bronze'} Tier
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaStar className="text-purple-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Rank</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">
              #{stats?.rank?.rank || 0}
            </div>
            <div className="text-sm text-gray-600">
              Top {stats?.rank?.percentile || 0}% of recyclers
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Contributions Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Contributions</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#0ea5e9" 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    name="Weight (kg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-72 text-gray-400">
                No data available
              </div>
            )}
          </motion.div>

          {/* Plastic Type Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Plastic Type Breakdown</h3>
            {plasticData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={plasticData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {plasticData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-72 text-gray-400">
                No data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <Link to="/dashboard?tab=history" className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          {contributionsLoading ? (
            <div className="flex justify-center py-8">
              <FaSpinner className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : contributions.length > 0 ? (
            <div className="space-y-4">
              {contributions.slice(0, 5).map((contribution, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      contribution.status === 'approved' ? 'bg-green-100' :
                      contribution.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <FaRecycle className={`text-sm ${
                        contribution.status === 'approved' ? 'text-green-600' :
                        contribution.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {contribution.quantity} kg {contribution.plasticType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {contribution.pointsEarned} points • {format(new Date(contribution.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    contribution.status === 'approved' ? 'bg-green-100 text-green-700' :
                    contribution.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {contribution.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No contributions yet. Start recycling today!
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
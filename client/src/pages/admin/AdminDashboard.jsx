import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  FaUsers,
  FaRecycle,
  FaTrophy,
  FaWeightHanging,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
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
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    timeline: [],
    statusBreakdown: [],
    typeBreakdown: [],
    total: 0,
    totalApproved: 0,
    totalWeight: 0,
    totalPoints: 0,
    userEngagement: { topContributors: [] }
  });
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: 'Total Users',
      value: stats?.total?.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Contributions',
      value: stats?.totalApproved?.toLocaleString() || '0',
      change: '+8.2%',
      trend: 'up',
      icon: FaRecycle,
      color: 'bg-green-500',
    },
    {
      title: 'Total Weight',
      value: `${(stats?.totalWeight / 1000)?.toFixed(1) || '0'}T`,
      change: '+15.3%',
      trend: 'up',
      icon: FaWeightHanging,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Points',
      value: stats?.totalPoints?.toLocaleString() || '0',
      change: '-2.1%',
      trend: 'down',
      icon: FaTrophy,
      color: 'bg-yellow-500',
    },
  ];

  // Loading Skeleton
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Administrator</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg shadow-sm p-1">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button 
            onClick={() => toast.info('Export feature coming soon')}
            className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors"
          >
            <FaDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <card.icon className="text-white text-xl" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend === 'up' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                <span>{card.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{card.value}</div>
            <div className="text-xs text-gray-500">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Contributions Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Contributions Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats?.timeline || []}>
              <defs>
                <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorContributions)" name="Contributions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Contribution Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats?.statusBreakdown || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {(stats?.statusBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Plastic Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Plastic Type Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats?.typeBreakdown || []} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis type="category" dataKey="_id" tick={{ fontSize: 12, fill: '#6b7280' }} width={50} />
              <Tooltip />
              <Bar dataKey="totalWeight" fill="#0ea5e9" name="Weight (kg)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Top Contributors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Contributions</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Total Weight</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Points</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.userEngagement?.topContributors || []).length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">No contributors yet</td>
                </tr>
              ) : (
                stats?.userEngagement?.topContributors?.map((contributor, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{contributor.name}</td>
                    <td className="py-3 px-4 text-gray-600">{contributor.count || 0}</td>
                    <td className="py-3 px-4 text-gray-600">{contributor.totalWeight?.toFixed(1)} kg</td>
                    <td className="py-3 px-4">
                      <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded-full text-xs">
                        {contributor.totalPoints || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">-</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
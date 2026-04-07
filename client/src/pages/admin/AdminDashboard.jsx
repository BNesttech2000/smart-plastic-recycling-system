import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { exportService } from '../../services/exportService';
import { useWebSocket } from '../../hooks/useWebSocket';
import DateRangePicker from '../../components/admin/DateRangePicker';
import {
  FaUsers,
  FaRecycle,
  FaTrophy,
  FaWeightHanging,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
  FaWifi,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../services/api';

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
    totalUsers: 0,
    userEngagement: { topContributors: [] },
    recentActivity: []
  });
  const [dateRange, setDateRange] = useState('month');
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categoryComparison, setCategoryComparison] = useState([]);
  const [customDateRange, setCustomDateRange] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket();

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyTrends();
    fetchCategoryComparison();
  }, [dateRange]);

  // Refresh data when WebSocket message received
  useEffect(() => {
    if (lastMessage) {
      fetchDashboardData();
      fetchMonthlyTrends();
      fetchCategoryComparison();
      toast.info('Dashboard updated with new data!', {
        icon: '🔄',
        duration: 3000,
      });
    }
  }, [lastMessage]);

  const fetchDashboardData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await adminService.getDashboard(dateRange);
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error(response.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      const response = await api.get('/charts/monthly-trends');
      if (response.data.success) {
        setMonthlyTrends(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching monthly trends:', error);
    }
  };

  const fetchCategoryComparison = async () => {
    try {
      const response = await api.get('/charts/category-comparison');
      if (response.data.success) {
        setCategoryComparison(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching category comparison:', error);
    }
  };

  const handleExport = async (type, format) => {
    try {
      toast.loading(`Exporting ${type} as ${format.toUpperCase()}...`, {
        id: 'export-toast',
      });
      
      if (type === 'contributions') {
        if (format === 'csv') {
          await exportService.exportContributionsCSV(customDateRange || {});
        } else if (format === 'excel') {
          await exportService.exportContributionsExcel(customDateRange || {});
        }
      } else if (type === 'users') {
        await exportService.exportUsersCSV();
      } else if (type === 'report') {
        await exportService.exportReportPDF(
          customDateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          customDateRange?.end || new Date(),
          'summary'
        );
      }
      
      toast.success(`Export completed: ${type}.${format}`, {
        id: 'export-toast',
      });
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.', {
        id: 'export-toast',
      });
    }
  };

  const handleDateRangeApply = (range) => {
    setCustomDateRange(range);
    fetchDashboardData(range.start, range.end);
  };

  const summaryCards = [
    {
      title: 'Total Users',
      value: (stats?.totalUsers || stats?.total || 0).toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: FaUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Contributions',
      value: (stats?.totalApproved || stats?.total || 0).toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: FaRecycle,
      color: 'bg-green-500',
    },
    {
      title: 'Total Weight',
      value: `${(stats?.totalWeight || 0).toFixed(1)} kg`,
      change: '+15.3%',
      trend: 'up',
      icon: FaWeightHanging,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Points',
      value: (stats?.totalPoints || 0).toLocaleString(),
      change: '-2.1%',
      trend: 'down',
      icon: FaTrophy,
      color: 'bg-yellow-500',
    },
  ];

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
          {[1, 2, 3, 4, 5, 6].map(i => (
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
          {/* Real-time status indicator */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
            <FaWifi className={isConnected ? 'text-green-500' : 'text-red-500'} />
            <span className="text-xs text-gray-600">
              {isConnected ? 'Live' : 'Offline'}
            </span>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          </div>
          
          {/* Date range buttons */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg shadow-sm p-1">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Export dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              <FaDownload />
              <span>Export</span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b">Contributions</div>
                  <button
                    onClick={() => handleExport('contributions', 'csv')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFileCsv className="text-green-600" />
                    <span>Export as CSV</span>
                  </button>
                  <button
                    onClick={() => handleExport('contributions', 'excel')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFileExcel className="text-green-700" />
                    <span>Export as Excel</span>
                  </button>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-t mt-1">Users</div>
                  <button
                    onClick={() => handleExport('users', 'csv')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFileCsv className="text-blue-600" />
                    <span>Export Users</span>
                  </button>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-t mt-1">Reports</div>
                  <button
                    onClick={() => handleExport('report', 'pdf')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FaFilePdf className="text-red-600" />
                    <span>Generate PDF Report</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker onApply={handleDateRangeApply} />

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

        {/* Contribution Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Contribution Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats?.statusBreakdown || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
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
              <YAxis type="category" dataKey="_id" tick={{ fontSize: 12, fill: '#6b7280' }} width={80} />
              <Tooltip />
              <Bar dataKey="totalWeight" fill="#0ea5e9" name="Weight (kg)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No recent activity</div>
            ) : (
              stats.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium text-gray-800">{activity.user}</span>
                    <span className="text-gray-600 ml-2">{activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(activity.timestamp), 'MMM dd, h:mm a')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trends Chart - NEW */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Monthly Trends</h3>
          <FaChartLine className="text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="weight" fill="#0ea5e9" name="Weight (kg)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="points" stroke="#10b981" name="Points" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Category Comparison Chart - NEW */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Category Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="weight" fill="#0ea5e9" name="Weight (kg)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="points" fill="#f59e0b" name="Points" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
              {!stats?.userEngagement?.topContributors || stats.userEngagement.topContributors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">No contributors yet</td>
                </tr>
              ) : (
                stats.userEngagement.topContributors.map((contributor, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{contributor.name}</td>
                    <td className="py-3 px-4 text-gray-600">{contributor.count || 0}</td>
                    <td className="py-3 px-4 text-gray-600">{contributor.totalWeight?.toFixed(1)} kg</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        {contributor.totalPoints || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {contributor.lastActive !== '-' && contributor.lastActive 
                        ? format(new Date(contributor.lastActive), 'MMM dd, yyyy')
                        : '-'}
                    </td>
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
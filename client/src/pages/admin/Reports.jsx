import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaTable,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaPrint,
  FaEnvelope,
  FaEye,
  FaTrash,
  FaSync,
  FaPlus,
  FaChevronDown,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, subMonths, subYears } from 'date-fns';
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
import toast from 'react-hot-toast';

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: 'Daily Report - March 19, 2024',
    type: 'DAILY',
    generatedDate: new Date(2024, 2, 19, 10, 30),
    generatedBy: 'Admin User',
    format: 'PDF',
    size: '2.4 MB',
    status: 'COMPLETED',
  },
  {
    id: 2,
    title: 'Weekly Report - Week 11, 2024',
    type: 'WEEKLY',
    generatedDate: new Date(2024, 2, 18, 15, 45),
    generatedBy: 'Admin User',
    format: 'EXCEL',
    size: '1.8 MB',
    status: 'COMPLETED',
  },
  {
    id: 3,
    title: 'Monthly Report - March 2024',
    type: 'MONTHLY',
    generatedDate: new Date(2024, 2, 17, 9, 15),
    generatedBy: 'Admin User',
    format: 'PDF',
    size: '3.2 MB',
    status: 'COMPLETED',
  },
  {
    id: 4,
    title: 'Quarterly Report - Q1 2024',
    type: 'QUARTERLY',
    generatedDate: new Date(2024, 2, 16, 14, 20),
    generatedBy: 'Admin User',
    format: 'PDF',
    size: '4.1 MB',
    status: 'COMPLETED',
  },
  {
    id: 5,
    title: 'Custom Report - Jan 15 to Mar 15',
    type: 'CUSTOM',
    generatedDate: new Date(2024, 2, 15, 11, 0),
    generatedBy: 'Admin User',
    format: 'CSV',
    size: '1.2 MB',
    status: 'COMPLETED',
  },
];

// Mock chart data
const contributionData = [
  { month: 'Jan', contributions: 450, weight: 1250, points: 8500 },
  { month: 'Feb', contributions: 520, weight: 1480, points: 10200 },
  { month: 'Mar', contributions: 480, weight: 1320, points: 9100 },
  { month: 'Apr', contributions: 610, weight: 1780, points: 12400 },
  { month: 'May', contributions: 590, weight: 1650, points: 11500 },
  { month: 'Jun', contributions: 670, weight: 1890, points: 13200 },
];

const plasticTypeData = [
  { name: 'PET', value: 35 },
  { name: 'HDPE', value: 25 },
  { name: 'PVC', value: 15 },
  { name: 'LDPE', value: 12 },
  { name: 'PP', value: 8 },
  { name: 'PS', value: 3 },
  { name: 'OTHER', value: 2 },
];

const userGrowthData = [
  { month: 'Jan', users: 120, active: 85 },
  { month: 'Feb', users: 145, active: 102 },
  { month: 'Mar', users: 168, active: 124 },
  { month: 'Apr', users: 192, active: 148 },
  { month: 'May', users: 215, active: 167 },
  { month: 'Jun', users: 250, active: 198 },
];

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    type: 'MONTHLY',
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    format: 'PDF',
    includeCharts: true,
    includeTables: true,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = selectedReportType === 'all'
    ? reports
    : reports.filter(r => r.type === selectedReportType);

  const handleGenerateReport = async () => {
    try {
      // Replace with actual API call
      toast.success('Report generation started. You will be notified when ready.');
      setShowGenerateModal(false);
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const handleDownload = (report) => {
    toast.success(`Downloading ${report.title}`);
  };

  const handleDelete = (reportId) => {
    setReports(reports.filter(r => r.id !== reportId));
    toast.success('Report deleted successfully');
  };

  const getReportTypeColor = (type) => {
    const colors = {
      DAILY: 'bg-blue-100 text-blue-800',
      WEEKLY: 'bg-green-100 text-green-800',
      MONTHLY: 'bg-purple-100 text-purple-800',
      QUARTERLY: 'bg-orange-100 text-orange-800',
      YEARLY: 'bg-red-100 text-red-800',
      CUSTOM: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'PDF': return FaFilePdf;
      case 'EXCEL': return FaFileExcel;
      case 'CSV': return FaFileCsv;
      default: return FaFileAlt;
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
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and download system reports</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaPlus />
            <span>Generate Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <FaSync />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaCalendarAlt className="text-gray-400" />
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              {['week', 'month', 'quarter', 'year'].map((range) => (
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
          </div>
          <div className="flex items-center space-x-2">
            <select className="input-field w-40">
              <option>All Report Types</option>
              <option>Daily Reports</option>
              <option>Weekly Reports</option>
              <option>Monthly Reports</option>
              <option>Custom Reports</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contributions Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Contributions Overview</h3>
            <FaChartLine className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="contributions" stroke="#0ea5e9" name="Contributions" />
              <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#10b981" name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plastic Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Plastic Type Distribution</h3>
            <FaChartPie className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={plasticTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {plasticTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
            <FaChartBar className="text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="users" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorUsers)" name="Total Users" />
              <Area type="monotone" dataKey="active" stroke="#10b981" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Key Metrics</h3>
            <FaTable className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Contributions</span>
              <span className="font-semibold text-gray-800">3,320</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Weight</span>
              <span className="font-semibold text-gray-800">9,370 kg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Points Awarded</span>
              <span className="font-semibold text-gray-800">64,900</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold text-gray-800">198</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Redemption Rate</span>
              <span className="font-semibold text-green-600">78%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Avg. Contribution</span>
              <span className="font-semibold text-gray-800">2.8 kg</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Report</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Generated</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Format</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Size</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report) => {
                const FormatIcon = getFormatIcon(report.format);
                return (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <FaFileAlt className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800">{report.title}</p>
                          <p className="text-sm text-gray-500">By {report.generatedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" size={12} />
                        <span className="text-sm text-gray-600">
                          {format(report.generatedDate, 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <FormatIcon className="text-gray-400" />
                        <span className="text-sm text-gray-600">{report.format}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{report.size}</td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDownload(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <FaDownload />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Email"
                        >
                          <FaEnvelope />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGenerateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Generate New Report</h2>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form className="space-y-6">
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={generateForm.type}
                      onChange={(e) => setGenerateForm({ ...generateForm, type: e.target.value })}
                      className="input-field"
                    >
                      <option value="DAILY">Daily Report</option>
                      <option value="WEEKLY">Weekly Report</option>
                      <option value="MONTHLY">Monthly Report</option>
                      <option value="QUARTERLY">Quarterly Report</option>
                      <option value="YEARLY">Yearly Report</option>
                      <option value="CUSTOM">Custom Range</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={generateForm.startDate}
                        onChange={(e) => setGenerateForm({ ...generateForm, startDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={generateForm.endDate}
                        onChange={(e) => setGenerateForm({ ...generateForm, endDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Export Format
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['PDF', 'EXCEL', 'CSV'].map((format) => (
                        <label
                          key={format}
                          className={`flex items-center justify-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                            generateForm.format === format
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="format"
                            value={format}
                            checked={generateForm.format === format}
                            onChange={(e) => setGenerateForm({ ...generateForm, format: e.target.value })}
                            className="hidden"
                          />
                          {format === 'PDF' && <FaFilePdf className={generateForm.format === format ? 'text-primary-600' : 'text-gray-400'} />}
                          {format === 'EXCEL' && <FaFileExcel className={generateForm.format === format ? 'text-primary-600' : 'text-gray-400'} />}
                          {format === 'CSV' && <FaFileCsv className={generateForm.format === format ? 'text-primary-600' : 'text-gray-400'} />}
                          <span className={generateForm.format === format ? 'text-primary-600' : 'text-gray-600'}>
                            {format}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Include Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Include in Report
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={generateForm.includeCharts}
                          onChange={(e) => setGenerateForm({ ...generateForm, includeCharts: e.target.checked })}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Include Charts & Graphs</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={generateForm.includeTables}
                          onChange={(e) => setGenerateForm({ ...generateForm, includeTables: e.target.checked })}
                          className="h-4 w-4 text-primary-600 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Include Data Tables</span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowGenerateModal(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateReport}
                      className="btn-primary"
                    >
                      Generate Report
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default Reports;
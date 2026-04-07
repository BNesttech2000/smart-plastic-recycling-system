import React, { useState, useEffect } from 'react';
// import { adminService } from '../../services/adminService';
import { adminService } from '../../services/adminService';
import {
  FaFileAlt, FaDownload, FaCalendarAlt, FaChartLine, FaChartPie,
  FaChartBar, FaTable, FaFilePdf, FaFileExcel, FaFileCsv, FaPrint,
  FaEnvelope, FaEye, FaTrash, FaSync, FaPlus, FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../../services/api';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    type: 'MONTHLY',
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    format: 'JSON',
    includeCharts: true,
    includeTables: true,
  });
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchTemplates();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await adminService.getReports();
      if (response.success) {
        setReports(response.data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/reports/templates');
      if (response.success) {
        setTemplates(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await api.post('/reports', generateForm);
      if (response.data.success) {
        toast.success('Report generated successfully!');
        setShowGenerateModal(false);
        fetchReports();
        setGenerateForm({
          type: 'MONTHLY',
          startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
          format: 'JSON',
          includeCharts: true,
          includeTables: true,
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error(error.response?.data?.message || 'Failed to generate report');
    }
  };

  const handleDownload = async (report, format = 'JSON') => {
    try {
      toast.loading(`Downloading ${report.title}...`, { id: 'download' });
      const response = await api.get(`/reports/${report._id}/download?format=${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const extension = format.toLowerCase();
      link.href = url;
      link.setAttribute('download', `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension === 'excel' ? 'xlsx' : extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!', { id: 'download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report', { id: 'download' });
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await api.delete(`/reports/${reportId}`);
        toast.success('Report deleted successfully');
        fetchReports();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete report');
      }
    }
  };

  const handleView = (report) => {
    // Open report details in a modal or new page
    toast.info(`Viewing ${report.title} - Details in console`);
    console.log('Report details:', report);
  };

  const filteredReports = selectedReportType === 'all' 
    ? reports 
    : reports.filter(r => r.reportType === selectedReportType);

  const getReportTypeColor = (type) => {
    const colors = { 
      DAILY: 'bg-blue-100 text-blue-800', 
      WEEKLY: 'bg-green-100 text-green-800', 
      MONTHLY: 'bg-purple-100 text-purple-800', 
      QUARTERLY: 'bg-orange-100 text-orange-800', 
      YEARLY: 'bg-red-100 text-red-800', 
      CUSTOM: 'bg-gray-100 text-gray-800' 
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
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and download system reports</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button 
            onClick={() => setShowGenerateModal(true)} 
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>Generate Report</span>
          </button>
          <button 
            onClick={fetchReports} 
            className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['all', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedReportType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedReportType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'All Reports' : type}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Report</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Date Range</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Generated</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report) => {
                const FormatIcon = getFormatIcon(report.format);
                return (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <FaFileAlt className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800">{report.title}</p>
                          <p className="text-sm text-gray-500">By {report.generatedBy?.name || 'Admin'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-400 mr-2" size={12} />
                        <span className="text-sm">
                          {format(new Date(report.dateRange?.start), 'MMM dd')} - {format(new Date(report.dateRange?.end), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm">
                        {format(new Date(report.generatedDate), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {report.status || 'COMPLETED'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDownload(report, 'JSON')} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download JSON"
                        >
                          <FaDownload />
                        </button>
                        <button 
                          onClick={() => handleDownload(report, 'PDF')} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <FaFilePdf />
                        </button>
                        <button 
                          onClick={() => handleDownload(report, 'CSV')} 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download CSV"
                        >
                          <FaFileCsv />
                        </button>
                        <button 
                          onClick={() => handleView(report)} 
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDelete(report._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No reports found. Click "Generate Report" to create your first report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Generate Report</h2>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={generateForm.type}
                  onChange={(e) => setGenerateForm({ ...generateForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={generateForm.startDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={generateForm.endDate}
                    onChange={(e) => setGenerateForm({ ...generateForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={generateForm.format}
                  onChange={(e) => setGenerateForm({ ...generateForm, format: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="JSON">JSON</option>
                  <option value="PDF">PDF</option>
                  <option value="CSV">CSV</option>
                  <option value="EXCEL">Excel</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={generateForm.includeCharts}
                    onChange={(e) => setGenerateForm({ ...generateForm, includeCharts: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Include Charts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={generateForm.includeTables}
                    onChange={(e) => setGenerateForm({ ...generateForm, includeTables: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Include Tables</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reports;
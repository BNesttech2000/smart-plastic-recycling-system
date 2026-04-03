import React, { useState, useEffect } from 'react';
import {
  FaFileAlt, FaDownload, FaCalendarAlt, FaChartLine, FaChartPie,
  FaChartBar, FaTable, FaFilePdf, FaFileExcel, FaFileCsv, FaPrint,
  FaEnvelope, FaEye, FaTrash, FaSync, FaPlus,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

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
    setLoading(true);
    try {
      const response = await adminService.getReports();
      if (response.success) {
        setReports(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = selectedReportType === 'all' ? reports : reports.filter(r => r.type === selectedReportType);

  const handleGenerateReport = async () => {
    try {
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
    const colors = { DAILY: 'bg-blue-100 text-blue-800', WEEKLY: 'bg-green-100 text-green-800', MONTHLY: 'bg-purple-100 text-purple-800', QUARTERLY: 'bg-orange-100 text-orange-800', YEARLY: 'bg-red-100 text-red-800', CUSTOM: 'bg-gray-100 text-gray-800' };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getFormatIcon = (format) => {
    switch (format) { case 'PDF': return FaFilePdf; case 'EXCEL': return FaFileExcel; case 'CSV': return FaFileCsv; default: return FaFileAlt; }
  };

  if (loading) {
    return <div className="animate-pulse"><div className="h-8 bg-gray-200 rounded w-48 mb-8"></div><div className="h-12 bg-gray-200 rounded mb-8"></div><div className="bg-gray-200 rounded-lg h-96"></div></div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1><p className="text-gray-600">Generate and download system reports</p></div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button onClick={() => setShowGenerateModal(true)} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"><FaPlus /><span>Generate Report</span></button>
          <button onClick={fetchReports} className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"><FaSync /><span>Refresh</span></button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold text-gray-800">Generated Reports</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Report</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Generated</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Format</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report) => {
                const FormatIcon = getFormatIcon(report.format);
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6"><div className="flex items-center space-x-3"><FaFileAlt className="text-gray-400" /><div><p className="font-medium text-gray-800">{report.title}</p><p className="text-sm text-gray-500">By {report.generatedBy}</p></div></div></td>
                    <td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>{report.type}</span></td>
                    <td className="py-4 px-6"><div className="flex items-center"><FaCalendarAlt className="text-gray-400 mr-2" size={12} /><span className="text-sm">{format(new Date(report.generatedDate), 'MMM dd, yyyy HH:mm')}</span></div></td>
                    <td className="py-4 px-6"><div className="flex items-center space-x-2"><FormatIcon className="text-gray-400" /><span className="text-sm">{report.format}</span></div></td>
                    <td className="py-4 px-6"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">COMPLETED</span></td>
                    <td className="py-4 px-6"><div className="flex items-center space-x-2"><button onClick={() => handleDownload(report)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaDownload /></button><button className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><FaEye /></button><button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"><FaEnvelope /></button><button onClick={() => handleDelete(report.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button></div></td>
                  </tr>
                );
              })}
              {filteredReports.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No reports found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Reports;
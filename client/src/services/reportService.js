import api from './api';

export const reportService = {
  // Get all reports with optional filters
  getReports: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await api.get(`/reports?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get single report by ID
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Generate new report
  generateReport: async (reportConfig) => {
    try {
      const response = await api.post('/reports', reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // Download report in specified format
  downloadReport: async (reportId, format = 'PDF') => {
    try {
      const response = await api.get(`/reports/${reportId}/download?format=${format}`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },

  // Delete report
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  // Get report templates
  getReportTemplates: async () => {
    try {
      const response = await api.get('/reports/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching report templates:', error);
      throw error;
    }
  },

  // Schedule automated report
  scheduleReport: async (scheduleConfig) => {
    try {
      const response = await api.post('/reports/schedule', scheduleConfig);
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  },

  // Get scheduled reports
  getScheduledReports: async () => {
    try {
      const response = await api.get('/reports/scheduled');
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      throw error;
    }
  },

  // Delete scheduled report
  deleteScheduledReport: async (scheduleId) => {
    try {
      const response = await api.delete(`/reports/scheduled/${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      throw error;
    }
  },

  // Export report data (for custom exports)
  exportData: async (data, format = 'CSV', filename = 'export') => {
    try {
      const response = await api.post('/reports/export', { data, format }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${filename}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  // Get report statistics
  getReportStatistics: async () => {
    try {
      const response = await api.get('/reports/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching report statistics:', error);
      throw error;
    }
  },

  // Compare reports
  compareReports: async (reportIds) => {
    try {
      const response = await api.post('/reports/compare', { reportIds });
      return response.data;
    } catch (error) {
      console.error('Error comparing reports:', error);
      throw error;
    }
  },

  // Share report via email
  shareReport: async (reportId, email, message = '') => {
    try {
      const response = await api.post(`/reports/${reportId}/share`, { email, message });
      return response.data;
    } catch (error) {
      console.error('Error sharing report:', error);
      throw error;
    }
  },

  // Get report formats
  getFormats: () => {
    return [
      { value: 'PDF', label: 'PDF Document', icon: 'file-pdf', mimeType: 'application/pdf' },
      { value: 'EXCEL', label: 'Excel Spreadsheet', icon: 'file-excel', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { value: 'CSV', label: 'CSV File', icon: 'file-csv', mimeType: 'text/csv' },
      { value: 'JSON', label: 'JSON Data', icon: 'file-code', mimeType: 'application/json' },
    ];
  },

  // Get report types
  getTypes: () => {
    return [
      { value: 'DAILY', label: 'Daily Report', description: 'Daily summary of activities' },
      { value: 'WEEKLY', label: 'Weekly Report', description: 'Weekly trends and analysis' },
      { value: 'MONTHLY', label: 'Monthly Report', description: 'Monthly performance review' },
      { value: 'QUARTERLY', label: 'Quarterly Report', description: 'Quarterly business review' },
      { value: 'YEARLY', label: 'Yearly Report', description: 'Annual summary and insights' },
      { value: 'CUSTOM', label: 'Custom Report', description: 'Custom date range and metrics' },
    ];
  },
};
// client/src/services/exportService.js
import api from './api';

export const exportService = {
  exportContributionsCSV: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/export/contributions/csv?${params}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contributions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  exportUsersCSV: async () => {
    const response = await api.get('/export/users/csv', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  exportReportPDF: async (startDate, endDate, reportType = 'summary') => {
    const response = await api.post('/export/report/pdf', {
      startDate,
      endDate,
      reportType
    }, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  exportContributionsExcel: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/export/contributions/excel?${params}`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contributions_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
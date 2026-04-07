// server/src/controllers/reportController.js
const Report = require('../models/Report');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  try {
    // Make sure req.user exists
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    const reports = await Report.find({ generatedBy: req.user._id })
      .sort({ generatedDate: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: {
        reports: reports,
        pagination: {
          page: 1,
          limit: 50,
          total: reports.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getReports:', error);
    res.json({
      success: true,
      data: {
        reports: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      }
    });
  }
});

// @desc    Generate new report
// @route   POST /api/reports
// @access  Private/Admin
const generateReport = asyncHandler(async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    console.log('Generating report for user:', req.user._id);
    
    const { type, startDate, endDate, format = 'JSON', includeCharts, includeTables } = req.body;
    
    // Create report title
    const title = `${type} Report - ${new Date().toLocaleDateString()}`;
    
    // Create the report
    const report = await Report.create({
      title: title,
      reportType: type,
      generatedBy: req.user._id,
      generatedDate: new Date(),
      dateRange: {
        start: startDate ? new Date(startDate) : new Date(),
        end: endDate ? new Date(endDate) : new Date()
      },
      format: format,
      status: 'COMPLETED',
      summary: {
        message: 'Report generated successfully',
        generatedAt: new Date(),
        includeCharts: includeCharts || false,
        includeTables: includeTables || false
      }
    });
    
    console.log('Report created successfully:', report._id);
    
    res.status(201).json({
      success: true,
      data: report,
      message: 'Report generated successfully'
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get report templates
// @route   GET /api/reports/templates
// @access  Private/Admin
const getReportTemplates = asyncHandler(async (req, res) => {
  const templates = [
    { id: 'daily', name: 'Daily Report', type: 'DAILY', description: 'Daily summary of contributions' },
    { id: 'weekly', name: 'Weekly Report', type: 'WEEKLY', description: 'Weekly summary of contributions' },
    { id: 'monthly', name: 'Monthly Report', type: 'MONTHLY', description: 'Monthly summary of contributions' },
    { id: 'quarterly', name: 'Quarterly Report', type: 'QUARTERLY', description: 'Quarterly summary of contributions' },
    { id: 'yearly', name: 'Yearly Report', type: 'YEARLY', description: 'Yearly summary of contributions' },
    { id: 'custom', name: 'Custom Report', type: 'CUSTOM', description: 'Custom date range report' }
  ];
  
  res.json({ success: true, data: templates });
});

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private/Admin
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  res.json({ success: true, data: report });
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private/Admin
const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  const { format = 'JSON' } = req.query;
  
  // Return report data based on format
  if (format === 'JSON') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.json`);
    return res.json(report);
  } else {
    // For other formats, just return the report data
    res.json({
      success: true,
      data: report,
      message: `Download ready in ${format} format (implementation coming soon)`
    });
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  
  await report.deleteOne();
  
  res.json({
    success: true,
    message: 'Report deleted successfully'
  });
});

module.exports = {
  getReports,
  getReportById,
  generateReport,
  downloadReport,
  deleteReport,
  getReportTemplates
};
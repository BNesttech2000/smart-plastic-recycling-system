// server/src/controllers/reportController.js
const Report = require('../models/Report');
const User = require('../models/User');
const PlasticContribution = require('../models/PlasticContribution');
const { asyncHandler } = require('../middleware/errorMiddleware');
const PDFDocument = require('pdfkit');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  try {
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
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    console.log('Generating report for user:', req.user._id);
    
    const { type, startDate, endDate, format = 'JSON', includeCharts, includeTables } = req.body;
    
    // Calculate date range
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    
    console.log('Date range:', { start, end });
    
    // Get contributions in date range
    const contributions = await PlasticContribution.find({
      createdAt: { $gte: start, $lte: end },
      status: 'approved'
    }).populate('user', 'name');
    
    console.log('Found contributions:', contributions.length);
    
    const totalUsers = await User.countDocuments();
    const totalWeight = contributions.reduce((sum, c) => sum + (c.quantity || 0), 0);
    const totalPoints = contributions.reduce((sum, c) => sum + (c.pointsEarned || 0), 0);
    
    // Plastic type breakdown
    const plasticBreakdown = {};
    contributions.forEach(c => {
      const type = c.plasticType || 'OTHER';
      if (!plasticBreakdown[type]) {
        plasticBreakdown[type] = 0;
      }
      plasticBreakdown[type] += c.quantity || 0;
    });
    
    const breakdownArray = Object.entries(plasticBreakdown).map(([type, qty]) => ({
      plasticType: type,
      quantity: qty,
      percentage: totalWeight > 0 ? (qty / totalWeight) * 100 : 0
    }));
    
    // Create the report with REAL data
    const title = `${type} Report - ${new Date().toLocaleDateString()}`;
    
    const report = await Report.create({
      title: title,
      reportType: type,
      generatedBy: req.user._id,
      generatedDate: new Date(),
      dateRange: { start, end },
      format: format || 'JSON',
      status: 'COMPLETED',
      summary: {
        totalContributions: contributions.length,
        totalUsers: totalUsers,
        totalWeight: totalWeight,
        totalPointsAwarded: totalPoints,
        averageContribution: contributions.length > 0 ? totalWeight / contributions.length : 0,
        activeUsers: new Set(contributions.map(c => c.user?._id?.toString())).size,
        includeCharts: includeCharts || false,
        includeTables: includeTables || false
      },
      plasticBreakdown: breakdownArray
    });
    
    console.log('Report created successfully:', report._id);
    console.log('Summary data:', report.summary);
    
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
  
  console.log('Downloading report:', report._id, 'Format:', format);
  console.log('Report summary:', report.summary);
  
  if (format.toUpperCase() === 'PDF') {
    return await downloadAsPDF(report, res);
  } else {
    // For other formats, return JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.json`);
    return res.json(report);
  }
});

// Helper: Download as PDF
const downloadAsPDF = async (report, res) => {
  try {
    console.log('Generating PDF for report:', report._id);
    
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);
    
    doc.pipe(res);
    
    const summary = report.summary || {};
    const breakdown = report.plasticBreakdown || [];
    
    // Header
    doc.fontSize(24).font('Helvetica-Bold').text(report.title || 'Report', { align: 'center' });
    doc.moveDown(0.5);
    
    // Date
    doc.fontSize(12).font('Helvetica');
    doc.text(`Generated: ${new Date(report.generatedDate).toLocaleString()}`, { align: 'center' });
    doc.text(`Report Type: ${report.reportType || 'MONTHLY'}`, { align: 'center' });
    doc.text(`Date Range: ${new Date(report.dateRange?.start).toLocaleDateString()} - ${new Date(report.dateRange?.end).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();
    
    doc.strokeColor('#0ea5e9').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    
    // Summary Section
    doc.fontSize(16).font('Helvetica-Bold').text('Summary Statistics', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    
    const summaryData = [
      ['Total Contributions', summary.totalContributions || 0],
      ['Total Users', summary.totalUsers || 0],
      ['Total Weight (kg)', (summary.totalWeight || 0).toFixed(2)],
      ['Total Points Awarded', summary.totalPointsAwarded || 0],
      ['Average Contribution (kg)', (summary.averageContribution || 0).toFixed(2)],
      ['Active Users', summary.activeUsers || 0]
    ];
    
    summaryData.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`);
    });
    doc.moveDown();
    
    // Plastic Breakdown
    if (breakdown && breakdown.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text('Plastic Type Breakdown', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica');
      
      breakdown.forEach(item => {
        const type = item.plasticType || 'Unknown';
        const qty = (item.quantity || 0).toFixed(2);
        const pct = (item.percentage || 0).toFixed(1);
        doc.text(`${type}: ${qty} kg (${pct}%)`);
      });
      doc.moveDown();
    }
    
    // Footer
    doc.fontSize(10).font('Helvetica').fillColor('gray');
    doc.text('─'.repeat(60), { align: 'center' });
    doc.text('Smart Plastic Collection and Recycling Incentive System', { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} All Rights Reserved`, { align: 'center' });
    
    doc.end();
    
    console.log('✅ PDF generated successfully!');
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Error generating PDF: ' + error.message });
  }
};

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
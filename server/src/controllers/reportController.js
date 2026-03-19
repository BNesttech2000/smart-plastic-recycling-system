// server/src/controllers/reportController.js
const Report = require('../models/Report');
const Administrator = require('../models/Administrator');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  
  const filter = {};
  if (type && type !== 'all') filter.reportType = type;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await Report.find(filter)
    .populate('generatedBy', 'name email')
    .sort({ generatedDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Report.countDocuments(filter);

  res.json({
    success: true,
    data: {
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private/Admin
const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('generatedBy', 'name email');

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  res.json({
    success: true,
    data: report
  });
});

// @desc    Generate new report
// @route   POST /api/reports
// @access  Private/Admin
const generateReport = asyncHandler(async (req, res) => {
  const { type, startDate, endDate, format = 'JSON', includeCharts = true, includeTables = true } = req.body;

  let report;
  
  switch (type) {
    case 'DAILY':
      report = await Report.generateDailyReport(req.admin._id);
      break;
    case 'WEEKLY':
    case 'MONTHLY':
    case 'QUARTERLY':
    case 'YEARLY':
      report = await Report.generateCustomReport(
        req.admin._id,
        type,
        new Date(startDate),
        new Date(endDate)
      );
      break;
    case 'CUSTOM':
      report = await Report.generateCustomReport(
        req.admin._id,
        type,
        new Date(startDate),
        new Date(endDate)
      );
      break;
    default:
      res.status(400);
      throw new Error('Invalid report type');
  }

  // Log admin activity
  const admin = await Administrator.findById(req.admin._id);
  await admin.logActivity('GENERATE_REPORT', req.ip, { reportId: report._id, type });
  await admin.save();

  res.status(201).json({
    success: true,
    data: report,
    message: 'Report generated successfully'
  });
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private/Admin
const downloadReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate('generatedBy', 'name email');

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const { format = 'JSON' } = req.query;

  // Log download activity
  const admin = await Administrator.findById(req.admin._id);
  await admin.logActivity('DOWNLOAD_REPORT', req.ip, { reportId: report._id, format });
  await admin.save();

  switch (format.toUpperCase()) {
    case 'CSV':
      return downloadAsCSV(report, res);
    case 'EXCEL':
      return downloadAsExcel(report, res);
    case 'PDF':
      return downloadAsPDF(report, res);
    default:
      return downloadAsJSON(report, res);
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

  // Log admin activity
  const admin = await Administrator.findById(req.admin._id);
  await admin.logActivity('DELETE_REPORT', req.ip, { reportId: report._id });
  await admin.save();

  res.json({
    success: true,
    message: 'Report deleted successfully'
  });
});

// @desc    Get report templates
// @route   GET /api/reports/templates
// @access  Private/Admin
const getReportTemplates = asyncHandler(async (req, res) => {
  const templates = [
    {
      id: 'daily-summary',
      name: 'Daily Summary Report',
      type: 'DAILY',
      description: 'Overview of daily contributions, user activity, and incentives',
      fields: ['contributions', 'users', 'points', 'weight']
    },
    {
      id: 'weekly-trends',
      name: 'Weekly Trends Report',
      type: 'WEEKLY',
      description: 'Weekly analysis of recycling trends and user engagement',
      fields: ['trends', 'comparisons', 'projections']
    },
    {
      id: 'monthly-performance',
      name: 'Monthly Performance Report',
      type: 'MONTHLY',
      description: 'Comprehensive monthly statistics and performance metrics',
      fields: ['kpis', 'breakdowns', 'rankings']
    },
    {
      id: 'user-engagement',
      name: 'User Engagement Report',
      type: 'CUSTOM',
      description: 'Detailed analysis of user behavior and engagement patterns',
      fields: ['retention', 'activity', 'segments']
    },
    {
      id: 'incentive-analysis',
      name: 'Incentive Analysis Report',
      type: 'CUSTOM',
      description: 'Analysis of incentive distribution and redemption patterns',
      fields: ['redemption', 'tiers', 'conversion']
    }
  ];

  res.json({
    success: true,
    data: templates
  });
});

// Helper functions for different download formats
const downloadAsJSON = (report, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.json`);
  res.json(report);
};

const downloadAsCSV = (report, res) => {
  try {
    const fields = ['title', 'reportType', 'generatedDate', 'summary'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(report.toObject());
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.csv`);
    res.send(csv);
  } catch (error) {
    res.status(500);
    throw new Error('Error generating CSV file');
  }
};

const downloadAsExcel = async (report, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Add title
    worksheet.addRow([report.title]);
    worksheet.addRow([`Generated: ${report.generatedDate}`]);
    worksheet.addRow([]);

    // Add summary
    worksheet.addRow(['SUMMARY']);
    worksheet.addRow(['Metric', 'Value']);
    Object.entries(report.summary).forEach(([key, value]) => {
      worksheet.addRow([key, value]);
    });

    worksheet.addRow([]);

    // Add plastic breakdown
    if (report.plasticBreakdown && report.plasticBreakdown.length > 0) {
      worksheet.addRow(['PLASTIC BREAKDOWN']);
      worksheet.addRow(['Type', 'Quantity', 'Percentage']);
      report.plasticBreakdown.forEach(item => {
        worksheet.addRow([item.plasticType, item.quantity, `${item.percentage}%`]);
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.xlsx`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500);
    throw new Error('Error generating Excel file');
  }
};

const downloadAsPDF = (report, res) => {
  try {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);
    
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text(report.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${report.generatedDate}`);
    doc.text(`Type: ${report.reportType}`);
    doc.moveDown();

    // Add summary
    doc.fontSize(16).text('Summary');
    doc.fontSize(12);
    Object.entries(report.summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`);
    });
    doc.moveDown();

    // Add plastic breakdown
    if (report.plasticBreakdown && report.plasticBreakdown.length > 0) {
      doc.fontSize(16).text('Plastic Breakdown');
      doc.fontSize(12);
      report.plasticBreakdown.forEach(item => {
        doc.text(`${item.plasticType}: ${item.quantity}kg (${item.percentage}%)`);
      });
    }

    doc.end();
  } catch (error) {
    res.status(500);
    throw new Error('Error generating PDF file');
  }
};

module.exports = {
  getReports,
  getReportById,
  generateReport,
  downloadReport,
  deleteReport,
  getReportTemplates
};
// server/src/controllers/exportController.js
const PlasticContribution = require('../models/PlasticContribution');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const json2csv = require('json2csv').parse;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Export contributions to CSV
// @route   GET /api/export/contributions/csv
// @access  Private/Admin
const exportContributionsCSV = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  
  const contributions = await PlasticContribution.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  const csvData = contributions.map(c => ({
    'User Name': c.user?.name || 'Unknown',
    'User Email': c.user?.email || 'Unknown',
    'Plastic Type': c.plasticType,
    'Quantity (kg)': c.quantity,
    'Points Earned': c.pointsEarned,
    'Status': c.status,
    'Collection Point': c.collectionPoint || 'N/A',
    'Submitted Date': c.createdAt.toISOString().split('T')[0],
    'Approved Date': c.approvedDate ? c.approvedDate.toISOString().split('T')[0] : 'N/A'
  }));
  
  const csv = json2csv(csvData);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=contributions_${Date.now()}.csv`);
  res.status(200).send(csv);
});

// @desc    Export users to CSV
// @route   GET /api/export/users/csv
// @access  Private/Admin
const exportUsersCSV = asyncHandler(async (req, res) => {
  const users = await User.find({});
  
  const csvData = users.map(u => ({
    'Name': u.name,
    'Email': u.email,
    'Phone': u.phone || 'N/A',
    'Total Points': u.totalPoints,
    'Total Weight (kg)': u.totalWeight,
    'Total Contributions': u.totalContributions,
    'Reward Tier': u.rewardTier,
    'Status': u.isActive ? 'Active' : 'Inactive',
    'Joined Date': u.joinedDate.toISOString().split('T')[0],
    'Last Contribution': u.lastContribution ? u.lastContribution.toISOString().split('T')[0] : 'Never'
  }));
  
  const csv = json2csv(csvData);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.csv`);
  res.status(200).send(csv);
});

// @desc    Export dashboard report to PDF
// @route   POST /api/export/report/pdf
// @access  Private/Admin
const exportReportPDF = asyncHandler(async (req, res) => {
  const { startDate, endDate, reportType = 'summary' } = req.body;
  
  // Fetch data
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  const contributions = await PlasticContribution.find({
    createdAt: { $gte: start, $lte: end },
    status: 'approved'
  }).populate('user', 'name');
  
  const totalWeight = contributions.reduce((sum, c) => sum + c.quantity, 0);
  const totalPoints = contributions.reduce((sum, c) => sum + c.pointsEarned, 0);
  const uniqueUsers = [...new Set(contributions.map(c => c.user?._id.toString()))].length;
  
  // Group by plastic type
  const typeStats = {};
  contributions.forEach(c => {
    if (!typeStats[c.plasticType]) {
      typeStats[c.plasticType] = { weight: 0, count: 0 };
    }
    typeStats[c.plasticType].weight += c.quantity;
    typeStats[c.plasticType].count += 1;
  });
  
  // Create PDF
  const doc = new PDFDocument({ margin: 50 });
  const filename = `report_${Date.now()}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text('SmartRecycle - Admin Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`, { align: 'center' });
  doc.moveDown();
  
  // Summary
  doc.fontSize(16).text('Summary Statistics', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);
  doc.text(`Total Contributions: ${contributions.length}`);
  doc.text(`Total Weight: ${totalWeight.toFixed(2)} kg`);
  doc.text(`Total Points Awarded: ${totalPoints}`);
  doc.text(`Active Contributors: ${uniqueUsers}`);
  doc.moveDown();
  
  // Plastic Type Breakdown
  doc.fontSize(16).text('Plastic Type Breakdown', { underline: true });
  doc.moveDown(0.5);
  
  Object.entries(typeStats).forEach(([type, stats]) => {
    doc.text(`${type}: ${stats.weight.toFixed(2)} kg (${stats.count} contributions)`);
  });
  
  doc.moveDown();
  
  // Recent Contributions
  doc.fontSize(16).text('Recent Contributions (Last 10)', { underline: true });
  doc.moveDown(0.5);
  
  const recent = contributions.slice(-10).reverse();
  recent.forEach(c => {
    doc.text(`- ${c.quantity}kg ${c.plasticType} by ${c.user?.name || 'Unknown'} on ${c.createdAt.toLocaleDateString()}`);
  });
  
  doc.end();
});

// @desc    Export to Excel (CSV format but with .xlsx extension)
// @route   GET /api/export/contributions/excel
// @access  Private/Admin
const exportContributionsExcel = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  
  const contributions = await PlasticContribution.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  const excelData = contributions.map(c => ({
    'User Name': c.user?.name || 'Unknown',
    'User Email': c.user?.email || 'Unknown',
    'Plastic Type': c.plasticType,
    'Quantity (kg)': c.quantity,
    'Points Earned': c.pointsEarned,
    'Status': c.status,
    'Collection Point': c.collectionPoint || 'N/A',
    'Submitted Date': c.createdAt.toISOString().split('T')[0],
    'Approved Date': c.approvedDate ? c.approvedDate.toISOString().split('T')[0] : 'N/A'
  }));
  
  const csv = json2csv(excelData);
  
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.setHeader('Content-Disposition', `attachment; filename=contributions_${Date.now()}.xls`);
  res.status(200).send(csv);
});

module.exports = {
  exportContributionsCSV,
  exportUsersCSV,
  exportReportPDF,
  exportContributionsExcel
};
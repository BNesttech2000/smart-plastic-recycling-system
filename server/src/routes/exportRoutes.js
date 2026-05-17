// server/src/routes/exportRoutes.js
const express = require('express');
const router = express.Router();
const {
  exportContributionsCSV,
  exportUsersCSV,
  exportUsersExcel,
  exportReportPDF,
  exportContributionsExcel
} = require('../controllers/exportController');
const { protect, admin } = require('../middleware/authMiddleware');

// All export routes require admin authentication
router.use(protect, admin);

router.get('/contributions/csv', exportContributionsCSV);
router.get('/contributions/excel', exportContributionsExcel);
router.get('/users/csv', exportUsersCSV);
router.get('/users/excel', exportUsersExcel);
router.post('/report/pdf', exportReportPDF);

module.exports = router;
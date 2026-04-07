const express = require('express');
const router = express.Router();
const {
  getReports,
  getReportById,
  generateReport,
  downloadReport,
  deleteReport,
  getReportTemplates
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.route('/')
  .get(getReports)
  .post(generateReport);

router.get('/templates', getReportTemplates);
router.get('/:id/download', downloadReport);
router.route('/:id')
  .get(getReportById)
  .delete(deleteReport);

module.exports = router;
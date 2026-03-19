// server/src/routes/contributionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createContribution,
  getContributions,
  getContributionById,
  updateContributionStatus,
  getContributionStatistics,
  uploadContributionImages,
  deleteContributionImage
} = require('../controllers/contributionController');
const {
  validateContribution,
  validate
} = require('../middleware/validationMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, optimizeImages, cleanupTempFiles } = require('../middleware/uploadMiddleware');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', validateContribution, validate, createContribution);
router.post('/:id/images', 
  upload.array('images', 5),
  optimizeImages,
  cleanupTempFiles,
  uploadContributionImages
);
router.delete('/:id/images/:imageId', deleteContributionImage);

// Admin routes
router.get('/', admin, getContributions);
router.get('/statistics', admin, getContributionStatistics);
router.get('/:id', getContributionById);
router.put('/:id/status', admin, updateContributionStatus);

module.exports = router;
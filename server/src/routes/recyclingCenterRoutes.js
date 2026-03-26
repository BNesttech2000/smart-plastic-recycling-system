const express = require('express');
const router = express.Router();
const {
  getRecyclingCenters,
  getNearbyCenters,
  getCenterById
} = require('../controllers/recyclingCenterController');

// Public routes
router.get('/', getRecyclingCenters);
router.get('/nearby', getNearbyCenters);
router.get('/:id', getCenterById);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getAllRecyclingCenters,
  createRecyclingCenter,
  updateRecyclingCenter,
  deleteRecyclingCenter
} = require('../controllers/recyclingCenterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getAllRecyclingCenters);
router.post('/', createRecyclingCenter);
router.put('/:id', updateRecyclingCenter);
router.delete('/:id', deleteRecyclingCenter);

module.exports = router;
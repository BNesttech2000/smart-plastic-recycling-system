const express = require('express');
const router = express.Router();
const {
  getAllRewards,
  createReward,
  updateReward,
  deleteReward
} = require('../controllers/rewardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getAllRewards);
router.post('/', createReward);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);

module.exports = router;
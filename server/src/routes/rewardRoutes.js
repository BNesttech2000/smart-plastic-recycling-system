const express = require('express');
const router = express.Router();
const {
  getRewards,
  getRewardById,
  redeemReward,
  getUserRedemptions
} = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRewards);
router.get('/my-redemptions', getUserRedemptions);
router.get('/:id', getRewardById);
router.post('/:id/redeem', redeemReward);

module.exports = router;
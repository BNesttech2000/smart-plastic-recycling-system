const Reward = require('../models/Reward');
const RewardRedemption = require('../models/RewardRedemption');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all rewards
// @route   GET /api/rewards
// @access  Private
const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({ isActive: true }).sort({ points: 1 });
  res.json({ success: true, data: rewards });
});

// @desc    Get single reward
// @route   GET /api/rewards/:id
// @access  Private
const getRewardById = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }
  res.json({ success: true, data: reward });
});

// @desc    Redeem a reward
// @route   POST /api/rewards/:id/redeem
// @access  Private
const redeemReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }
  
  if (reward.stock <= 0) {
    res.status(400);
    throw new Error('Reward out of stock');
  }
  
  const user = await User.findById(req.user._id);
  
  if (user.totalPoints < reward.points) {
    res.status(400);
    throw new Error('Insufficient points');
  }
  
  // Deduct points
  user.totalPoints -= reward.points;
  await user.save();
  
  // Reduce stock
  reward.stock -= 1;
  await reward.save();
  
  // Create redemption record
  const redemption = await RewardRedemption.create({
    user: user._id,
    reward: reward._id,
    pointsSpent: reward.points,
    status: 'completed'
  });
  
  res.json({
    success: true,
    data: redemption,
    message: `Successfully redeemed ${reward.name}!`
  });
});

// @desc    Get user's redemptions
// @route   GET /api/rewards/my-redemptions
// @access  Private
const getUserRedemptions = asyncHandler(async (req, res) => {
  const redemptions = await RewardRedemption.find({ user: req.user._id })
    .populate('reward', 'name points imageUrl')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, data: redemptions });
});

// ============ ADMIN CONTROLLERS ============

// @desc    Create reward (Admin)
// @route   POST /api/admin/rewards
// @access  Private/Admin
const createReward = asyncHandler(async (req, res) => {
  const { name, description, points, stock, imageUrl } = req.body;
  
  const reward = await Reward.create({
    name,
    description,
    points,
    stock: stock || 0,
    imageUrl: imageUrl || ''
  });
  
  res.status(201).json({ success: true, data: reward });
});

// @desc    Update reward (Admin)
// @route   PUT /api/admin/rewards/:id
// @access  Private/Admin
const updateReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }
  
  const { name, description, points, stock, imageUrl, isActive } = req.body;
  
  reward.name = name || reward.name;
  reward.description = description || reward.description;
  reward.points = points !== undefined ? points : reward.points;
  reward.stock = stock !== undefined ? stock : reward.stock;
  reward.imageUrl = imageUrl !== undefined ? imageUrl : reward.imageUrl;
  reward.isActive = isActive !== undefined ? isActive : reward.isActive;
  
  await reward.save();
  
  res.json({ success: true, data: reward });
});

// @desc    Delete reward (Admin)
// @route   DELETE /api/admin/rewards/:id
// @access  Private/Admin
const deleteReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  
  if (!reward) {
    res.status(404);
    throw new Error('Reward not found');
  }
  
  await reward.deleteOne();
  
  res.json({ success: true, message: 'Reward deleted successfully' });
});

// @desc    Get all rewards (Admin)
// @route   GET /api/admin/rewards
// @access  Private/Admin
const getAllRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: rewards });
});

module.exports = {
  getRewards,
  getRewardById,
  redeemReward,
  getUserRedemptions,
  createReward,
  updateReward,
  deleteReward,
  getAllRewards
};
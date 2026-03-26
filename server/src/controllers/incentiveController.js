// server/src/controllers/incentiveController.js
const Incentive = require('../models/Incentive');
const User = require('../models/User');
const PlasticContribution = require('../models/PlasticContribution');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { calculateIncentivePoints, getRewardTier } = require('../utils/incentiveCalculator');

// @desc    Get all incentives
// @route   GET /api/incentives
// @access  Private/Admin
const getIncentives = asyncHandler(async (req, res) => {
  const { status, userId, startDate, endDate, page = 1, limit = 20 } = req.query;
  
  const filter = {};
  if (status) filter.rewardStatus = status;
  if (userId) filter.user = userId;
  
  if (startDate || endDate) {
    filter.awardedDate = {};
    if (startDate) filter.awardedDate.$gte = new Date(startDate);
    if (endDate) filter.awardedDate.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const incentives = await Incentive.find(filter)
    .populate('user', 'name email')
    .populate('contribution', 'plasticType quantity')
    .populate('redeemedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Incentive.countDocuments(filter);

  // Get summary statistics
  const summary = await Incentive.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalPoints: { $sum: '$pointsEarned' },
        totalAwarded: { $sum: { $cond: [{ $eq: ['$rewardStatus', 'AWARDED'] }, 1, 0] } },
        totalRedeemed: { $sum: { $cond: [{ $eq: ['$rewardStatus', 'REDEEMED'] }, 1, 0] } },
        totalExpired: { $sum: { $cond: [{ $eq: ['$rewardStatus', 'EXPIRED'] }, 1, 0] } },
        averagePoints: { $avg: '$pointsEarned' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      incentives,
      summary: summary[0] || {
        totalPoints: 0,
        totalAwarded: 0,
        totalRedeemed: 0,
        totalExpired: 0,
        averagePoints: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// @desc    Get single incentive
// @route   GET /api/incentives/:id
// @access  Private
const getIncentiveById = asyncHandler(async (req, res) => {
  const incentive = await Incentive.findById(req.params.id)
    .populate('user', 'name email')
    .populate('contribution')
    .populate('redeemedBy', 'name');

  if (!incentive) {
    res.status(404);
    throw new Error('Incentive not found');
  }

  // Check if user owns this incentive or is admin
  if (incentive.user._id.toString() !== req.user._id.toString() && !req.admin) {
    res.status(403);
    throw new Error('Not authorized to view this incentive');
  }

  res.json({
    success: true,
    data: incentive
  });
});

// @desc    Redeem incentive
// @route   PUT /api/incentives/:id/redeem
// @access  Private
const redeemIncentive = asyncHandler(async (req, res) => {
  const incentive = await Incentive.findById(req.params.id);

  if (!incentive) {
    res.status(404);
    throw new Error('Incentive not found');
  }

  // Check if user owns this incentive
  if (incentive.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to redeem this incentive');
  }

  try {
    await incentive.redeem(req.user._id);
    await incentive.save();

    res.json({
      success: true,
      data: incentive,
      message: 'Incentive redeemed successfully'
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get user incentive statistics
// @route   GET /api/incentives/statistics
// @access  Private/Admin
const getIncentiveStatistics = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;

  let groupBy;
  switch(period) {
    case 'day':
      groupBy = { year: { $year: '$awardedDate' }, month: { $month: '$awardedDate' }, day: { $dayOfMonth: '$awardedDate' } };
      break;
    case 'week':
      groupBy = { year: { $year: '$awardedDate' }, week: { $week: '$awardedDate' } };
      break;
    case 'month':
      groupBy = { year: { $year: '$awardedDate' }, month: { $month: '$awardedDate' } };
      break;
    default:
      groupBy = { year: { $year: '$awardedDate' }, month: { $month: '$awardedDate' } };
  }

  // Incentives over time
  const timelineStats = await Incentive.aggregate([
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
        totalPoints: { $sum: '$pointsEarned' },
        averagePoints: { $avg: '$pointsEarned' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Status breakdown
  const statusBreakdown = await Incentive.aggregate([
    {
      $group: {
        _id: '$rewardStatus',
        count: { $sum: 1 },
        totalPoints: { $sum: '$pointsEarned' }
      }
    }
  ]);

  // Top users by points
  const topUsers = await Incentive.aggregate([
    {
      $group: {
        _id: '$user',
        totalPoints: { $sum: '$pointsEarned' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalPoints: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        'user.name': 1,
        'user.email': 1,
        totalPoints: 1,
        count: 1
      }
    }
  ]);

  // Redemption rate over time
  const redemptionRate = await Incentive.aggregate([
    {
      $group: {
        _id: null,
        totalAwarded: {
          $sum: { $cond: [{ $eq: ['$rewardStatus', 'AWARDED'] }, 1, 0] }
        },
        totalRedeemed: {
          $sum: { $cond: [{ $eq: ['$rewardStatus', 'REDEEMED'] }, 1, 0] }
        },
        totalExpired: {
          $sum: { $cond: [{ $eq: ['$rewardStatus', 'EXPIRED'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        redemptionRate: {
          $multiply: [
            { $divide: ['$totalRedeemed', { $max: ['$totalAwarded', 1] }] },
            100
          ]
        },
        totalAwarded: 1,
        totalRedeemed: 1,
        totalExpired: 1
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      timeline: timelineStats,
      statusBreakdown,
      topUsers,
      redemptionRate: redemptionRate[0] || {
        redemptionRate: 0,
        totalAwarded: 0,
        totalRedeemed: 0,
        totalExpired: 0
      }
    }
  });
});

module.exports = {
  getIncentives,
  getIncentiveById,
  redeemIncentive,
  getIncentiveStatistics
};
// server/src/controllers/chartController.js
const PlasticContribution = require('../models/PlasticContribution');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get monthly trends
// @route   GET /api/charts/monthly-trends
// @access  Private/Admin
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const targetYear = year ? parseInt(year) : new Date().getFullYear();
  
  const monthlyData = await PlasticContribution.aggregate([
    {
      $match: {
        status: 'approved',
        createdAt: {
          $gte: new Date(`${targetYear}-01-01`),
          $lte: new Date(`${targetYear}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalWeight: { $sum: "$quantity" },
        totalPoints: { $sum: "$pointsEarned" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = months.map((month, index) => {
    const data = monthlyData.find(d => d._id === index + 1);
    return {
      month,
      weight: data?.totalWeight || 0,
      points: data?.totalPoints || 0,
      count: data?.count || 0
    };
  });
  
  res.json({ success: true, data: result });
});

// @desc    Get category comparisons
// @route   GET /api/charts/category-comparison
// @access  Private/Admin
const getCategoryComparison = asyncHandler(async (req, res) => {
  const categoryData = await PlasticContribution.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: "$plasticType",
        totalWeight: { $sum: "$quantity" },
        totalPoints: { $sum: "$pointsEarned" },
        count: { $sum: 1 },
        avgWeight: { $avg: "$quantity" }
      }
    },
    { $sort: { totalWeight: -1 } }
  ]);
  
  // Calculate percentages
  const totalWeight = categoryData.reduce((sum, c) => sum + c.totalWeight, 0);
  const totalPoints = categoryData.reduce((sum, c) => sum + c.totalPoints, 0);
  
  const result = categoryData.map(cat => ({
    type: cat._id,
    weight: cat.totalWeight,
    weightPercentage: ((cat.totalWeight / totalWeight) * 100).toFixed(1),
    points: cat.totalPoints,
    pointsPercentage: ((cat.totalPoints / totalPoints) * 100).toFixed(1),
    count: cat.count,
    avgWeight: cat.avgWeight.toFixed(2)
  }));
  
  res.json({ success: true, data: result });
});

// @desc    Get user ranking chart
// @route   GET /api/charts/user-ranking
// @access  Private/Admin
const getUserRanking = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const topUsers = await User.find({ totalContributions: { $gt: 0 } })
    .sort({ totalPoints: -1 })
    .limit(parseInt(limit))
    .select('name totalPoints totalWeight totalContributions');
  
  res.json({ success: true, data: topUsers });
});

// @desc    Get daily activity heatmap
// @route   GET /api/charts/daily-activity
// @access  Private/Admin
const getDailyActivity = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  
  const dailyActivity = await PlasticContribution.aggregate([
    {
      $match: {
        status: 'approved',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dayOfWeek: { $dayOfWeek: "$createdAt" }
        },
        count: { $sum: 1 },
        totalWeight: { $sum: "$quantity" }
      }
    },
    { $sort: { "_id.date": 1 } }
  ]);
  
  res.json({ success: true, data: dailyActivity });
});

module.exports = {
  getMonthlyTrends,
  getCategoryComparison,
  getUserRanking,
  getDailyActivity
};
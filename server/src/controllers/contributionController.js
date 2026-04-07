// server/src/controllers/contributionController.js
const PlasticContribution = require('../models/PlasticContribution');
const User = require('../models/User');
const Incentive = require('../models/Incentive');
const { asyncHandler } = require('../middleware/errorMiddleware');  // ← ADD THIS LINE
const { calculateIncentivePoints } = require('../utils/incentiveCalculator');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ... rest of your code

// @desc    Create a new contribution
// @route   POST /api/contributions
// @access  Private
const createContribution = asyncHandler(async (req, res) => {
  const { plasticType, quantity, collectionPoint, notes, location, images } = req.body;

  const pointsEarned = calculateIncentivePoints(plasticType, quantity);

  let imageUrls = [];
  if (images && images.length > 0) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadDir = path.join(__dirname, '../../uploads/contributions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const base64Image of images) {
      try {
        const matches = base64Image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const imageBuffer = Buffer.from(matches[2], 'base64');
          const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
          const filePath = path.join(uploadDir, filename);
          
          await sharp(imageBuffer)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(filePath);

          imageUrls.push({
            url: `${baseUrl}/uploads/contributions/${filename}`,
            uploadedAt: new Date()
          });
        }
      } catch (imageError) {
        console.error('Error processing image:', imageError);
      }
    }
  }

  let locationData = undefined;
  if (location && location.coordinates && Array.isArray(location.coordinates) && 
      location.coordinates.length === 2 && typeof location.coordinates[0] === 'number' &&
      typeof location.coordinates[1] === 'number') {
    locationData = { type: 'Point', coordinates: location.coordinates };
  }

  const contribution = await PlasticContribution.create({
    user: req.user._id,
    plasticType,
    quantity,
    unit: req.body.unit || 'kg',
    collectionPoint,
    notes,
    location: locationData,
    pointsEarned,
    images: imageUrls,
    status: 'pending'
  });

  await Incentive.create({
    user: req.user._id,
    contribution: contribution._id,
    pointsEarned,
    rewardType: 'POINTS',
    rewardValue: pointsEarned,
    rewardStatus: 'PENDING',
    description: `Points earned for ${quantity}kg of ${plasticType} plastic`
  });

  // Emit WebSocket event for real-time notification
  try {
    const { emitNewContribution } = require('../socket/socketManager');
    await emitNewContribution(contribution);
    console.log(`📡 WebSocket: New contribution notification sent for ${contribution._id}`);
  } catch (socketError) {
    console.error('WebSocket emit error (non-critical):', socketError.message);
    // Don't fail the request if socket emit fails
  }

  res.status(201).json({
    success: true,
    data: contribution,
    message: 'Contribution submitted successfully. Pending approval.'
  });
});




// @desc    Get all contributions
// @route   GET /api/contributions
// @access  Private/Admin
const getContributions = asyncHandler(async (req, res) => {
  const { status, plasticType, startDate, endDate, userId, page = 1, limit = 10 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (plasticType) filter.plasticType = plasticType;
  if (userId) filter.user = userId;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const contributions = await PlasticContribution.find(filter)
    .populate('user', 'name email')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await PlasticContribution.countDocuments(filter);

  const summary = await PlasticContribution.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalWeight: { $sum: '$quantity' },
        totalPoints: { $sum: '$pointsEarned' },
        avgWeight: { $avg: '$quantity' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      contributions,
      summary: summary[0] || { totalWeight: 0, totalPoints: 0, avgWeight: 0, count: 0 },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// @desc    Get single contribution
// @route   GET /api/contributions/:id
// @access  Private
const getContributionById = asyncHandler(async (req, res) => {
  const contribution = await PlasticContribution.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('approvedBy', 'name email');

  if (!contribution) {
    res.status(404);
    throw new Error('Contribution not found');
  }

  if (contribution.user._id.toString() !== req.user._id.toString() && !req.admin) {
    res.status(403);
    throw new Error('Not authorized to view this contribution');
  }

  res.json({
    success: true,
    data: contribution
  });
});


// @desc    Update contribution status (approve/reject)
// @route   PUT /api/contributions/:id/status
// @access  Private/Admin
const updateContributionStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  const contribution = await PlasticContribution.findById(req.params.id);

  if (!contribution) {
    res.status(404);
    throw new Error('Contribution not found');
  }

  contribution.status = status;
  
  if (status === 'approved') {
    contribution.approvedBy = req.user._id;
    contribution.approvedDate = new Date();

    const user = await User.findById(contribution.user);
    if (user) {
      user.totalPoints = (user.totalPoints || 0) + (contribution.pointsEarned || 0);
      user.totalWeight = (user.totalWeight || 0) + (contribution.quantity || 0);
      user.totalContributions = (user.totalContributions || 0) + 1;
      user.lastContribution = new Date();
      user.updateRewardTier();
      await user.save();
      
      console.log(`✅ Updated user ${user.name}:`, {
        points: user.totalPoints,
        weight: user.totalWeight,
        contributions: user.totalContributions,
        tier: user.rewardTier
      });
    }

    await Incentive.findOneAndUpdate(
      { contribution: contribution._id },
      { 
        rewardStatus: 'AWARDED',
        awardedDate: new Date()
      }
    );

  } else if (status === 'rejected') {
    contribution.rejectionReason = rejectionReason;
    
    await Incentive.findOneAndUpdate(
      { contribution: contribution._id },
      { rewardStatus: 'CANCELLED' }
    );
  }

  await contribution.save();

  // Emit WebSocket events for real-time updates
  try {
    const { emitContributionUpdate, emitStatsUpdate } = require('../socket/socketManager');
    await emitContributionUpdate(contribution._id, status);
    
    // Fetch updated stats and emit
    const PlasticContribution = require('../models/PlasticContribution');
    const User = require('../models/User');
    
    const totalApproved = await PlasticContribution.countDocuments({ status: 'approved' });
    const weightResult = await PlasticContribution.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    const totalWeight = weightResult[0]?.total || 0;
    const pointsResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPoints' } } }
    ]);
    const totalPoints = pointsResult[0]?.total || 0;
    
    await emitStatsUpdate({ totalApproved, totalWeight, totalPoints });
  } catch (socketError) {
    console.error('WebSocket emit error:', socketError);
    // Don't fail the request if socket emit fails
  }

  res.json({
    success: true,
    data: contribution,
    message: `Contribution ${status} successfully`
  });
});


// @desc    Get contribution statistics for dashboard (OPTIMIZED)
// @route   GET /api/contributions/statistics
// @access  Private/Admin
const getContributionStatistics = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { range = 'month' } = req.query;
    
    // Calculate date range
    let startDate = new Date();
    if (range === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (range === 'month') startDate.setDate(startDate.getDate() - 30);
    else if (range === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0);

    // Run ALL queries in PARALLEL - this is the key optimization
    const [
      total,
      totalApproved,
      weightResult,
      pointsResult,
      timeline,
      statusBreakdown,
      typeBreakdown,
      topContributors,
      recentActivity
    ] = await Promise.all([
      // 1. Total contributions count
      PlasticContribution.countDocuments(),
      
      // 2. Total approved count
      PlasticContribution.countDocuments({ status: 'approved' }),
      
      // 3. Total weight from approved contributions
      PlasticContribution.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]),
      
      // 4. Total points from users
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPoints' } } }
      ]),
      
      // 5. Timeline data (limited to 31 days)
      PlasticContribution.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startDate },
            status: 'approved'
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            totalWeight: { $sum: '$quantity' }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 31 }
      ]),
      
      // 6. Status breakdown (lightweight)
      PlasticContribution.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      
      // 7. Plastic type breakdown (limited to top 6)
      PlasticContribution.aggregate([
        { $match: { status: 'approved' } },
        {
          $group: {
            _id: "$plasticType",
            count: { $sum: 1 },
            totalWeight: { $sum: '$quantity' }
          }
        },
        { $sort: { totalWeight: -1 } },
        { $limit: 6 }
      ]),
      
      // 8. Top contributors (limited to 5)
      User.find({ totalContributions: { $gt: 0 } })
        .sort({ totalPoints: -1 })
        .limit(5)
        .select('name totalContributions totalWeight totalPoints lastContribution')
        .lean(),
      
      // 9. Recent activity (limited to 5)
      PlasticContribution.find()
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const totalWeight = weightResult[0]?.total || 0;
    const totalPoints = pointsResult[0]?.total || 0;

    const formattedActivity = recentActivity.map(activity => ({
      id: activity._id,
      user: activity.user?.name || 'Unknown User',
      action: `submitted ${activity.quantity}kg of ${activity.plasticType}`,
      timestamp: activity.createdAt,
      status: activity.status
    }));

    const endTime = Date.now();
    console.log(`✅ Dashboard loaded in ${endTime - startTime}ms (${range} range)`);

    res.json({
      success: true,
      data: {
        timeline: timeline || [],
        statusBreakdown: statusBreakdown || [],
        typeBreakdown: typeBreakdown || [],
        total: total || 0,
        totalApproved: totalApproved || 0,
        totalWeight: totalWeight || 0,
        totalPoints: totalPoints || 0,
        userEngagement: {
          topContributors: topContributors.map(u => ({
            name: u.name,
            email: u.email,
            count: u.totalContributions || 0,
            totalWeight: u.totalWeight || 0,
            totalPoints: u.totalPoints || 0,
            lastActive: u.lastContribution || '-'
          }))
        },
        recentActivity: formattedActivity || []
      }
    });
    
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});







// @desc    Get admin dashboard statistics (simplified and reliable)
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    
    let startDate = new Date();
    if (range === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (range === 'month') startDate.setDate(startDate.getDate() - 30);
    else if (range === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setDate(startDate.getDate() - 30);
    
    startDate.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const totalContributions = await PlasticContribution.countDocuments();
    const totalApproved = await PlasticContribution.countDocuments({ status: 'approved' });
    
    const contributions = await PlasticContribution.find({ status: 'approved' });
    let totalWeight = 0;
    contributions.forEach(c => totalWeight += c.quantity || 0);
    
    const users = await User.find({});
    let totalPoints = 0;
    users.forEach(u => totalPoints += u.totalPoints || 0);

    console.log('Admin Dashboard Stats:', { 
      totalUsers, totalContributions, totalApproved, 
      totalWeight: `${totalWeight} kg`, totalPoints 
    });

    const timeline = await PlasticContribution.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startDate },
          status: 'approved'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          totalWeight: { $sum: '$quantity' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const statusBreakdown = await PlasticContribution.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const typeBreakdown = await PlasticContribution.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: "$plasticType",
          count: { $sum: 1 },
          totalWeight: { $sum: '$quantity' }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);

    const topContributors = await User.find({ totalContributions: { $gt: 0 } })
      .sort({ totalPoints: -1 })
      .limit(10)
      .select('name totalContributions totalWeight totalPoints lastContribution');

    const recentActivity = await PlasticContribution.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedActivity = recentActivity.map(activity => ({
      id: activity._id,
      user: activity.user?.name || 'Unknown',
      action: `${activity.status === 'approved' ? '✅' : '⏳'} ${activity.quantity}kg of ${activity.plasticType}`,
      timestamp: activity.createdAt
    }));

    res.json({
      success: true,
      data: {
        timeline,
        statusBreakdown,
        typeBreakdown,
        total: totalContributions,
        totalApproved,
        totalWeight,
        totalPoints,
        totalUsers,
        userEngagement: { topContributors },
        recentActivity: formattedActivity
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Upload contribution images
// @route   POST /api/contributions/:id/images
// @access  Private
const uploadContributionImages = asyncHandler(async (req, res) => {
  const contribution = await PlasticContribution.findById(req.params.id);

  if (!contribution) {
    if (req.files) req.files.forEach(file => fs.existsSync(file.path) && fs.unlinkSync(file.path));
    res.status(404);
    throw new Error('Contribution not found');
  }

  if (contribution.user.toString() !== req.user._id.toString() && !req.admin) {
    if (req.files) req.files.forEach(file => fs.existsSync(file.path) && fs.unlinkSync(file.path));
    res.status(403);
    throw new Error('Not authorized');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const imageUrls = req.files.map(file => ({
    url: `${baseUrl}/uploads/contributions/${file.filename}`,
    uploadedAt: new Date()
  }));

  contribution.images = [...contribution.images, ...imageUrls];
  await contribution.save();

  res.json({
    success: true,
    data: { images: contribution.images, count: contribution.images.length },
    message: `${req.files.length} image(s) uploaded successfully`
  });
});

// @desc    Delete contribution image
// @route   DELETE /api/contributions/:id/images/:imageId
// @access  Private
const deleteContributionImage = asyncHandler(async (req, res) => {
  const contribution = await PlasticContribution.findById(req.params.id);

  if (!contribution) {
    res.status(404);
    throw new Error('Contribution not found');
  }

  if (contribution.user.toString() !== req.user._id.toString() && !req.admin) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const imageIndex = contribution.images.findIndex(img => img._id.toString() === req.params.imageId);
  if (imageIndex === -1) {
    res.status(404);
    throw new Error('Image not found');
  }

  const imageUrl = contribution.images[imageIndex].url;
  const filename = path.basename(imageUrl);
  const filePath = path.join(__dirname, '../../uploads/contributions', filename);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  contribution.images.splice(imageIndex, 1);
  await contribution.save();

  res.json({ success: true, message: 'Image deleted successfully' });
});

module.exports = {
  createContribution,
  getContributions,
  getContributionById,
  updateContributionStatus,
  getContributionStatistics,
  getAdminDashboardStats,
  uploadContributionImages,
  deleteContributionImage
};
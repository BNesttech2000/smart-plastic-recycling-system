// server/src/controllers/contributionController.js
const PlasticContribution = require('../models/plasticContribution');
const User = require('../models/User');
const Incentive = require('../models/Incentive');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { calculateIncentivePoints } = require('../utils/incentiveCalculator');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // ← Make sure to install this: npm install sharp

// @desc    Create a new contribution
// @route   POST /api/contributions
// @access  Private
const createContribution = asyncHandler(async (req, res) => {
  const { plasticType, quantity, collectionPoint, notes, location, images } = req.body;

  // Calculate points
  const pointsEarned = calculateIncentivePoints(plasticType, quantity);

  // Handle base64 images if any
  let imageUrls = [];
  if (images && images.length > 0) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Ensure upload directory exists
    const uploadDir = path.join(__dirname, '../../uploads/contributions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const base64Image of images) {
      try {
        // Extract base64 data
        const matches = base64Image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const imageBuffer = Buffer.from(matches[2], 'base64');
          const filename = `img-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
          const filePath = path.join(uploadDir, filename);
          
          // Optimize and save image
          await sharp(imageBuffer)
            .resize(1200, 1200, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .jpeg({ quality: 80 })
            .toFile(filePath);

          imageUrls.push({
            url: `${baseUrl}/uploads/contributions/${filename}`,
            uploadedAt: new Date()
          });
        }
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        // Continue with other images even if one fails
      }
    }
  }

  // Create contribution
  const contribution = await PlasticContribution.create({
    user: req.user._id,
    plasticType,
    quantity,
    unit: req.body.unit || 'kg',
    collectionPoint,
    notes,
    location: location ? {
      type: 'Point',
      coordinates: location.coordinates
    } : undefined,
    pointsEarned,
    images: imageUrls,
    status: 'pending'
  });

  // Create incentive record
  await Incentive.create({
    user: req.user._id,
    contribution: contribution._id,
    pointsEarned,
    rewardType: 'POINTS',
    rewardValue: pointsEarned,
    rewardStatus: 'PENDING',
    description: `Points earned for ${quantity}kg of ${plasticType} plastic`
  });

  res.status(201).json({
    success: true,
    data: contribution,
    message: 'Contribution submitted successfully. Pending approval.'
  });
});

// @desc    Get all contributions (with filters)
// @route   GET /api/contributions
// @access  Private/Admin
const getContributions = asyncHandler(async (req, res) => {
  const { status, plasticType, startDate, endDate, userId, page = 1, limit = 10 } = req.query;
  
  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (plasticType) filter.plasticType = plasticType;
  if (userId) filter.user = userId;
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get contributions
  const contributions = await PlasticContribution.find(filter)
    .populate('user', 'name email')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await PlasticContribution.countDocuments(filter);

  // Get summary statistics
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

  // Check if user owns this contribution or is admin
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

  // Update status
  contribution.status = status;
  
  if (status === 'approved') {
    contribution.approvedBy = req.admin._id;
    contribution.approvedDate = new Date();

    // Update user's total points and weight
    const user = await User.findById(contribution.user);
    user.totalPoints += contribution.pointsEarned;
    user.totalWeight += contribution.quantity;
    user.totalContributions += 1;
    user.lastContribution = new Date();
    user.updateRewardTier();
    await user.save();

    // Update associated incentive
    await Incentive.findOneAndUpdate(
      { contribution: contribution._id },
      { 
        rewardStatus: 'AWARDED',
        awardedDate: new Date()
      }
    );

  } else if (status === 'rejected') {
    contribution.rejectionReason = rejectionReason;
    
    // Update associated incentive
    await Incentive.findOneAndUpdate(
      { contribution: contribution._id },
      { rewardStatus: 'CANCELLED' }
    );
  }

  await contribution.save();

  res.json({
    success: true,
    data: contribution,
    message: `Contribution ${status} successfully`
  });
});

// @desc    Get contribution statistics
// @route   GET /api/contributions/statistics
// @access  Private/Admin
const getContributionStatistics = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;

  let groupBy;
  switch(period) {
    case 'day':
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };
      break;
    case 'week':
      groupBy = { year: { $year: '$createdAt' }, week: { $week: '$createdAt' } };
      break;
    case 'month':
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
      break;
    case 'year':
      groupBy = { year: { $year: '$createdAt' } };
      break;
    default:
      groupBy = { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };
  }

  // Contributions over time
  const timelineStats = await PlasticContribution.aggregate([
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
        totalWeight: { $sum: '$quantity' },
        totalPoints: { $sum: '$pointsEarned' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Status breakdown
  const statusBreakdown = await PlasticContribution.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalWeight: { $sum: '$quantity' }
      }
    }
  ]);

  // Plastic type breakdown
  const typeBreakdown = await PlasticContribution.aggregate([
    {
      $match: { status: 'approved' }
    },
    {
      $group: {
        _id: '$plasticType',
        count: { $sum: 1 },
        totalWeight: { $sum: '$quantity' },
        totalPoints: { $sum: '$pointsEarned' }
      }
    },
    { $sort: { totalWeight: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      timeline: timelineStats,
      statusBreakdown,
      typeBreakdown,
      total: await PlasticContribution.countDocuments(),
      totalApproved: await PlasticContribution.countDocuments({ status: 'approved' }),
      totalWeight: await PlasticContribution.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]).then(result => result[0]?.total || 0)
    }
  });
});

// @desc    Upload contribution images
// @route   POST /api/contributions/:id/images
// @access  Private
const uploadContributionImages = asyncHandler(async (req, res) => {
  const contribution = await PlasticContribution.findById(req.params.id);

  if (!contribution) {
    // Clean up uploaded files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(404);
    throw new Error('Contribution not found');
  }

  // Check if user owns this contribution
  if (contribution.user.toString() !== req.user._id.toString() && !req.admin) {
    // Clean up uploaded files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(403);
    throw new Error('Not authorized to upload images for this contribution');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  // Add image URLs to contribution
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const imageUrls = req.files.map(file => ({
    url: `${baseUrl}/uploads/contributions/${file.filename}`,
    uploadedAt: new Date()
  }));

  contribution.images = [...contribution.images, ...imageUrls];
  await contribution.save();

  res.json({
    success: true,
    data: {
      images: contribution.images,
      count: contribution.images.length
    },
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

  // Check if user owns this contribution
  if (contribution.user.toString() !== req.user._id.toString() && !req.admin) {
    res.status(403);
    throw new Error('Not authorized to delete images for this contribution');
  }

  const imageIndex = contribution.images.findIndex(
    img => img._id.toString() === req.params.imageId
  );

  if (imageIndex === -1) {
    res.status(404);
    throw new Error('Image not found');
  }

  // Delete physical file
  const imageUrl = contribution.images[imageIndex].url;
  const filename = path.basename(imageUrl);
  const filePath = path.join(__dirname, '../../uploads/contributions', filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from database
  contribution.images.splice(imageIndex, 1);
  await contribution.save();

  res.json({
    success: true,
    message: 'Image deleted successfully'
  });
});

module.exports = {
  createContribution,
  getContributions,
  getContributionById,
  updateContributionStatus,
  getContributionStatistics,
  uploadContributionImages,
  deleteContributionImage
};
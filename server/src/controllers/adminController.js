// server/src/controllers/adminController.js
const User = require('../models/User');
const Administrator = require('../models/Administrator');
const PlasticContribution = require('../models/plasticContribution');
const Incentive = require('../models/Incentive');
const Report = require('../models/Report');
const { asyncHandler } = require('../middleware/errorMiddleware');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Administrator.findOne({ email }).select('+password');

  if (admin && (await admin.matchPassword(password))) {
    // Log activity
    await admin.logActivity('LOGIN', req.ip);
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        token: generateToken(admin._id, 'admin')
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    search = '',
    status = 'all',
    tier = 'all',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const filter = {};
  
  // Search by name or email
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by status
  if (status !== 'all') {
    filter.isActive = status === 'active';
  }

  // Filter by tier
  if (tier !== 'all') {
    filter.rewardTier = tier.charAt(0).toUpperCase() + tier.slice(1);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const users = await User.find(filter)
    .select('-password')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  // Get user statistics
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        totalPoints: { $sum: '$totalPoints' },
        totalContributions: { $sum: '$totalContributions' },
        averagePoints: { $avg: '$totalPoints' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      users,
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        totalPoints: 0,
        totalContributions: 0,
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

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate({
      path: 'contributions',
      options: { limit: 20, sort: { createdAt: -1 } }
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user's incentives
  const incentives = await Incentive.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    data: {
      user,
      incentives
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, phone, address, rewardTier, isActive, role } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.address = address || user.address;
  user.rewardTier = rewardTier || user.rewardTier;
  user.isActive = isActive !== undefined ? isActive : user.isActive;
  user.role = role || user.role;

  const updatedUser = await user.save();

  // Log admin activity
  const admin = await Administrator.findById(req.admin._id);
  await admin.logActivity('UPDATE_USER', req.ip, { userId: user._id });
  await admin.save();

  res.json({
    success: true,
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Delete user's contributions and incentives
  await PlasticContribution.deleteMany({ user: user._id });
  await Incentive.deleteMany({ user: user._id });
  await user.deleteOne();

  // Log admin activity
  const admin = await Administrator.findById(req.admin._id);
  await admin.logActivity('DELETE_USER', req.ip, { userId: user._id });
  await admin.save();

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Create admin user
// @route   POST /api/admin/create
// @access  Private/SuperAdmin
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  const adminExists = await Administrator.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const admin = await Administrator.create({
    name,
    email,
    password,
    role: role || 'admin',
    permissions: permissions || []
  });

  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }
  });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const weekAgo = new Date(now.setDate(now.getDate() - 7));
  const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

  // Get today's stats
  const todayStats = await Promise.all([
    PlasticContribution.countDocuments({ createdAt: { $gte: today } }),
    PlasticContribution.countDocuments({ 
      createdAt: { $gte: today },
      status: 'approved'
    }),
    PlasticContribution.countDocuments({ 
      createdAt: { $gte: today },
      status: 'pending'
    })
  ]);

  // Get weekly trends
  const weeklyTrends = await PlasticContribution.aggregate([
    {
      $match: {
        createdAt: { $gte: weekAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 },
        weight: { $sum: '$quantity' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  // Get user growth
  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: monthAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          week: { $week: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
  ]);

  // Get top contributors
  const topContributors = await User.find()
    .sort({ totalPoints: -1 })
    .limit(10)
    .select('name email totalPoints totalContributions totalWeight');

  res.json({
    success: true,
    data: {
      today: {
        total: todayStats[0],
        approved: todayStats[1],
        pending: todayStats[2]
      },
      weeklyTrends,
      userGrowth,
      topContributors
    }
  });
});

module.exports = {
  adminLogin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
  getDashboardStats
};
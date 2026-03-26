// server/src/controllers/adminController.js
const User = require('../models/User');
const Administrator = require('../models/Administrator');
const PlasticContribution = require('../models/PlasticContribution');
const Incentive = require('../models/Incentive');
const { asyncHandler } = require('../middleware/errorMiddleware');
const generateToken = require('../utils/generateToken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Administrator.findOne({ email }).select('+password');

  if (admin && (await admin.matchPassword(password))) {
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
        token: generateToken(admin._id, 'admin')
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get all users - FIXED
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
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

  const { name, phone, address, rewardTier, isActive } = req.body;

  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.address = address || user.address;
  user.rewardTier = rewardTier || user.rewardTier;
  user.isActive = isActive !== undefined ? isActive : user.isActive;

  const updatedUser = await user.save();

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

  await PlasticContribution.deleteMany({ user: user._id });
  await Incentive.deleteMany({ user: user._id });
  await user.deleteOne();

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
      role: admin.role
    }
  });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalContributions = await PlasticContribution.countDocuments();
    const pendingContributions = await PlasticContribution.countDocuments({ status: 'pending' });
    const totalPoints = await User.aggregate([{ $group: { _id: null, total: { $sum: '$totalPoints' } } }]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalContributions,
        pendingContributions,
        totalPoints: totalPoints[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.json({
      success: true,
      data: {
        totalUsers: 0,
        totalContributions: 0,
        pendingContributions: 0,
        totalPoints: 0
      }
    });
  }
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
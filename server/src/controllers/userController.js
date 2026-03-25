// // server/src/controllers/userController.js
// const User = require('../models/User');
// const Incentive = require('../models/Incentive');
// const PlasticContribution = require('../models/plasticContribution');
// const generateToken = require('../utils/generateToken');
// const { asyncHandler } = require('../middleware/errorMiddleware');

// // @desc    Register a new user
// // @route   POST /api/users/register
// // @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, phone, address } = req.body;

//   // Check if user exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error('User already exists');
//   }

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password,
//     phone,
//     address
//   });

//   if (user) {
//     res.status(201).json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         totalPoints: user.totalPoints,
//         rewardTier: user.rewardTier,
//         token: generateToken(user._id)
//       }
//     });
//   } else {
//     res.status(400);
//     throw new Error('Invalid user data');
//   }
// });

// // @desc    Login user
// // @route   POST /api/users/login
// // @access  Public
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // Find user by email and include password field
//   const user = await User.findOne({ email }).select('+password');

//   if (user && (await user.matchPassword(password))) {
//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     res.json({
//       success: true,
//       data: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         totalPoints: user.totalPoints,
//         totalContributions: user.totalContributions,
//         totalWeight: user.totalWeight,
//         rewardTier: user.rewardTier,
//         profileImage: user.profileImage,
//         token: generateToken(user._id)
//       }
//     });
//   } else {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }
// });

// // @desc    Get user profile
// // @route   GET /api/users/profile
// // @access  Private
// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id)
//     .select('-password')
//     .populate({
//       path: 'contributions',
//       options: { limit: 10, sort: { createdAt: -1 } }
//     });

//   if (user) {
//     res.json({
//       success: true,
//       data: user
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

// // @desc    Update user profile
// // @route   PUT /api/users/profile
// // @access  Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.phone = req.body.phone || user.phone;
//     user.address = req.body.address || user.address;
    
//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     if (req.file) {
//       user.profileImage = req.file.filename;
//     }

//     const updatedUser = await user.save();

//     res.json({
//       success: true,
//       data: {
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phone: updatedUser.phone,
//         address: updatedUser.address,
//         totalPoints: updatedUser.totalPoints,
//         rewardTier: updatedUser.rewardTier,
//         profileImage: updatedUser.profileImage,
//         token: generateToken(updatedUser._id)
//       }
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

// // @desc    Get user contributions
// // @route   GET /api/users/contributions
// // @access  Private
// const getUserContributions = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const contributions = await PlasticContribution.find({ user: req.user._id })
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   const total = await PlasticContribution.countDocuments({ user: req.user._id });

//   res.json({
//     success: true,
//     data: {
//       contributions,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     }
//   });
// });

// // @desc    Get user incentives
// // @route   GET /api/users/incentives
// // @access  Private
// const getUserIncentives = asyncHandler(async (req, res) => {
//   const incentives = await Incentive.find({ user: req.user._id })
//     .populate('contribution', 'plasticType quantity createdAt')
//     .sort({ createdAt: -1 });

//   // Calculate summary statistics
//   const summary = {
//     totalPoints: req.user.totalPoints,
//     totalAwarded: incentives.filter(i => i.rewardStatus === 'AWARDED').length,
//     totalRedeemed: incentives.filter(i => i.rewardStatus === 'REDEEMED').length,
//     totalPending: incentives.filter(i => i.rewardStatus === 'PENDING').length,
//     totalExpired: incentives.filter(i => i.rewardStatus === 'EXPIRED').length
//   };

//   res.json({
//     success: true,
//     data: {
//       summary,
//       incentives
//     }
//   });
// });

// // @desc    Get user statistics
// // @route   GET /api/users/statistics
// // @access  Private
// const getUserStatistics = asyncHandler(async (req, res) => {
//   const user = req.user;

//   // Get monthly contributions for the last 6 months
//   const sixMonthsAgo = new Date();
//   sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//   const monthlyContributions = await PlasticContribution.aggregate([
//     {
//       $match: {
//         user: user._id,
//         createdAt: { $gte: sixMonthsAgo }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' }
//         },
//         totalWeight: { $sum: '$quantity' },
//         count: { $sum: 1 },
//         totalPoints: { $sum: '$pointsEarned' }
//       }
//     },
//     { $sort: { '_id.year': 1, '_id.month': 1 } }
//   ]);

//   // Get plastic type breakdown
//   const plasticBreakdown = await PlasticContribution.aggregate([
//     {
//       $match: {
//         user: user._id,
//         status: 'approved'
//       }
//     },
//     {
//       $group: {
//         _id: '$plasticType',
//         totalWeight: { $sum: '$quantity' },
//         count: { $sum: 1 }
//       }
//     }
//   ]);

//   res.json({
//     success: true,
//     data: {
//       totalStats: {
//         contributions: user.totalContributions,
//         weight: user.totalWeight,
//         points: user.totalPoints,
//         rewardTier: user.rewardTier,
//         joinedDate: user.joinedDate
//       },
//       monthlyContributions,
//       plasticBreakdown,
//       rank: await getUserRank(user._id)
//     }
//   });
// });

// // Helper function to get user rank
// const getUserRank = async (userId) => {
//   const users = await User.find({})
//     .sort({ totalPoints: -1 })
//     .select('totalPoints');

//   const rank = users.findIndex(u => u._id.toString() === userId.toString()) + 1;
//   const totalUsers = users.length;

//   return {
//     rank,
//     totalUsers,
//     percentile: ((totalUsers - rank) / totalUsers * 100).toFixed(1)
//   };
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   getUserProfile,
//   updateUserProfile,
//   getUserContributions,
//   getUserIncentives,
//   getUserStatistics
// };







// server/src/controllers/userController.js
const User = require('../models/User');
const Incentive = require('../models/Incentive');
const PlasticContribution = require('../models/PlasticContribution'); // ← FIXED: Capital P, Capital C
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        totalPoints: user.totalPoints,
        rewardTier: user.rewardTier,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔍 Login attempt for:', email); // Debug

  // Find user by email and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log('❌ User not found');
    res.status(401);
    throw new Error('Invalid email or password');
  }

  console.log('✅ User found, checking password...');
  
  const isMatch = await user.matchPassword(password);
  console.log('Password match:', isMatch);

  if (isMatch) {
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        totalPoints: user.totalPoints,
        totalContributions: user.totalContributions,
        totalWeight: user.totalWeight,
        rewardTier: user.rewardTier,
        profileImage: user.profileImage,
        role: user.role || 'user',
        token: generateToken(user._id)
      }
    });
  } else {
    console.log('❌ Password mismatch');
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate({
      path: 'contributions',
      options: { limit: 10, sort: { createdAt: -1 } }
    });

  if (user) {
    res.json({
      success: true,
      data: user
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.profileImage = req.file.filename;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        totalPoints: updatedUser.totalPoints,
        rewardTier: updatedUser.rewardTier,
        profileImage: updatedUser.profileImage,
        token: generateToken(updatedUser._id)
      }
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user contributions
// @route   GET /api/users/contributions
// @access  Private
const getUserContributions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const contributions = await PlasticContribution.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await PlasticContribution.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    data: {
      contributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Get user incentives
// @route   GET /api/users/incentives
// @access  Private
const getUserIncentives = asyncHandler(async (req, res) => {
  const incentives = await Incentive.find({ user: req.user._id })
    .populate('contribution', 'plasticType quantity createdAt')
    .sort({ createdAt: -1 });

  // Calculate summary statistics
  const summary = {
    totalPoints: req.user.totalPoints,
    totalAwarded: incentives.filter(i => i.rewardStatus === 'AWARDED').length,
    totalRedeemed: incentives.filter(i => i.rewardStatus === 'REDEEMED').length,
    totalPending: incentives.filter(i => i.rewardStatus === 'PENDING').length,
    totalExpired: incentives.filter(i => i.rewardStatus === 'EXPIRED').length
  };

  res.json({
    success: true,
    data: {
      summary,
      incentives
    }
  });
});

// @desc    Get user statistics
// @route   GET /api/users/statistics
// @access  Private
const getUserStatistics = asyncHandler(async (req, res) => {
  const user = req.user;

  // Get monthly contributions for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyContributions = await PlasticContribution.aggregate([
    {
      $match: {
        user: user._id,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalWeight: { $sum: '$quantity' },
        count: { $sum: 1 },
        totalPoints: { $sum: '$pointsEarned' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Get plastic type breakdown
  const plasticBreakdown = await PlasticContribution.aggregate([
    {
      $match: {
        user: user._id,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$plasticType',
        totalWeight: { $sum: '$quantity' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalStats: {
        contributions: user.totalContributions,
        weight: user.totalWeight,
        points: user.totalPoints,
        rewardTier: user.rewardTier,
        joinedDate: user.joinedDate
      },
      monthlyContributions,
      plasticBreakdown,
      rank: await getUserRank(user._id)
    }
  });
});

// Helper function to get user rank
const getUserRank = async (userId) => {
  const users = await User.find({})
    .sort({ totalPoints: -1 })
    .select('totalPoints');

  const rank = users.findIndex(u => u._id.toString() === userId.toString()) + 1;
  const totalUsers = users.length;

  return {
    rank,
    totalUsers,
    percentile: ((totalUsers - rank) / totalUsers * 100).toFixed(1)
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserContributions,
  getUserIncentives,
  getUserStatistics
};
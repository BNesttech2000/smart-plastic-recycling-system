// server/src/models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  reportType: {
    type: String,
    required: [true, 'Report type is required'],
    enum: {
      values: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'],
      message: '{VALUE} is not a valid report type'
    }
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator',
    required: [true, 'Generator reference is required']
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  dateRange: {
    start: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end: {
      type: Date,
      required: [true, 'End date is required']
    }
  },
  summary: {
    totalContributions: {
      type: Number,
      default: 0
    },
    totalUsers: {
      type: Number,
      default: 0
    },
    totalWeight: {
      type: Number,
      default: 0
    },
    totalPointsAwarded: {
      type: Number,
      default: 0
    },
    averageContribution: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    }
  },
  plasticBreakdown: [{
    plasticType: {
      type: String,
      enum: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER']
    },
    quantity: Number,
    percentage: Number
  }],
  userEngagement: {
    newUsers: Number,
    returningUsers: Number,
    topContributors: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      totalWeight: Number,
      totalPoints: Number
    }]
  },
  incentiveSummary: {
    totalAwarded: Number,
    totalRedeemed: Number,
    redemptionRate: Number,
    averagePointsPerUser: Number
  },
  charts: {
    contributionsOverTime: mongoose.Schema.Types.Mixed,
    plasticTypeDistribution: mongoose.Schema.Types.Mixed,
    userGrowth: mongoose.Schema.Types.Mixed
  },
  format: {
    type: String,
    enum: ['JSON', 'CSV', 'PDF', 'EXCEL'],
    default: 'JSON'
  },
  status: {
    type: String,
    enum: ['GENERATING', 'COMPLETED', 'FAILED'],
    default: 'GENERATING'
  },
  fileUrl: {
    type: String
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ generatedBy: 1, generatedDate: -1 });
reportSchema.index({ reportType: 1, generatedDate: -1 });
reportSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1 });

// Calculate summary statistics before saving
reportSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Calculate average contribution
    if (this.summary.totalContributions > 0) {
      this.summary.averageContribution = 
        this.summary.totalWeight / this.summary.totalContributions;
    }
    
    // Calculate redemption rate
    if (this.incentiveSummary.totalAwarded > 0) {
      this.incentiveSummary.redemptionRate = 
        (this.incentiveSummary.totalRedeemed / this.incentiveSummary.totalAwarded) * 100;
    }
    
    // Calculate plastic breakdown percentages
    if (this.plasticBreakdown && this.plasticBreakdown.length > 0) {
      const totalPlasticWeight = this.plasticBreakdown.reduce(
        (sum, item) => sum + item.quantity, 0
      );
      
      this.plasticBreakdown.forEach(item => {
        item.percentage = (item.quantity / totalPlasticWeight) * 100;
      });
    }
  }
  next();
});

// Static method to generate daily report
reportSchema.statics.generateDailyReport = async function(adminId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return this.generateCustomReport(adminId, 'DAILY', start, end);
};

// Static method to generate monthly report
reportSchema.statics.generateMonthlyReport = async function(adminId, year, month) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  
  return this.generateCustomReport(adminId, 'MONTHLY', start, end);
};

// Static method to generate custom report
reportSchema.statics.generateCustomReport = async function(adminId, type, start, end) {
  const Contribution = mongoose.model('PlasticContribution');
  const User = mongoose.model('User');
  const Incentive = mongoose.model('Incentive');

  // Get contributions in date range
  const contributions = await Contribution.find({
    createdAt: { $gte: start, $lte: end },
    status: 'approved'
  }).populate('user', 'name');

  // Get user statistics
  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({
    joinedDate: { $gte: start, $lte: end }
  });

  // Calculate summary
  const totalWeight = contributions.reduce((sum, c) => sum + c.quantity, 0);
  const totalPoints = contributions.reduce((sum, c) => sum + c.pointsEarned, 0);

  // Plastic type breakdown
  const plasticBreakdown = {};
  contributions.forEach(c => {
    if (!plasticBreakdown[c.plasticType]) {
      plasticBreakdown[c.plasticType] = 0;
    }
    plasticBreakdown[c.plasticType] += c.quantity;
  });

  const breakdownArray = Object.entries(plasticBreakdown).map(([type, qty]) => ({
    plasticType: type,
    quantity: qty
  }));

  // Top contributors
  const userContributions = {};
  contributions.forEach(c => {
    if (!userContributions[c.user._id]) {
      userContributions[c.user._id] = {
        userId: c.user._id,
        name: c.user.name,
        totalWeight: 0,
        totalPoints: 0
      };
    }
    userContributions[c.user._id].totalWeight += c.quantity;
    userContributions[c.user._id].totalPoints += c.pointsEarned;
  });

  const topContributors = Object.values(userContributions)
    .sort((a, b) => b.totalWeight - a.totalWeight)
    .slice(0, 10);

  // Incentive summary
  const incentives = await Incentive.find({
    awardedDate: { $gte: start, $lte: end }
  });

  const totalAwarded = incentives.length;
  const totalRedeemed = incentives.filter(i => i.rewardStatus === 'REDEEMED').length;

  // Create report
  const report = new this({
    title: `${type} Report - ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
    reportType: type,
    generatedBy: adminId,
    dateRange: { start, end },
    summary: {
      totalContributions: contributions.length,
      totalUsers,
      totalWeight,
      totalPointsAwarded: totalPoints,
      averageContribution: contributions.length > 0 ? totalWeight / contributions.length : 0,
      activeUsers: Object.keys(userContributions).length
    },
    plasticBreakdown: breakdownArray,
    userEngagement: {
      newUsers,
      returningUsers: Object.keys(userContributions).length - newUsers,
      topContributors
    },
    incentiveSummary: {
      totalAwarded,
      totalRedeemed,
      redemptionRate: totalAwarded > 0 ? (totalRedeemed / totalAwarded) * 100 : 0,
      averagePointsPerUser: Object.keys(userContributions).length > 0 
        ? totalPoints / Object.keys(userContributions).length 
        : 0
    }
  });

  await report.save();
  return report;
};

module.exports = mongoose.model('Report', reportSchema);
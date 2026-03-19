// server/src/models/Incentive.js
const mongoose = require('mongoose');

const incentiveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  contribution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlasticContribution',
    required: [true, 'Contribution reference is required']
  },
  pointsEarned: {
    type: Number,
    required: [true, 'Points earned is required'],
    min: [0, 'Points cannot be negative']
  },
  rewardType: {
    type: String,
    required: [true, 'Reward type is required'],
    enum: {
      values: ['POINTS', 'VOUCHER', 'CASH', 'DISCOUNT', 'PRODUCT', 'OTHER'],
      message: '{VALUE} is not a valid reward type'
    },
    default: 'POINTS'
  },
  rewardValue: {
    type: Number,
    required: [true, 'Reward value is required'],
    min: [0, 'Reward value cannot be negative']
  },
  rewardStatus: {
    type: String,
    required: [true, 'Reward status is required'],
    enum: {
      values: ['PENDING', 'AWARDED', 'REDEEMED', 'EXPIRED', 'CANCELLED'],
      message: '{VALUE} is not a valid reward status'
    },
    default: 'PENDING'
  },
  rewardCode: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.awardedDate;
      },
      message: 'Expiry date must be after awarded date'
    }
  },
  awardedDate: {
    type: Date,
    default: Date.now
  },
  redeemedDate: {
    type: Date
  },
  redeemedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
incentiveSchema.index({ user: 1, rewardStatus: 1 });
incentiveSchema.index({ contribution: 1 }, { unique: true });
incentiveSchema.index({ rewardCode: 1 });
incentiveSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

// Generate unique reward code
incentiveSchema.pre('save', async function(next) {
  if (this.isNew && !this.rewardCode) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.rewardCode = `RWD-${timestamp}-${random}`;
  }
  next();
});

// Method to redeem incentive
incentiveSchema.methods.redeem = function(adminId) {
  if (this.rewardStatus !== 'AWARDED') {
    throw new Error('Incentive cannot be redeemed in its current status');
  }
  
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.rewardStatus = 'EXPIRED';
    throw new Error('Incentive has expired');
  }
  
  this.rewardStatus = 'REDEEMED';
  this.redeemedDate = new Date();
  this.redeemedBy = adminId;
};

// Method to check if incentive is valid
incentiveSchema.methods.isValid = function() {
  if (this.rewardStatus !== 'AWARDED') return false;
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.rewardStatus = 'EXPIRED';
    return false;
  }
  return true;
};

module.exports = mongoose.model('Incentive', incentiveSchema);
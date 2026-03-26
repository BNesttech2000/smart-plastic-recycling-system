const mongoose = require('mongoose');

const rewardRedemptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true
  },
  pointsSpent: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  redemptionCode: {
    type: String,
    unique: true
  },
  redeemedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate unique redemption code
rewardRedemptionSchema.pre('save', async function(next) {
  if (this.isNew && !this.redemptionCode) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.redemptionCode = `RWD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('RewardRedemption', rewardRedemptionSchema);
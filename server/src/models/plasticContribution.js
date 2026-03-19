// server/src/models/PlasticContribution.js
const mongoose = require('mongoose');

const plasticContributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  plasticType: {
    type: String,
    required: [true, 'Plastic type is required'],
    enum: {
      values: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'],
      message: '{VALUE} is not a valid plastic type'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be at least 0.1 kg'],
    max: [1000, 'Quantity cannot exceed 1000 kg per submission']
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'lbs'],
    default: 'kg'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending'
  },
  collectionPoint: {
    type: String,
    trim: true,
    maxlength: [100, 'Collection point cannot exceed 100 characters']
  },
  collectionDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator'
  },
  approvedDate: {
    type: Date
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  processedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for geospatial queries
plasticContributionSchema.index({ location: '2dsphere' });

// Index for faster queries
plasticContributionSchema.index({ user: 1, createdAt: -1 });
plasticContributionSchema.index({ status: 1 });
plasticContributionSchema.index({ plasticType: 1 });

// Calculate points before saving (if not already calculated)
plasticContributionSchema.pre('save', async function(next) {
  if (this.isNew && !this.pointsEarned) {
    const { calculateIncentivePoints } = require('../utils/incentiveCalculator');
    this.pointsEarned = calculateIncentivePoints(this.plasticType, this.quantity);
  }
  next();
});

module.exports = mongoose.model('PlasticContribution', plasticContributionSchema);
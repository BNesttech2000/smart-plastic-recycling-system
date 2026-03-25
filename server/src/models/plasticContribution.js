const mongoose = require('mongoose');
const { calculateIncentivePoints } = require('../utils/incentiveCalculator');

const plasticContributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  plasticType: {
    type: String,
    required: [true, 'Plastic type is required'],
    enum: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be at least 0.1 kg'],
    max: [1000, 'Quantity cannot exceed 1000 kg']
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
    maxlength: 100
  },
  collectionDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Administrator'
  },
  approvedDate: Date,
  pointsEarned: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  rejectionReason: String,
  processedDate: Date
}, {
  timestamps: true
});

// Indexes
plasticContributionSchema.index({ location: '2dsphere' });
plasticContributionSchema.index({ user: 1, createdAt: -1 });
plasticContributionSchema.index({ status: 1 });

// Pre-save hook
plasticContributionSchema.pre('save', async function(next) {
  if (this.isNew && !this.pointsEarned) {
    this.pointsEarned = calculateIncentivePoints(this.plasticType, this.quantity);
  }
  next();
});

// ✅ FIXED EXPORT (prevents OverwriteModelError)
module.exports = mongoose.models.PlasticContribution ||
                 mongoose.model('PlasticContribution', plasticContributionSchema);
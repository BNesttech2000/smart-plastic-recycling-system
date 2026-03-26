const mongoose = require('mongoose');

const recyclingCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Center name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  hours: {
    type: String,
    required: [true, 'Operating hours are required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  acceptedPlastics: [{
    type: String,
    enum: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER']
  }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

recyclingCenterSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('RecyclingCenter', recyclingCenterSchema);
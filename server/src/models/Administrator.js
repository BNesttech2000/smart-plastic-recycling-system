// server/src/models/Administrator.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const administratorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: [{
    type: String,
    enum: ['manage_users', 'manage_contributions', 'manage_incentives', 'view_reports', 'manage_admins']
  }],
  department: {
    type: String,
    enum: ['operations', 'finance', 'management', 'support'],
    default: 'operations'
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: 'admin-avatar.png'
  },
  activityLog: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    ip: String,
    details: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Hash password before saving
administratorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
administratorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Log admin activity
administratorSchema.methods.logActivity = function(action, ip, details = {}) {
  this.activityLog.push({
    action,
    ip,
    details,
    timestamp: new Date()
  });
};

module.exports = mongoose.model('Administrator', administratorSchema);
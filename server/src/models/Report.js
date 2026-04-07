const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'],
    default: 'MONTHLY'
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  dateRange: {
    start: Date,
    end: Date
  },
  summary: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['GENERATING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED'
  },
  format: {
    type: String,
    enum: ['JSON', 'PDF', 'CSV', 'EXCEL'],
    default: 'JSON'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['article', 'video', 'infographic'],
    required: true
  },
  content: {
    type: String,
    required: function() { return this.type === 'article'; }
  },
  url: {
    type: String,
    required: function() { return this.type === 'video'; }
  },
  duration: String,
  readTime: String,
  imageUrl: String,
  downloadUrl: {
    type: String,
    required: function() { return this.type === 'infographic'; }
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
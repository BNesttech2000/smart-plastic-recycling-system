// server/src/socket/socketManager.js
const PlasticContribution = require('../models/PlasticContribution');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }
  });
  
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join admin room for real-time updates
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log('Admin joined room:', socket.id);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  return io;
};

// Emit real-time updates
const emitNewContribution = async (contribution) => {
  if (!io) return;
  
  try {
    const populatedContribution = await PlasticContribution.findById(contribution._id)
      .populate('user', 'name email');
    
    io.to('admin-room').emit('new-contribution', {
      type: 'NEW_CONTRIBUTION',
      data: populatedContribution,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error emitting new contribution:', error);
  }
};

const emitContributionUpdate = async (contributionId, status) => {
  if (!io) return;
  
  try {
    const contribution = await PlasticContribution.findById(contributionId)
      .populate('user', 'name email');
    
    io.to('admin-room').emit('contribution-updated', {
      type: 'CONTRIBUTION_UPDATED',
      data: contribution,
      status: status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error emitting contribution update:', error);
  }
};

const emitStatsUpdate = async (stats) => {
  if (!io) return;
  
  io.to('admin-room').emit('stats-updated', {
    type: 'STATS_UPDATED',
    data: stats,
    timestamp: new Date()
  });
};

module.exports = {
  initializeSocket,
  emitNewContribution,
  emitContributionUpdate,
  emitStatsUpdate
};
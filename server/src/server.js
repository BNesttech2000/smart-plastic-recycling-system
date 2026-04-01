const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
const fs = require('fs');

// Force Node.js to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables
dotenv.config();

// Map MONGODB_URI to MONGO_URI if needed
if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
  process.env.MONGO_URI = process.env.MONGODB_URI;
}

// Import routes
const userRoutes = require('./routes/userRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const incentiveRoutes = require('./routes/incentiveRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize express app
const app = express();

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../uploads/contributions'),
  path.join(__dirname, '../uploads/profiles'),
  path.join(__dirname, '../uploads/temp')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/incentives', incentiveRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Smart Plastic Collection and Recycling Incentive System API',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      users: '/api/users',
      contributions: '/api/contributions',
      incentives: '/api/incentives',
      admin: '/api/admin',
      reports: '/api/reports'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbState] || 'unknown';

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      state: dbState,
      name: mongoose.connection.name || 'unknown'
    },
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection with retry logic
const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      connectTimeoutMS: 30000
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create default admin if not exists
    try {
      const Administrator = require('./models/Administrator');
      const adminExists = await Administrator.findOne({ email: process.env.ADMIN_EMAIL });
      
      if (!adminExists && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        await Administrator.create({
          name: 'Super Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'super_admin',
          permissions: ['manage_users', 'manage_contributions', 'manage_incentives', 'view_reports', 'manage_admins']
        });
        console.log('👤 Default admin created');
      }
    } catch (adminError) {
      // Silent fail for admin creation
    }

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`⏳ Retrying connection in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retryCount + 1);
    }

    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}\n`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Closing server...`);
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
const mongoose = require('mongoose');
const logger = require('./winston');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Campus_Connect';

    logger.info(`Attempting to connect to MongoDB at: ${mongoUri}`);

    const conn = await mongoose.connect(mongoUri, {
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // Increased timeout for connection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    logger.info(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('connected', () => {
      logger.info('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('👋 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (err) {
    logger.error('❌ Database connection failed:', err.message);
    logger.error('❌ Full error details:', err);
    logger.error('💡 Make sure MongoDB is running on your system');
    logger.error('🔧 For Windows: Run MongoDB as Administrator or use MongoDB Compass');
    logger.error('🐳 Alternative: Use MongoDB Atlas (cloud) or Docker');
    process.exit(1);
  }
};

module.exports = connectDB;
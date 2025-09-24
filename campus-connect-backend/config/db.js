const mongoose = require('mongoose');
const logger = require('./winston');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Campus_Connect';

    logger.info(`Attempting to connect to MongoDB at: ${mongoUri}`);

    const conn = await mongoose.connect(mongoUri, {
      
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
      bufferCommands: false, 
      maxPoolSize: 10, 
    });

    logger.info(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    
    mongoose.connection.on('connected', () => {
      logger.info('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  Mongoose disconnected from MongoDB');
    });

    
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
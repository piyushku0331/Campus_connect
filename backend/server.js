<<<<<<< HEAD
// Core server dependencies for Campus Connect backend
const express = require('express'); // Web framework for Node.js
const http = require('http'); // HTTP server for Express and Socket.io
const { Server } = require('socket.io'); // Real-time bidirectional communication
const helmet = require('helmet'); // Security middleware for HTTP headers
const compression = require('compression'); // Response compression middleware
const cors = require('cors'); // Cross-Origin Resource Sharing middleware
const cookieParser = require('cookie-parser'); // Parse cookies from HTTP requests
const mongoose = require('mongoose'); // MongoDB object modeling for Node.js
=======
// Core server dependencies for Campus Connect backend
const express = require('express'); // Web framework for Node.js
const http = require('http'); // HTTP server for Express and Socket.io
const { Server } = require('socket.io'); // Real-time bidirectional communication
const helmet = require('helmet'); // Security middleware for HTTP headers
const compression = require('compression'); // Response compression middleware
const cors = require('cors'); // Cross-Origin Resource Sharing middleware
const cookieParser = require('cookie-parser'); // Parse cookies from HTTP requests
const mongoose = require('mongoose'); // MongoDB object modeling for Node.js

// Database connection function with error handling
>>>>>>> d751ccca9135d403512bcd584d44e93ea06ad828
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-connect';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};

// Logging utility for application events and errors
const logger = require('./src/utils/logger');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Express application
const app = express();

<<<<<<< HEAD
// Define CORS configuration to avoid duplication
const corsOptions = {
=======
// Define CORS configuration to avoid duplication
const corsOptions = {
>>>>>>> d751ccca9135d403512bcd584d44e93ea06ad828
  origin: function (origin, callback) {
    // Define allowed origins for security (development and production URLs)
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server (default)
      'http://localhost:5174', // Alternative Vite port
      'http://localhost:3000', // Alternative dev server
      process.env.FRONTEND_URL // Production frontend URL from environment
    ].filter(Boolean); // Remove any undefined values

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Allowed headers
};

// CORS middleware for Express routes - controls cross-origin requests
app.use(cors(corsOptions));

// Create HTTP server and initialize Socket.io for real-time communication
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions // Reuse CORS configuration for consistency
});

// Security middleware - sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''], // Only allow resources from same origin
      styleSrc: ['\'self\'', '\'unsafe-inline\''], // Allow inline styles for UI components
      scriptSrc: ['\'self\''], // Only allow scripts from same origin
      imgSrc: ['\'self\'', 'data:', 'https:'], // Allow images from same origin, data URLs, and HTTPS
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow cross-origin resource sharing
}));

// Response compression middleware - reduces response size for better performance
app.use(compression({
  level: 6, // Compression level (1-9, higher = better compression but slower)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Skip compression if client sends 'x-no-compression' header
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res); // Use default compression filter
  }
}));

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON request bodies with size limit
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request bodies with size limit (for form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

<<<<<<< HEAD
// Serve static files from uploads directory with caching headers
app.use('/uploads', express.static('uploads', {
  maxAge: '30d', // Cache files for 30 days
  etag: true, // Enable ETag for caching
  lastModified: true, // Send Last-Modified header
  setHeaders: (res) => {
    // Set Cache-Control header for long-term caching
    res.set('Cache-Control', 'public, max-age=2592000'); // 30 days in seconds
  }
}));

=======
// Serve static files from uploads directory with caching headers
>>>>>>> d751ccca9135d403512bcd584d44e93ea06ad828
app.use('/uploads', express.static('uploads', {
  maxAge: '30d', // Cache files for 30 days
  etag: true, // Enable ETag for caching
  lastModified: true, // Send Last-Modified header
  setHeaders: (res) => {
    // Set Cache-Control header for long-term caching
    res.set('Cache-Control', 'public, max-age=2592000'); // 30 days in seconds
  }
}));

// Mount API routes under /api prefix
app.use('/api', require('./src/routes'));

// Health check endpoint for monitoring and load balancer checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Global error handling middleware - catches and logs all unhandled errors
app.use((err, req, res, next) => {
  logger.error('Error occurred:', err);
  // Only send error response if headers haven't been sent yet
  if (!res.headersSent) {
    res.status(500).json({ error: 'Something went wrong!' });
  } else {
    next(err);
  }
});

// 404 handler - catches requests to non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.io connection handling for real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle incoming messages and broadcast to all connected clients
  socket.on('sendMessage', (data) => {
    console.log('Message received:', data);
    io.emit('receiveMessage', data); // Broadcast to all clients
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Main server startup function with database connection and error handling
const startServer = async () => {
  try {
    // Establish database connection before starting server
    await connectDB();

    // Start HTTP server with Socket.io support
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`🚀 Campus Connect backend server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('❌ Failed to start server:', error.message);
    process.exit(1); // Exit with error code
  }
};

// Initialize server startup
startServer();

// Export Express app for testing purposes
module.exports = app;
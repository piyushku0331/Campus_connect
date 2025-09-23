const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./config/winston');
const { globalErrorHandler, handleUnhandledRejections, handleUncaughtExceptions } = require('./middleware/errorMiddleware');

dotenv.config();

// Handle uncaught exceptions (must be first)
process.on('uncaughtException', handleUncaughtExceptions);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => handleUnhandledRejections(err, null));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/materials', require('./routes/studyMaterialRoutes'));
app.use('/api/lost-items', require('./routes/lostItemRoutes'));
app.use('/api/helpline', require('./routes/helplineRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));

// Global error handler (must be last middleware)
app.use(globalErrorHandler);

// Socket.IO
io.on('connection', (socket) => {
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
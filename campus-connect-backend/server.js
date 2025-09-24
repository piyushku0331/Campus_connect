const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const connectDB = require('./config/db');
const logger = require('./config/winston');
const { globalErrorHandler, handleUnhandledRejections, handleUncaughtExceptions } = require('./middleware/errorMiddleware');

dotenv.config();
process.on('uncaughtException', handleUncaughtExceptions);
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
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '30d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=2592000');
  }
}));

const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && (Date.now() - cached.timestamp) < duration) {
      logger.info(`Cache hit for ${key}`);
      return res.json(cached.data);
    }

    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, { data, timestamp: Date.now() });
      return originalJson.call(this, data);
    };

    next();
  };
};

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', cacheMiddleware(), require('./routes/eventRoutes'));
app.use('/api/placements', cacheMiddleware(), require('./routes/placementRoutes'));
app.use('/api/notices', cacheMiddleware(), require('./routes/noticeRoutes'));
app.use('/api/materials', cacheMiddleware(), require('./routes/studyMaterialRoutes'));
app.use('/api/lost-items', cacheMiddleware(), require('./routes/lostItemRoutes'));
app.use('/api/helpline', cacheMiddleware(), require('./routes/helplineRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/posts', cacheMiddleware(), require('./routes/postRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));

app.use(globalErrorHandler);

io.on('connection', (socket) => {
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });
});

const PORT = process.env.PORT || 5000;

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
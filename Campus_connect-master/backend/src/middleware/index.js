const { verifyToken, requireAuth } = require('./authMiddleware');
const { errorHandler, notFoundHandler, asyncHandler, rateLimitHandler } = require('./errorMiddleware');
module.exports = {
  verifyToken,
  requireAuth,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  rateLimitHandler,
};

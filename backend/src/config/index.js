const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expire: process.env.JWT_EXPIRE || '7d'
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_connect'
  }
};
module.exports = { config };

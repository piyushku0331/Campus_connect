const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const User = require('../src/models/User');
const Post = require('../src/models/Post');

// Mock email service
jest.mock('../src/utils/emailService', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendAdminNewUserNotification: jest.fn().mockResolvedValue(true)
}));

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

let mongoServer;
let app;
let adminToken;
let adminUser;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create minimal test app with admin routes
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add cookie parser for refresh tokens
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // CORS for testing
  const cors = require('cors');
  app.use(cors({ origin: true, credentials: true }));

  // Mount auth and admin routes
  app.use('/api/auth', require('../src/routes/auth'));
  app.use('/api/admin', require('../src/routes/admin'));

  // Error handling
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    res.status(500).json({ error: 'Internal server error' });
  });
});

afterAll(async () => {
  // Close database connection and stop server
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  // Create admin user
  adminUser = new User({
    email: 'admin@chitkara.edu.in',
    password: 'admin123',
    name: 'Admin User',
    age: 25,
    department: 'Computer Science',
    semester: '4th Year',
    role: 'admin',
    isVerified: true
  });
  await adminUser.save();

  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'admin@chitkara.edu.in',
      password: 'admin123'
    });

  adminToken = loginResponse.body.data.session.access_token;
});

describe('Admin API Tests', () => {
  describe('Authentication', () => {
    it('should reject admin routes without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/analytics')
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it('should reject admin routes for non-admin users', async () => {
      // Create regular user
      const regularUser = new User({
        email: 'user@chitkara.edu.in',
        password: 'user123',
        name: 'Regular User',
        age: 20,
        department: 'Computer Science',
        semester: '3rd Year',
        role: 'user',
        isVerified: true
      });
      await regularUser.save();

      // Login as regular user
      const loginResponse = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'user@chitkara.edu.in',
          password: 'user123'
        });

      const userToken = loginResponse.body.data.session.access_token;

      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/admin/analytics', () => {
    it('should return analytics data for admin', async () => {
      // Create some test data
      const user1 = new User({
        email: 'user1@chitkara.edu.in',
        password: 'pass123',
        name: 'User 1',
        age: 20,
        department: 'CS',
        semester: '3rd',
        isVerified: true
      });
      const user2 = new User({
        email: 'user2@chitkara.edu.in',
        password: 'pass123',
        name: 'User 2',
        age: 21,
        department: 'IT',
        semester: '2nd',
        isVerified: false
      });
      await user1.save();
      await user2.save();

      const post = new Post({
        author: user1._id,
        content: 'Test post',
        created_at: new Date()
      });
      await post.save();

      const response = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.userMetrics).toBeDefined();
      expect(response.body.contentMetrics).toBeDefined();
      expect(response.body.engagementMetrics).toBeDefined();
      expect(response.body.userMetrics.totalUsers).toBe(3); // admin + 2 users
      expect(response.body.userMetrics.activeUsers).toBe(2); // admin + user1
      expect(response.body.userMetrics.adminUsers).toBe(1);
      expect(response.body.contentMetrics.totalPosts).toBe(1);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return list of users for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].email).toBe('admin@chitkara.edu.in');
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should update user role successfully', async () => {
      const regularUser = new User({
        email: 'regular@chitkara.edu.in',
        password: 'pass123',
        name: 'Regular User',
        age: 20,
        department: 'CS',
        semester: '3rd',
        isVerified: true
      });
      await regularUser.save();

      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'admin' })
        .expect(200);

      expect(response.body.role).toBe('admin');
    });

    it('should reject invalid role', async () => {
      const regularUser = new User({
        email: 'regular@chitkara.edu.in',
        password: 'pass123',
        name: 'Regular User',
        age: 20,
        department: 'CS',
        semester: '3rd',
        isVerified: true
      });
      await regularUser.save();

      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'invalid' })
        .expect(400);

      expect(response.body.error).toBe('Invalid role');
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should delete user successfully', async () => {
      const regularUser = new User({
        email: 'regular@chitkara.edu.in',
        password: 'pass123',
        name: 'Regular User',
        age: 20,
        department: 'CS',
        semester: '3rd',
        isVerified: true
      });
      await regularUser.save();

      const response = await request(app)
        .delete(`/api/admin/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('User deleted successfully');
    });
  });
});
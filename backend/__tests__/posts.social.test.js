const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const User = require('../src/models/User');
const Creator = require('../src/models/Creator');
const Post = require('../src/models/Post');

// Mock email service
jest.mock('../src/utils/emailService', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendAdminNewUserNotification: jest.fn().mockResolvedValue(true)
}));

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

let mongoServer;
let app;
let accessToken;
let user;
let creator;
let post;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create minimal test app with only posts and creators routes
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add cookie parser for refresh tokens
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // CORS for testing
  const cors = require('cors');
  app.use(cors({ origin: true, credentials: true }));

  // Mount routes
  app.use('/api/auth', require('../src/routes/auth'));
  app.use('/api/posts', require('../src/routes/posts'));
  app.use('/api/creators', require('../src/routes/creators'));

  // Error handling
  app.use((err, req, res, next) => {
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

  // Create test user
  user = new User({
    email: 'test@chitkara.edu.in',
    password: 'password123',
    name: 'Test User',
    age: 20,
    department: 'Computer Science',
    semester: '3rd Year',
    isVerified: true
  });
  await user.save();

  // Create test creator
  creator = new Creator({
    user: user._id,
    displayName: 'Test Creator',
    bio: 'Test bio',
    isVerified: true,
    verificationStatus: 'approved',
    accountStatus: 'active'
  });
  await creator.save();

  // Create test post
  post = new Post({
    creator: creator._id,
    type: 'post',
    caption: 'Test post',
    media: [{ type: 'image', url: 'test.jpg' }],
    category: 'education'
  });
  await post.save();

  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'test@chitkara.edu.in',
      password: 'password123'
    });

  accessToken = loginResponse.body.data.session.access_token;
});

describe('Posts Social Features API Tests', () => {
  describe('POST /api/posts/:postId/like - Like Toggle', () => {
    it('should like a post successfully', async () => {
      const response = await request(app)
        .post(`/api/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.liked).toBe(true);
      expect(response.body.likeCount).toBe(1);

      // Verify like was added to database
      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likes.length).toBe(1);
      expect(updatedPost.likes[0].user.toString()).toBe(user._id.toString());
    });

    it('should unlike a post successfully', async () => {
      // First like the post
      await request(app)
        .post(`/api/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Then unlike it
      const response = await request(app)
        .post(`/api/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.liked).toBe(false);
      expect(response.body.likeCount).toBe(0);

      // Verify like was removed from database
      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likes.length).toBe(0);
    });

    it('should handle multiple users liking the same post', async () => {
      // Create another user
      const user2 = new User({
        email: 'test2@chitkara.edu.in',
        password: 'password123',
        name: 'Test User 2',
        age: 21,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: true
      });
      await user2.save();

      // Login as second user
      const loginResponse2 = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test2@chitkara.edu.in',
          password: 'password123'
        });
      const accessToken2 = loginResponse2.body.data.session.access_token;

      // Both users like the post
      await request(app)
        .post(`/api/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      await request(app)
        .post(`/api/posts/${post._id}/like`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(200);

      // Verify both likes are recorded
      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likes.length).toBe(2);
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/posts/${fakeId}/like`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.error).toBe('Post not found');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .post(`/api/posts/${post._id}/like`)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/posts/:postId/comment - Add Comment', () => {
    it('should add comment successfully', async () => {
      const commentData = {
        content: 'This is a test comment'
      };

      const response = await request(app)
        .post(`/api/posts/${post._id}/comment`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body.user.toString()).toBe(user._id.toString());
      expect(response.body.content).toBe(commentData.content);
      expect(response.body.userName).toBe(user.name);

      // Verify comment was added to database
      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.comments.length).toBe(1);
      expect(updatedPost.comments[0].content).toBe(commentData.content);
    });

    it('should reject comment with empty content', async () => {
      const commentData = {
        content: ''
      };

      const response = await request(app)
        .post(`/api/posts/${post._id}/comment`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentData)
        .expect(400);

      expect(response.body.error).toBe('Comment content is required');
    });

    it('should reject comment with only whitespace', async () => {
      const commentData = {
        content: '   '
      };

      const response = await request(app)
        .post(`/api/posts/${post._id}/comment`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentData)
        .expect(400);

      expect(response.body.error).toBe('Comment content is required');
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const commentData = {
        content: 'Test comment'
      };

      const response = await request(app)
        .post(`/api/posts/${fakeId}/comment`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentData)
        .expect(404);

      expect(response.body.error).toBe('Post not found');
    });

    it('should return 401 for unauthenticated request', async () => {
      const commentData = {
        content: 'Test comment'
      };

      const response = await request(app)
        .post(`/api/posts/${post._id}/comment`)
        .send(commentData)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/posts/:postId - View Counter', () => {
    it('should increment view count when fetching post', async () => {
      const initialViews = post.views;

      await request(app)
        .get(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.views).toBe(initialViews + 1);
    });

    it('should return post with populated data', async () => {
      const response = await request(app)
        .get(`/api/posts/${post._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body._id).toBe(post._id.toString());
      expect(response.body.caption).toBe(post.caption);
      expect(response.body.creator.displayName).toBe(creator.displayName);
      expect(response.body.likes).toBeDefined();
      expect(response.body.comments).toBeDefined();
    });
  });

  describe('POST /api/creators/:creatorId/follow - Follow Toggle', () => {
    let user2, creator2, accessToken2;

    beforeEach(async () => {
      // Create second user and creator
      user2 = new User({
        email: 'test2@chitkara.edu.in',
        password: 'password123',
        name: 'Test User 2',
        age: 21,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: true
      });
      await user2.save();

      creator2 = new Creator({
        user: user2._id,
        displayName: 'Test Creator 2',
        bio: 'Test bio 2',
        isVerified: true,
        verificationStatus: 'approved',
        accountStatus: 'active'
      });
      await creator2.save();

      // Login as second user
      const loginResponse2 = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test2@chitkara.edu.in',
          password: 'password123'
        });
      accessToken2 = loginResponse2.body.data.session.access_token;
    });

    it('should follow a creator successfully', async () => {
      const response = await request(app)
        .post(`/api/creators/${creator2._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.followed).toBe(true);
      expect(response.body.followerCount).toBe(1);

      // Verify follow was added to database
      const updatedCreator2 = await Creator.findById(creator2._id);
      const updatedCreator1 = await Creator.findById(creator._id);

      expect(updatedCreator2.followers.length).toBe(1);
      expect(updatedCreator2.followers[0].user.toString()).toBe(user._id.toString());
      expect(updatedCreator1.following.length).toBe(1);
      expect(updatedCreator1.following[0].creator.toString()).toBe(creator2._id.toString());
    });

    it('should unfollow a creator successfully', async () => {
      // First follow the creator
      await request(app)
        .post(`/api/creators/${creator2._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Then unfollow
      const response = await request(app)
        .post(`/api/creators/${creator2._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.followed).toBe(false);
      expect(response.body.followerCount).toBe(0);

      // Verify follow was removed from database
      const updatedCreator2 = await Creator.findById(creator2._id);
      const updatedCreator1 = await Creator.findById(creator._id);

      expect(updatedCreator2.followers.length).toBe(0);
      expect(updatedCreator1.following.length).toBe(0);
    });

    it('should prevent following yourself', async () => {
      const response = await request(app)
        .post(`/api/creators/${creator._id}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(response.body.error).toBe('Cannot follow yourself');
    });

    it('should return 404 for non-existent creator', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/creators/${fakeId}/follow`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.error).toBe('Creator not found');
    });

    it('should return 400 if user is not a creator', async () => {
      // Create a user without creator profile
      const user3 = new User({
        email: 'test3@chitkara.edu.in',
        password: 'password123',
        name: 'Test User 3',
        age: 22,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: true
      });
      await user3.save();

      const loginResponse3 = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test3@chitkara.edu.in',
          password: 'password123'
        });
      const accessToken3 = loginResponse3.body.data.session.access_token;

      const response = await request(app)
        .post(`/api/creators/${creator2._id}/follow`)
        .set('Authorization', `Bearer ${accessToken3}`)
        .expect(400);

      expect(response.body.error).toBe('User must be a creator to follow others');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .post(`/api/creators/${creator2._id}/follow`)
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });
});
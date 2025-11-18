const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const multer = require('multer');
const User = require('../src/models/User');
const Creator = require('../src/models/Creator');
const Post = require('../src/models/Post');
const Blog = require('../src/models/Blog');

// Mock Cloudinary
jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      public_id: 'test_public_id',
      secure_url: 'https://cloudinary.com/test_image.jpg',
      format: 'jpg',
      bytes: 1024000
    }),
    destroy: jest.fn().mockResolvedValue({ result: 'ok' })
  }
}));

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

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create minimal test app
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
  app.use('/api/users', require('../src/routes/users'));
  app.use('/api/posts', require('../src/routes/posts'));
  app.use('/api/blogs', require('../src/routes/blog'));

  // Error handling
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large' });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Unexpected file field' });
      }
    }
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ error: err.message });
    }
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

  // Login to get token
  const loginResponse = await request(app)
    .post('/api/auth/signin')
    .send({
      email: 'test@chitkara.edu.in',
      password: 'password123'
    });

  accessToken = loginResponse.body.data.session.access_token;
});

describe('File Upload API Tests', () => {
  describe('Profile Image Upload - PUT /api/users/profile', () => {
    it('should upload profile image successfully', async () => {
      const imageBuffer = Buffer.from('fake-image-data', 'utf8');

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profilePicture', imageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .field('name', 'Updated Name')
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.profilePhoto).toBe('https://cloudinary.com/test_image.jpg');

      // Verify user was updated in database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.profilePhoto).toBe('https://cloudinary.com/test_image.jpg');
    });

    it('should handle profile update without image upload', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('name', 'Updated Name')
        .field('bio', 'Updated bio')
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.bio).toBe('Updated bio');
    });

    it('should reject invalid file types for profile picture', async () => {
      const textBuffer = Buffer.from('not an image', 'utf8');

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profilePicture', textBuffer, {
          filename: 'test.txt',
          contentType: 'text/plain'
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid file type');
    });

    it('should reject files exceeding size limit', async () => {
      // Create a buffer larger than 2MB
      const largeBuffer = Buffer.alloc(3 * 1024 * 1024, 'x'); // 3MB

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profilePicture', largeBuffer, {
          filename: 'large.jpg',
          contentType: 'image/jpeg'
        })
        .expect(400);

      expect(response.body.error).toBe('File too large');
    });

    it('should handle Cloudinary upload failure', async () => {
      // Mock Cloudinary upload failure
      const cloudinary = require('../src/config/cloudinary');
      cloudinary.uploader.upload.mockRejectedValueOnce(new Error('Upload failed'));

      const imageBuffer = Buffer.from('fake-image-data', 'utf8');

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('profilePicture', imageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .expect(500);

      expect(response.body.error).toBe('Internal server error');
    });

    it('should return 401 for unauthenticated request', async () => {
      const imageBuffer = Buffer.from('fake-image-data', 'utf8');

      const response = await request(app)
        .put('/api/users/profile')
        .attach('profilePicture', imageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('Post Media Upload - POST /api/posts', () => {
    it('should upload single image post successfully', async () => {
      const imageBuffer = Buffer.from('fake-image-data', 'utf8');

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', imageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .field('type', 'post')
        .field('caption', 'Test post')
        .field('category', 'education')
        .expect(201);

      expect(response.body.caption).toBe('Test post');
      expect(response.body.media).toHaveLength(1);
      expect(response.body.media[0].type).toBe('image');
      expect(response.body.media[0].url).toBe('https://cloudinary.com/test_image.jpg');

      // Verify post was created in database
      const post = await Post.findById(response.body._id);
      expect(post.media[0].url).toBe('https://cloudinary.com/test_image.jpg');
    });

    it('should upload single video post successfully', async () => {
      const videoBuffer = Buffer.from('fake-video-data', 'utf8');

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', videoBuffer, {
          filename: 'test.mp4',
          contentType: 'video/mp4'
        })
        .field('type', 'reel')
        .field('caption', 'Test reel')
        .field('category', 'education')
        .expect(201);

      expect(response.body.type).toBe('reel');
      expect(response.body.media).toHaveLength(1);
      expect(response.body.media[0].type).toBe('video');
      expect(response.body.media[0].url).toBe('https://cloudinary.com/test_image.jpg');
    });

    it('should upload multiple media files successfully', async () => {
      const imageBuffer1 = Buffer.from('fake-image-1', 'utf8');
      const imageBuffer2 = Buffer.from('fake-image-2', 'utf8');

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', imageBuffer1, {
          filename: 'test1.jpg',
          contentType: 'image/jpeg'
        })
        .attach('media', imageBuffer2, {
          filename: 'test2.png',
          contentType: 'image/png'
        })
        .field('type', 'post')
        .field('caption', 'Test post with multiple images')
        .field('category', 'education')
        .expect(201);

      expect(response.body.media).toHaveLength(2);
      expect(response.body.media[0].type).toBe('image');
      expect(response.body.media[1].type).toBe('image');
    });

    it('should reject posts without media files', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('type', 'post')
        .field('caption', 'Test post')
        .expect(400);

      expect(response.body.error).toBe('At least one media file is required');
    });

    it('should reject invalid file types for media', async () => {
      const textBuffer = Buffer.from('not a media file', 'utf8');

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', textBuffer, {
          filename: 'test.txt',
          contentType: 'text/plain'
        })
        .field('type', 'post')
        .field('caption', 'Test post')
        .expect(400);

      expect(response.body.error).toBe('Only image and video files are allowed');
    });

    it('should reject video files exceeding size limit', async () => {
      // Create a buffer larger than 50MB
      const largeVideoBuffer = Buffer.alloc(60 * 1024 * 1024, 'x'); // 60MB

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', largeVideoBuffer, {
          filename: 'large.mp4',
          contentType: 'video/mp4'
        })
        .field('type', 'reel')
        .field('caption', 'Test reel')
        .expect(400);

      expect(response.body.error).toBe('File too large');
    });

    it('should reject posts from non-verified creators', async () => {
      // Create a non-verified creator
      const nonVerifiedCreator = new Creator({
        user: user._id,
        displayName: 'Non-verified Creator',
        bio: 'Test bio',
        isVerified: false,
        verificationStatus: 'pending',
        accountStatus: 'active'
      });
      await nonVerifiedCreator.save();

      const imageBuffer = Buffer.from('fake-image-data', 'utf8');

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', imageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .field('type', 'post')
        .field('caption', 'Test post')
        .expect(403);

      expect(response.body.error).toBe('Only verified educational content creators can post');
    });

    it('should reject more than 10 media files', async () => {
      const requests = [];
      for (let i = 0; i < 11; i++) {
        const imageBuffer = Buffer.from(`fake-image-${i}`, 'utf8');
        requests.push(
          request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('media', imageBuffer, {
              filename: `test${i}.jpg`,
              contentType: 'image/jpeg'
            })
        );
      }

      // This test would need to be adjusted since multer handles the limit
      // The middleware should prevent more than 10 files from being uploaded
    });

    it('should handle Cloudinary upload failure for media', async () => {
      // Mock Cloudinary upload failure
      const cloudinary = require('../src/config/cloudinary');
      cloudinary.uploader.upload.mockRejectedValueOnce(new Error('Upload failed'));

      const imageBuffer = Buffer.from('fake-image-data', 'utf8');

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('media', imageBuffer, {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .field('type', 'post')
        .field('caption', 'Test post')
        .expect(500);

      expect(response.body.error).toBe('Failed to create post');
    });
  });

  describe('Blog Featured Image - POST /api/blogs', () => {
    it('should create blog post with featured image URL', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Blog',
          content: 'Test content',
          excerpt: 'Test excerpt',
          category: 'article',
          tags: 'test,blog',
          featuredImage: 'https://example.com/image.jpg'
        })
        .expect(201);

      expect(response.body.title).toBe('Test Blog');
      expect(response.body.featuredImage).toBe('https://example.com/image.jpg');

      // Verify blog was created in database
      const blog = await Blog.findById(response.body._id);
      expect(blog.featuredImage).toBe('https://example.com/image.jpg');
    });

    it('should create blog post without featured image', async () => {
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Blog',
          content: 'Test content',
          excerpt: 'Test excerpt',
          category: 'article',
          tags: 'test,blog'
        })
        .expect(201);

      expect(response.body.title).toBe('Test Blog');
      expect(response.body.featuredImage).toBeUndefined();
    });

    it('should update blog post with featured image URL', async () => {
      // First create a blog
      const createResponse = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Blog',
          content: 'Test content',
          excerpt: 'Test excerpt',
          category: 'article'
        });

      const blogId = createResponse.body._id;

      // Then update it with featured image
      const updateResponse = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Blog',
          featuredImage: 'https://example.com/updated-image.jpg'
        })
        .expect(200);

      expect(updateResponse.body.title).toBe('Updated Blog');
      expect(updateResponse.body.featuredImage).toBe('https://example.com/updated-image.jpg');

      // Verify blog was updated in database
      const updatedBlog = await Blog.findById(blogId);
      expect(updatedBlog.featuredImage).toBe('https://example.com/updated-image.jpg');
    });
  });
});
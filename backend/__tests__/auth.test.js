const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const User = require('../src/models/User');

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

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create minimal test app with only auth routes
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add cookie parser for refresh tokens
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // CORS for testing
  const cors = require('cors');
  app.use(cors({ origin: true, credentials: true }));

  // Mount auth routes
  app.use('/api/auth', require('../src/routes/auth'));

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
});

describe('Authentication API Tests', () => {
  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: '20',
        department: 'Computer Science',
        semester: '3rd Year'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(200);

      expect(response.body.message).toBe('Sign up successful. Check your email for OTP verification.');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });

    it('should reject registration with invalid email domain', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'password123',
        name: 'Test User',
        age: '20',
        department: 'Computer Science',
        semester: '3rd Year'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Only @chitkara.edu.in email addresses are allowed');
    });

    it('should reject registration with password too short', async () => {
      const userData = {
        email: 'test@chitkara.edu.in',
        password: '123',
        name: 'Test User',
        age: '20',
        department: 'Computer Science',
        semester: '3rd Year'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should reject registration with invalid age', async () => {
      const userData = {
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: '15',
        department: 'Computer Science',
        semester: '3rd Year'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Age must be a number between 16 and 30');
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: '20',
        department: 'Computer Science',
        semester: '3rd Year'
      };

      // First registration
      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(200);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User already exists with this email');
    });
  });

  describe('POST /api/auth/signin', () => {
    beforeEach(async () => {
      // Create and verify a test user
      const user = new User({
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: 20,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: true
      });
      await user.save();
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@chitkara.edu.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Sign in successful');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.session.access_token).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const loginData = {
        email: 'test@chitkara.edu.in',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(400);

      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@chitkara.edu.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(400);

      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should reject login for unverified user', async () => {
      // Create unverified user
      const unverifiedUser = new User({
        email: 'unverified@chitkara.edu.in',
        password: 'password123',
        name: 'Unverified User',
        age: 20,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: false
      });
      await unverifiedUser.save();

      const loginData = {
        email: 'unverified@chitkara.edu.in',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(loginData)
        .expect(400);

      expect(response.body.error).toBe('Please verify your email first');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    let user;
    let otp;

    beforeEach(async () => {
      // Create user with OTP
      user = new User({
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: 20,
        department: 'Computer Science',
        semester: '3rd Year',
        otp: '123456',
        otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
      });
      await user.save();
      otp = user.otp;
    });

    it('should verify OTP successfully', async () => {
      const verifyData = {
        email: 'test@chitkara.edu.in',
        otp: otp
      };

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(verifyData)
        .expect(200);

      expect(response.body.message).toBe('OTP verified successfully');
      expect(response.body.data.user.email).toBe(verifyData.email);
      expect(response.body.data.session.access_token).toBeDefined();

      // Check user is now verified
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isVerified).toBe(true);
      expect(updatedUser.otp).toBeNull();
    });

    it('should reject invalid OTP', async () => {
      const verifyData = {
        email: 'test@chitkara.edu.in',
        otp: '999999'
      };

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(verifyData)
        .expect(400);

      expect(response.body.error).toBe('Invalid or expired OTP');
    });

    it('should reject expired OTP', async () => {
      // Set OTP to expired
      user.otpExpires = new Date(Date.now() - 1000); // 1 second ago
      await user.save();

      const verifyData = {
        email: 'test@chitkara.edu.in',
        otp: otp
      };

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(verifyData)
        .expect(400);

      expect(response.body.error).toBe('Invalid or expired OTP');
    });
  });

  describe('POST /api/auth/signout', () => {
    let accessToken;
    let user;

    beforeEach(async () => {
      // Create and login user to get token
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

      const loginResponse = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@chitkara.edu.in',
          password: 'password123'
        });

      accessToken = loginResponse.body.data.session.access_token;
    });

    it('should sign out successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.message).toBe('Sign out successful');
    });
  });

  describe('GET /api/auth/current-user', () => {
    let accessToken;
    let user;

    beforeEach(async () => {
      // Create and login user
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

      const loginResponse = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@chitkara.edu.in',
          password: 'password123'
        });

      accessToken = loginResponse.body.data.session.access_token;
    });

    it('should get current user data', async () => {
      const response = await request(app)
        .get('/api/auth/current-user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user.name).toBe(user.name);
      expect(response.body.user.age).toBe(user.age);
    });

    it('should reject unauthorized access', async () => {
      const response = await request(app)
        .get('/api/auth/current-user')
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      // Create verified user
      const user = new User({
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: 20,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: true
      });
      await user.save();
    });

    it('should send password reset email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@chitkara.edu.in' })
        .expect(200);

      expect(response.body.message).toBe('Password reset email sent. Please check your email.');
    });

    it('should reject non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@chitkara.edu.in' })
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    let resetToken;
    let hashedToken;
    let user;

    beforeEach(async () => {
      // Create user with reset token
      resetToken = 'resettoken123';
      hashedToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');

      user = new User({
        email: 'test@chitkara.edu.in',
        password: 'password123',
        name: 'Test User',
        age: 20,
        department: 'Computer Science',
        semester: '3rd Year',
        isVerified: true,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 3600000 // 1 hour
      });
      await user.save();
    });

    it('should reset password successfully', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'newpassword123'
        })
        .expect(200);

      expect(response.body.message).toBe('Password reset successfully. You can now login with your new password.');
    });

    it('should reject invalid reset token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalidtoken',
          newPassword: 'newpassword123'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid or expired reset token');
    });

    it('should reject expired reset token', async () => {
      // Set token to expired
      user.resetPasswordExpires = Date.now() - 1000;
      await user.save();

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'newpassword123'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid or expired reset token');
    });
  });
});
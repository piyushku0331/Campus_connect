const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@campusconnect.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      email: 'admin@campusconnect.com',
      password: 'admin123',
      name: 'Admin',
      age: 25,
      department: 'Administration',
      semester: 'N/A',
      campus: 'Main',
      year: 'N/A',
      role: 'admin',
      isVerified: true // Skip OTP verification for admin
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
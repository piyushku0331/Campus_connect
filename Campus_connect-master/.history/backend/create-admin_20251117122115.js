const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB using same logic as server.js
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Use the existing database connection
    const db = mongoose.connection.db;
    console.log('Using database:', db.databaseName);

    // Switch to the correct database if needed
    const correctDb = db.databaseName === 'Campus_Connect' ? db : mongoose.connection.useDb('Campus_Connect');
    console.log('Switched to database:', correctDb.databaseName);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@campusconnect.com';
    const adminPassword = 'admin123'; // Default password

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User',
      age: 25,
      department: 'Administration',
      semester: 'N/A',
      campus: 'Main Campus',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
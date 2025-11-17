const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  let client;
  try {
    // Connect directly to MongoDB
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect';
    client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Connected to MongoDB');

    // Use the existing database
    const db = client.db('Campus_Connect'); // Use the existing database name
    console.log('Using database:', db.databaseName);

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
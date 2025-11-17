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

    const adminEmail = 'admin@chitkara.edu.in'; // Use valid domain
    const adminPassword = 'admin123'; // Default password

    // Get users collection
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const adminUser = {
      email: adminEmail,
      password: hashedPassword,
      name: 'Campus Admin',
      age: 25,
      department: 'Administration',
      semester: 'N/A',
      campus: 'Main Campus',
      year: 'N/A',
      phone: '',
      bio: 'System Administrator',
      linkedin: '',
      github: '',
      website: '',
      skills: ['Administration', 'Management'],
      interests: ['Campus Management', 'Student Welfare'],
      profilePicture: null,
      avatar_url: null,
      isPublic: true,
      role: 'admin',
      points: 0,
      isVerified: true,
      otp: null,
      otpExpires: null,
      refreshToken: null,
      refreshTokenExpires: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(adminUser);
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

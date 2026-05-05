/**
 * Script tạo tài khoản admin
 * Usage: node scripts/createAdmin.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

// Load env variables
dotenv.config();

const ADMIN_DATA = {
  username: 'hakkusu',
  email: 'admin@hakkusu.store',
  password: 'entimc169',
  role: 'admin',
  isActive: true,
  isEmailVerified: true
};

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingUser = await User.findOne({
      $or: [{ username: ADMIN_DATA.username }, { email: ADMIN_DATA.email }]
    });

    if (existingUser) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      
      // Update to admin if not already
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('✅ Updated role to admin');
      }
    } else {
      // Create new admin user
      const admin = new User(ADMIN_DATA);
      await admin.save();
      
      console.log('✅ Admin user created successfully:');
      console.log(`   Username: ${admin.username}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
    }

    await mongoose.connection.close();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run script
createAdmin();

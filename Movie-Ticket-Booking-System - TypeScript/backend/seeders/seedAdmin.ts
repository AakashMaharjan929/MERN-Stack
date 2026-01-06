import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import User from '../models/User.js';

config({ path: '../.env' });

const seedAdmin = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGO_URI environment variable');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const adminEmail = 'admin@example.com';
  const adminPassword = 'AdminPass123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin already exists!');
    process.exit(0);
  }

  const adminUser = new User({
    name: 'Super Admin',
    email: adminEmail,
    phone: '1234567890',
    password: hashedPassword,
    role: 'admin',
  });

  await adminUser.save();
  console.log('Admin user created successfully!');
  process.exit(0);
};

seedAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});

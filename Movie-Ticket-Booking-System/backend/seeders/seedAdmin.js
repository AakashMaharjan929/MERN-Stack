import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { config } from 'dotenv'; // Import config from dotenv for ES modules

// Load .env from parent directory (backend/)
config({ path: '../.env' });

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = 'admin@example.com';
  const adminPassword = 'AdminPass123!'; // Change in prod; hash it
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin already exists!');
    process.exit(0);
  }

  const adminUser = new User({
    name: 'Super Admin',
    email: adminEmail,
    phone: '1234567890', // Dummy
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
// cronJobs.js - Daily post-show optimizations
import cron from 'node-cron';
import mongoose from 'mongoose';
import Show from './models/Show.js';  // Adjust path to your models

// Connect to MongoDB (use your existing config)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdb');  // Replace with your URI

// Daily at midnight: Process ended shows
cron.schedule('0 0 * * *', async () => {
  console.log('Running post-show optimizations...');
  try {
    const endedShows = await Show.find({
      endTime: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },  // Ended >24h ago to ensure complete data
      // Optional: Add 'optimized: false' field to schema if you want to track/run once
    });

    for (const show of endedShows) {
      try {
        await show.calculateOptimalFactors();
        console.log(`Optimized show ${show._id}`);
      } catch (err) {
        console.error(`Optimization failed for ${show._id}:`, err);
      }
    }
    console.log('Post-show optimizations complete.');
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

console.log('Cron job scheduler started. Press Ctrl+C to exit.');
process.on('SIGINT', () => {
  mongoose.connection.close();
  process.exit();
});
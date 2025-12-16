// src/cronJobs.js (or wherever you keep background jobs)

import cron from 'node-cron';
import mongoose from 'mongoose';
import Show from './models/Show.js';

// Ensure MongoDB connection is established before running jobs
// (Assuming you already connect in your main server file — this is just a safety check)
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return; // Already connected

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinemaDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for cron jobs');
  } catch (err) {
    console.error('MongoDB connection error in cron:', err);
  }
};

// ============================
// 1. Update Show Statuses (Every 10 minutes)
// ============================
cron.schedule('*/10 * * * *', async () => {
  console.log('[Cron] Updating show statuses...');
  try {
    await connectDB();
    await Show.updateAllShowStatuses();
    console.log('[Cron] Show statuses updated successfully');
  } catch (err) {
    console.error('[Cron] Failed to update show statuses:', err.message);
  }
});

// ============================
// 2. Daily Post-Show Optimization (Midnight)
// ============================
cron.schedule('0 0 * * *', async () => {
  console.log('[Cron] Starting daily post-show optimizations...');
  try {
    await connectDB();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const endedShows = await Show.find({
      endTime: { $lt: twentyFourHoursAgo }, // Shows that ended at least 24h ago
      status: 'Completed',                  // Only process fully completed shows
    }).select('_id'); // We only need IDs for processing

    console.log(`[Cron] Found ${endedShows.length} ended shows to optimize`);

    let successCount = 0;
    let failCount = 0;

    for (const showDoc of endedShows) {
      try {
        const show = await Show.findById(showDoc._id);
        if (!show) continue;

        await show.calculateOptimalFactors();
        successCount++;
        console.log(`[Cron] Optimized show ${show._id}`);
      } catch (err) {
        failCount++;
        console.error(`[Cron] Optimization failed for show ${showDoc._id}:`, err.message);
      }
    }

    console.log(`[Cron] Post-show optimization complete: ${successCount} succeeded, ${failCount} failed`);
  } catch (err) {
    console.error('[Cron] Daily optimization job error:', err.message);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Cron] Shutting down gracefully...');
  cron.gracefulShutdown?.(); // node-cron v2+ has this
  await mongoose.connection.close();
  console.log('[Cron] MongoDB disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[Cron] Received SIGTERM, shutting down...');
  cron.gracefulShutdown?.();
  await mongoose.connection.close();
  process.exit(0);
});

console.log('Cron jobs scheduler started:');
console.log('   • Show status updates: every 10 minutes');
console.log('   • Post-show optimizations: daily at midnight');
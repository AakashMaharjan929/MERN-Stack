import cron from 'node-cron';
import mongoose from 'mongoose';
import Show from '../models/Show.js';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinemaDB';
  await mongoose.connect(uri);
  console.log('MongoDB connected for cron jobs');
};

cron.schedule('*/10 * * * *', async () => {
  console.log('[Cron] Updating show statuses...');
  try {
    await connectDB();
    await Show.updateAllShowStatuses();
    console.log('[Cron] Show statuses updated successfully');
  } catch (err: any) {
    console.error('[Cron] Failed to update show statuses:', err.message || err);
  }
});

cron.schedule('0 0 * * *', async () => {
  console.log('[Cron] Starting daily post-show optimizations...');
  try {
    await connectDB();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const endedShows = await Show.find({
      endTime: { $lt: twentyFourHoursAgo },
      status: 'Completed',
    }).select('_id');

    console.log(`[Cron] Found ${endedShows.length} ended shows to optimize`);

    let successCount = 0;
    let failCount = 0;

    for (const showDoc of endedShows) {
      try {
        const show = await Show.findById((showDoc as any)._id);
        if (!show) continue;

        await show.calculateOptimalFactors();
        successCount++;
        console.log(`[Cron] Optimized show ${show._id}`);
      } catch (err: any) {
        failCount++;
        console.error(`[Cron] Optimization failed for show ${(showDoc as any)._id}:`, err.message || err);
      }
    }

    console.log(`[Cron] Post-show optimization complete: ${successCount} succeeded, ${failCount} failed`);
  } catch (err: any) {
    console.error('[Cron] Daily optimization job error:', err.message || err);
  }
});

process.on('SIGINT', async () => {
  console.log('\n[Cron] Shutting down gracefully...');
  (cron as any).gracefulShutdown?.();
  await mongoose.connection.close();
  console.log('[Cron] MongoDB disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[Cron] Received SIGTERM, shutting down...');
  (cron as any).gracefulShutdown?.();
  await mongoose.connection.close();
  process.exit(0);
});

console.log('Cron jobs scheduler started:');
console.log('   • Show status updates: every 10 minutes');
console.log('   • Post-show optimizations: daily at midnight');

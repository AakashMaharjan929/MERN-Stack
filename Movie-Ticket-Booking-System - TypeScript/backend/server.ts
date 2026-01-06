import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cron from 'node-cron';
import routes from "./routes/routes.js";
import path from 'path';
import cors from "cors";
import Show from './models/Show.js';

const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.options('*', cors());

app.use("/", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});

const runPostShowOptimizations = async () => {
  console.log('Running post-show optimizations...');
  try {
    const endedShows = await Show.find({
      endTime: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
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
};

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/movietickets")
  .then(() => {
    console.log("MongoDB connected");
    runPostShowOptimizations();

    cron.schedule('0 0 * * *', runPostShowOptimizations);

    cron.schedule('* * * * *', async () => {
      try {
        await Show.updateAllShowStatuses();
        console.log('[Cron] Show statuses refreshed');
      } catch (err: any) {
        console.error('[Cron] Failed to refresh statuses:', err.message);
      }
    });

    console.log('Cron job scheduler started.');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB disconnected. Server shutting down.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

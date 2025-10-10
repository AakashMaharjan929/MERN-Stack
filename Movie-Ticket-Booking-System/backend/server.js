import 'dotenv/config'; // Loads and configures .env early
import express from "express";
import mongoose from "mongoose";
import cron from 'node-cron'; // NEW: For scheduling post-show optimizations
import routes from "./routes/routes.js"; 
import path from 'path'; // ES modules syntax
import cors from "cors";
import Show from './models/Show.js'; // NEW: Import Show model (adjust path as needed)

const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Allow requests from your frontend
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // if you need cookies/auth
}));

// Use central routes
app.use("/", routes);  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
});

// Define the optimization task as a reusable async function
const runPostShowOptimizations = async () => {
  console.log('Running post-show optimizations...');
  try {
    const endedShows = await Show.find({
      endTime: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },  // Ended >24h ago to ensure complete data
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

// Connect to MongoDB (use env var for flexibility)
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/movietickets")
  .then(() => {
    console.log("MongoDB connected");
    
    // NEW: Run optimizations immediately on startup (handles missed runs)
    runPostShowOptimizations();

    // NEW: Schedule cron job for daily midnight (UTC; add { timezone: 'Asia/Kathmandu' } for Nepal)
    cron.schedule('0 0 * * *', runPostShowOptimizations); // Reuse the function

    console.log('Cron job scheduler started.');  // Confirm cron is active
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
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
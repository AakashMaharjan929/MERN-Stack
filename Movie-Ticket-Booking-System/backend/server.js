import express from "express";
import mongoose from "mongoose";
import routes from "./routes/routes.js"; // central route file

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/movietickets", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Use central routes
app.use("/", routes);  

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));

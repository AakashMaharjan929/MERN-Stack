// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust path if needed

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  console.log("ALL HEADERS:", req.headers); // temporary
  console.log("AUTH HEADER:", req.headers.authorization || req.headers.Authorization);

  // Extract token FIRST
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    console.log("VERIFYING TOKEN:", token.substring(0, 20) + "...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);

    req.user = await User.findById(decoded.userId || decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
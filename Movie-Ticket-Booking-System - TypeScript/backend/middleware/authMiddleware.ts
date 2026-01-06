import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import type { Request, Response, NextFunction } from 'express';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId?: string; id?: string };

    req.user = await User.findById(decoded.userId || decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).isAdmin && (req.user as any).isAdmin()) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

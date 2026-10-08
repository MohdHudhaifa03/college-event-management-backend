import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { AppError } from '../shared/error';
import { logger } from '../shared/logger';
import { AppDataSource } from '../infrastructure/database';
import { User } from '../adapters/models/User';

// Auth middleware - verifies JWT from cookie or Authorization header
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };

    // Attach user info to the request
    AppDataSource.getRepository(User)
      .findOne({ where: { id: decoded.id } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
      })
      .catch(() => {
        return res.status(401).json({ success: false, message: 'Authentication failed' });
      });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Error middleware - catches all errors
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
};

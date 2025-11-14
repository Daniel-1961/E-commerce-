import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, invalid token provided' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: Admins only' });
};

export const ownerOrAdmin = (req, res, next) => {
  const userId = req.user && req.user.id ? String(req.user.id) : null;
  const paramId = req.params && req.params.id ? String(req.params.id) : null;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (userId === paramId || (req.user && req.user.role === 'admin')) {
    return next();
  }

  return res.status(403).json({ message: 'Access denied' });
};

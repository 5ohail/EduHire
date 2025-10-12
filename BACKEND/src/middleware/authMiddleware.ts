import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = verifyJwt<Express.UserJwt>(token);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export function requireRoles(...roles: Array<'Student' | 'Faculty' | 'Admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
    }
    return next();
  };
}



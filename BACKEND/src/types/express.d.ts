import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface UserJwt extends JwtPayload {
      id: string;
      role: 'Student' | 'Faculty' | 'Admin';
      email?: string;
    }

    interface Request {
      user?: UserJwt;
    }
  }
}

export {};



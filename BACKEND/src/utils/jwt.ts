import jwt from 'jsonwebtoken';

export const signJwt = (payload: object) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyJwt = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.verify(token, secret);
};

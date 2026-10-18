import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && !JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required in production');
}

const DEV_FALLBACK_SECRET = 'dev-insecure-fallback-never-use-in-production';
const effectiveSecret = JWT_SECRET || DEV_FALLBACK_SECRET;
if (!JWT_SECRET) {
  console.warn('[jwt] JWT_SECRET not set — using insecure dev fallback');
}
const EXPIRES_IN = '7d';

export function signToken(payload: Record<string, any>) {
  return jwt.sign(payload, effectiveSecret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, effectiveSecret) as Record<string, any>;
  } catch (err) {
    return null;
  }
}

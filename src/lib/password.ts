import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;

  const derivedKey = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');
  return timingSafeEqual(keyBuffer, derivedKey);
}

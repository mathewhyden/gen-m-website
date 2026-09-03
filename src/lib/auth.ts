import { db } from './db';
import { User } from './types';

export function getSessionUser(tokenOrHeader?: string | null): User | null {
  if (!tokenOrHeader) return null;
  
  // Format can be "Bearer usr-admin-1" or "usr-admin-1" or json payload
  const token = tokenOrHeader.replace('Bearer ', '').trim();
  
  if (token.startsWith('usr-')) {
    const user = db.findUserById(token);
    if (user) return user;
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && decoded.id) {
      return db.findUserById(decoded.id) || null;
    }
  } catch {
    // If not base64 json, check direct email or id match
    const user = db.findUserById(token) || db.findUserByEmail(token);
    if (user) return user;
  }

  return null;
}

export function createTokenForUser(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

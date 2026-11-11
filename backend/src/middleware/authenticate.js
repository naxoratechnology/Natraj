import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AuthSession } from '../models/AuthSession.js';

export async function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Authentication is required' });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const [user, session] = await Promise.all([User.findById(payload.sub), AuthSession.findById(payload.sid)]);
    if (!user?.active || !session || session.revokedAt || session.expiresAt <= new Date()) return res.status(401).json({ message: 'Account or session is unavailable' });
    req.user = user;
    req.authSessionId = session.id;
    next();
  } catch { res.status(401).json({ message: 'Session is invalid or expired' }); }
}

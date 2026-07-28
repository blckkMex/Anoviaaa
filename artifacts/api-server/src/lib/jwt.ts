import jwt from 'jsonwebtoken';

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error('SESSION_SECRET env var is required');

export interface AdminPayload {
  id: number;
  email: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, secret!, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload {
  return jwt.verify(token, secret!) as AdminPayload;
}

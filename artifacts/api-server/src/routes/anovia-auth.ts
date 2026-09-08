import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, anoviaAdmins } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { signToken, verifyToken } from '../lib/jwt.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  const loginId = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!loginId || typeof password !== 'string' || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  const [admin] = await db.select().from(anoviaAdmins).where(eq(anoviaAdmins.email, loginId)).limit(1);
  if (!admin) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = signToken({ id: admin.id, email: admin.email });
  res.json({ token, email: admin.email });
});

router.get('/auth/me', requireAdmin, (req, res) => {
  res.json((req as any).admin);
});

export default router;

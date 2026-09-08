import { Router } from 'express';
import { db, anoviaGallery } from '@workspace/db';
import { and, asc, eq } from 'drizzle-orm';

const router = Router();

router.get('/gallery', async (_req, res) => {
  const items = await db
    .select()
    .from(anoviaGallery)
    .where(eq(anoviaGallery.active, true))
    .orderBy(asc(anoviaGallery.sortOrder), asc(anoviaGallery.id));
  res.json(items);
});

export default router;
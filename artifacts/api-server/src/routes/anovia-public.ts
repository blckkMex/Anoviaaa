import { Router } from 'express';
import { db, anoviaProducts, anoviaOffers, anoviaSettings } from '@workspace/db';
import { eq, asc } from 'drizzle-orm';

const router = Router();

router.get('/products', async (_req, res) => {
  const products = await db
    .select()
    .from(anoviaProducts)
    .orderBy(asc(anoviaProducts.sortOrder), asc(anoviaProducts.id));
  res.json(products);
});

router.get('/offers', async (_req, res) => {
  const offers = await db
    .select()
    .from(anoviaOffers)
    .where(eq(anoviaOffers.active, true))
    .orderBy(asc(anoviaOffers.sortOrder), asc(anoviaOffers.id));
  res.json(offers);
});

router.get('/settings', async (_req, res) => {
  const rows = await db.select().from(anoviaSettings);
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  res.json(map);
});

export default router;

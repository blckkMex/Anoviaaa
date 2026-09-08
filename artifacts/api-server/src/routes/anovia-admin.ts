import { Router } from 'express';
import { db, anoviaProducts, anoviaOffers, anoviaSettings, anoviaGallery } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '../middlewares/auth.js';

const router = Router();
router.use(requireAdmin);

// ── Products ──────────────────────────────────────────────────────────────

router.get('/products', async (_req, res) => {
  const all = await db.select().from(anoviaProducts).orderBy(anoviaProducts.sortOrder, anoviaProducts.id);
  res.json(all);
});

router.post('/products', async (req, res) => {
  const { name, category, description, price, imageUrl, inStock, sortOrder } = req.body;
  if (!name) { res.status(400).json({ error: 'name required' }); return; }
  const [row] = await db.insert(anoviaProducts).values({
    name,
    category: category ?? '',
    description: description ?? '',
    price: price ?? '',
    imageUrl: imageUrl ?? '',
    inStock: inStock ?? true,
    sortOrder: sortOrder ?? 0,
  }).returning();
  res.status(201).json(row);
});

router.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, category, description, price, imageUrl, inStock, sortOrder } = req.body;
  const [row] = await db.update(anoviaProducts)
    .set({ name, category, description, price, imageUrl, inStock, sortOrder, updatedAt: new Date() })
    .where(eq(anoviaProducts.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(anoviaProducts).where(eq(anoviaProducts.id, id));
  res.status(204).send();
});

// ── Offers ────────────────────────────────────────────────────────────────

router.get('/offers', async (_req, res) => {
  const all = await db.select().from(anoviaOffers).orderBy(anoviaOffers.sortOrder, anoviaOffers.id);
  res.json(all);
});

router.post('/offers', async (req, res) => {
  const { text, active, sortOrder } = req.body;
  if (!text) { res.status(400).json({ error: 'text required' }); return; }
  const [row] = await db.insert(anoviaOffers).values({
    text, active: active ?? true, sortOrder: sortOrder ?? 0,
  }).returning();
  res.status(201).json(row);
});

router.put('/offers/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { text, active, sortOrder } = req.body;
  const [row] = await db.update(anoviaOffers)
    .set({ text, active, sortOrder })
    .where(eq(anoviaOffers.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/offers/:id', async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(anoviaOffers).where(eq(anoviaOffers.id, id));
  res.status(204).send();
});

// ── Gallery ─────────────────────────────────────────────────────────────────

router.get('/gallery', async (_req, res) => {
  const all = await db.select().from(anoviaGallery).orderBy(anoviaGallery.sortOrder, anoviaGallery.id);
  res.json(all);
});

router.post('/gallery', async (req, res) => {
  const { title, imageUrl, altText, sortOrder, active } = req.body;
  if (!imageUrl) { res.status(400).json({ error: 'imageUrl required' }); return; }
  const [row] = await db.insert(anoviaGallery).values({
    title: title ?? '',
    imageUrl,
    altText: altText ?? title ?? 'Anovia gallery image',
    sortOrder: sortOrder ?? 0,
    active: active ?? true,
  }).returning();
  res.status(201).json(row);
});

router.put('/gallery/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, imageUrl, altText, sortOrder, active } = req.body;
  const [row] = await db.update(anoviaGallery)
    .set({ title, imageUrl, altText, sortOrder, active, updatedAt: new Date() })
    .where(eq(anoviaGallery.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(row);
});

router.delete('/gallery/:id', async (req, res) => {
  await db.delete(anoviaGallery).where(eq(anoviaGallery.id, Number(req.params.id)));
  res.status(204).send();
});

// ── Settings ──────────────────────────────────────────────────────────────

router.get('/settings', async (_req, res) => {
  const rows = await db.select().from(anoviaSettings);
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  res.json(map);
});

router.put('/settings', async (req, res) => {
  const updates: Record<string, string> = req.body;
  for (const [key, value] of Object.entries(updates)) {
    await db.insert(anoviaSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: anoviaSettings.key, set: { value } });
  }
  res.json({ ok: true });
});

export default router;

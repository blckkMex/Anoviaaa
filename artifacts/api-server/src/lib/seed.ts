import bcrypt from 'bcryptjs';
import { db, anoviaAdmins, anoviaProducts, anoviaOffers, anoviaSettings } from '@workspace/db';
import { eq, count, or, and } from 'drizzle-orm';
import { logger } from './logger.js';

const DEFAULT_PRODUCTS = [
  { name: 'Necklaces', category: 'Necklaces', description: 'Layered or solo anti-tarnish necklaces', price: '', sortOrder: 0 },
  { name: 'Earrings', category: 'Earrings', description: 'Studs & hoops for every occasion', price: '', sortOrder: 1 },
  { name: 'Bangles', category: 'Bangles', description: 'Stacks & cuffs that stay shiny', price: '', sortOrder: 2 },
  { name: 'Rings', category: 'Rings', description: 'Adjustable sizes, all styles', price: '', sortOrder: 3 },
  { name: 'Hair Accessories', category: 'Hair Accessories', description: 'Claws, bands & clips', price: '', sortOrder: 4 },
  { name: 'Oxidised Jewellery', category: 'Oxidised Jewellery', description: 'Statement pieces with an earthy shine', price: '', sortOrder: 5 },
];

const DEFAULT_OFFERS = [
  { text: 'Anti-tarnish', sortOrder: 0 },
  { text: 'Custom pieces', sortOrder: 1 },
  { text: 'Oxidised jewellery', sortOrder: 2 },
  { text: 'Pan India delivery', sortOrder: 3 },
  { text: 'Curated by Anisha', sortOrder: 4 },
  { text: 'Since Day One', sortOrder: 5 },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  announcement_text: 'Free delivery on orders of Rs 599+ — Order on WhatsApp',
  hero_subtitle: 'Jewellery & gifting that travels pan-India',
  hero_body: 'Anti-tarnish pieces made for every day, with oxidised jewellery and thoughtful gifting for every mood.',
  story_heading: 'From a first market stall to doorsteps across India',
  story_body: 'Anovia started small — a table of hand-picked pieces at a local stall — and grew one order, one repeat customer, and one custom request at a time. Every piece still gets packed the same way it did on day one.',
  story_founder: '— Anisha, founder',
  promise_heading: 'Small details, kept carefully',
  promise_body: 'Every piece is chosen the way we\'d choose something for a friend — pretty, practical, and built to last past one season.',
  scoop_heading: 'Shake the jar. See what you get.',
  scoop_body: 'Every order includes a little something extra — a mystery gift we sneak in just for you. Because everyone loves a surprise.',
  oxidised_heading: 'Bold oxidised pieces, made to stand out',
  oxidised_body: 'Discover expressive oxidised jewellery with a handcrafted feel — easy to style, easy to gift, and made for everyday drama.',
  cta_heading: 'Ready to order?',
  cta_body: 'Send us a message to check availability.',
  footer_tagline: 'Anti-tarnish jewellery, oxidised statement pieces, and thoughtful gifting — designed in Ahmedabad & Jamnagar, delivered pan-India. Curated by Anisha.',
  whatsapp_url: 'https://wa.me/918200230930',
  instagram_handle: '@anoviaaa.16',
  instagram_url: 'https://instagram.com/anoviaaa.16',
};

export async function seedDatabase() {
  // ── Admin user ──────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const [existing] = await db.select().from(anoviaAdmins).where(eq(anoviaAdmins.email, adminEmail.toLowerCase())).limit(1);
    if (!existing) {
      const hash = await bcrypt.hash(adminPassword, 12);
      await db.insert(anoviaAdmins).values({ email: adminEmail.toLowerCase(), passwordHash: hash });
      logger.info('Admin user seeded from env vars');
    }
  } else {
    const [row] = await db.select({ total: count() }).from(anoviaAdmins);
    if (row.total === 0) {
      logger.warn('No ADMIN_EMAIL/ADMIN_PASSWORD env vars set. Admin account not created.');
    }
  }

  // ── Default products ─────────────────────────────────────────────────────
  const [pRow] = await db.select({ total: count() }).from(anoviaProducts);
  if (pRow.total === 0) {
    await db.insert(anoviaProducts).values(DEFAULT_PRODUCTS);
    logger.info('Default products seeded');
  }

  // ── Default offers ───────────────────────────────────────────────────────
  const [oRow] = await db.select({ total: count() }).from(anoviaOffers);
  if (oRow.total === 0) {
    await db.insert(anoviaOffers).values(DEFAULT_OFFERS);
    logger.info('Default offers seeded');
  }

  // Migrate the original starter content to the current catalogue structure.
  await db.update(anoviaProducts)
    .set({
      name: 'Oxidised Jewellery',
      category: 'Oxidised Jewellery',
      description: 'Statement pieces with an earthy shine',
    })
    .where(or(
      eq(anoviaProducts.name, 'Gift Hampers'),
      eq(anoviaProducts.category, 'Gift Hampers'),
    ));
  await db.update(anoviaOffers)
    .set({ text: 'Oxidised jewellery' })
    .where(eq(anoviaOffers.text, 'Gift hampers'));

  // ── Default settings ─────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.insert(anoviaSettings)
      .values({ key, value })
      .onConflictDoNothing();
  }
  await db.update(anoviaSettings)
    .set({ value: DEFAULT_SETTINGS.whatsapp_url })
    .where(and(
      eq(anoviaSettings.key, 'whatsapp_url'),
      eq(anoviaSettings.value, 'https://wa.me/message'),
    ));
  await db.update(anoviaSettings)
    .set({ value: DEFAULT_SETTINGS.hero_body })
    .where(and(
      eq(anoviaSettings.key, 'hero_body'),
      eq(anoviaSettings.value, 'Anti-tarnish pieces made for every day, and curated hampers packed just like we\'d pack them for a friend.'),
    ));
  await db.insert(anoviaSettings)
    .values({ key: 'oxidised_heading', value: DEFAULT_SETTINGS.oxidised_heading })
    .onConflictDoNothing();
  await db.insert(anoviaSettings)
    .values({ key: 'oxidised_body', value: DEFAULT_SETTINGS.oxidised_body })
    .onConflictDoNothing();
  logger.info('Database seed complete');
}

import bcrypt from 'bcryptjs';
import { db, anoviaAdmins, anoviaProducts, anoviaOffers, anoviaSettings } from '@workspace/db';
import { eq, count } from 'drizzle-orm';
import { logger } from './logger.js';

const DEFAULT_PRODUCTS = [
  { name: 'Necklaces', category: 'Necklaces', description: 'Layered or solo anti-tarnish necklaces', price: '', sortOrder: 0 },
  { name: 'Earrings', category: 'Earrings', description: 'Studs & hoops for every occasion', price: '', sortOrder: 1 },
  { name: 'Bangles', category: 'Bangles', description: 'Stacks & cuffs that stay shiny', price: '', sortOrder: 2 },
  { name: 'Rings', category: 'Rings', description: 'Adjustable sizes, all styles', price: '', sortOrder: 3 },
  { name: 'Hair Accessories', category: 'Hair Accessories', description: 'Claws, bands & clips', price: '', sortOrder: 4 },
  { name: 'Gift Hampers', category: 'Gift Hampers', description: 'Curated boxes for every occasion', price: '', sortOrder: 5 },
];

const DEFAULT_OFFERS = [
  { text: 'Anti-tarnish', sortOrder: 0 },
  { text: 'Custom pieces', sortOrder: 1 },
  { text: 'Gift hampers', sortOrder: 2 },
  { text: 'Pan India delivery', sortOrder: 3 },
  { text: 'Curated by Anisha', sortOrder: 4 },
  { text: 'Since Day One', sortOrder: 5 },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  announcement_text: 'Free delivery on orders of Rs 599+ — Order on WhatsApp',
  hero_subtitle: 'Jewellery & gifting that travels pan-India',
  hero_body: 'Anti-tarnish pieces made for every day, and curated hampers packed just like we\'d pack them for a friend.',
  story_heading: 'From a first market stall to doorsteps across India',
  story_body: 'Anovia started small — a table of hand-picked pieces at a local stall — and grew one order, one repeat customer, and one custom request at a time. Every hamper and every piece still gets packed the same way it did on day one.',
  story_founder: '— Anisha, founder',
  promise_heading: 'Small details, kept carefully',
  promise_body: 'Every piece is chosen the way we\'d choose something for a friend — pretty, practical, and built to last past one season.',
  scoop_heading: 'Shake the jar. See what you get.',
  scoop_body: 'Every order includes a little something extra — a mystery gift we sneak in just for you. Because everyone loves a surprise.',
  hampers_heading: 'The gift that does all the work for you',
  hampers_body: 'From birthday surprises to bulk corporate gifting — we plan the box, you take the credit. Custom branding available for orders of 10+.',
  cta_heading: 'Ready to order?',
  cta_body: 'Send us a message to check availability.',
  footer_tagline: 'Anti-tarnish jewellery, customisation, and hampers made for gifting — designed in Ahmedabad & Jamnagar, delivered pan-India. Curated by Anisha.',
  whatsapp_url: 'https://wa.me/message',
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

  // ── Default settings ─────────────────────────────────────────────────────
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.insert(anoviaSettings)
      .values({ key, value })
      .onConflictDoNothing();
  }
  logger.info('Database seed complete');
}

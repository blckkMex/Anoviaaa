import {
  pgTable, serial, varchar, text, boolean, integer, timestamp,
} from 'drizzle-orm/pg-core';

export const anoviaProducts = pgTable('anovia_products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default(''),
  description: text('description').default(''),
  price: varchar('price', { length: 50 }).default(''),
  imageUrl: text('image_url').default(''),
  inStock: boolean('in_stock').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const anoviaGallery = pgTable('anovia_gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull().default(''),
  imageUrl: text('image_url').notNull().default(''),
  altText: varchar('alt_text', { length: 255 }).notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const anoviaOffers = pgTable('anovia_offers', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const anoviaSettings = pgTable('anovia_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
});

export const anoviaAdmins = pgTable('anovia_admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, pgEnum, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['attendee', 'organizer', 'admin']);
export const statusEnum = pgEnum('status', ['confirmed', 'cancelled', 'waitlist']);

// Table Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  role: roleEnum('role').default('attendee'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Table Events
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizerId: uuid('organizer_id').references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  isVirtual: boolean('is_virtual').default(false),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  capacity: integer('capacity').notNull(),
  category: varchar('category', { length: 50 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Table Ticket Types
export const ticketTypes = pgTable('ticket_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  quantityAvailable: integer('quantity_available').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Table Bookings
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  ticketTypeId: uuid('ticket_type_id').references(() => ticketTypes.id, { onDelete: 'restrict' }),
  status: statusEnum('status').default('confirmed'),
  bookingDate: timestamp('booking_date', { withTimezone: true }).defaultNow(),
});

// Table Feedbacks
export const feedbacks = pgTable('feedbacks', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  unq: unique().on(t.eventId, t.userId),
}));
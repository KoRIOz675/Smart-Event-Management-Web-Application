-- Full schema matching schema.ts — used by Docker on a fresh DB volume.
-- drizzle-kit push will find nothing to change and exit cleanly.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE "role"   AS ENUM ('attendee', 'organizer', 'admin');
CREATE TYPE "status" AS ENUM ('confirmed', 'cancelled', 'waitlist');

-- Users
CREATE TABLE "users" (
    "id"            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    "email"         varchar(255) NOT NULL UNIQUE,
    "password_hash" text        NOT NULL,
    "full_name"     varchar(100) NOT NULL,
    "role"          "role"      DEFAULT 'attendee',
    "created_at"    timestamptz DEFAULT now()
);

-- Events
CREATE TABLE "events" (
    "id"           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    "organizer_id" uuid         REFERENCES "users"("id") ON DELETE CASCADE,
    "title"        varchar(255) NOT NULL,
    "description"  text,
    "location"     varchar(255),
    "is_virtual"   boolean      DEFAULT false,
    "start_date"   timestamptz  NOT NULL,
    "end_date"     timestamptz  NOT NULL,
    "capacity"     integer      NOT NULL,
    "category"     varchar(50),
    "image_url"    text,
    "created_at"   timestamptz  DEFAULT now()
);

-- Ticket types
CREATE TABLE "ticket_types" (
    "id"                 uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    "event_id"           uuid          REFERENCES "events"("id") ON DELETE CASCADE,
    "name"               varchar(50)   NOT NULL,
    "price"              numeric(10,2) NOT NULL,
    "quantity_available" integer       NOT NULL,
    "created_at"         timestamptz   DEFAULT now()
);

-- Bookings
CREATE TABLE "bookings" (
    "id"             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"        uuid        REFERENCES "users"("id") ON DELETE CASCADE,
    "ticket_type_id" uuid        REFERENCES "ticket_types"("id") ON DELETE RESTRICT,
    "status"         "status"    DEFAULT 'confirmed',
    "booking_date"   timestamptz DEFAULT now()
);

-- Feedbacks (one per user per event)
CREATE TABLE "feedbacks" (
    "id"         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    "event_id"   uuid        REFERENCES "events"("id") ON DELETE CASCADE,
    "user_id"    uuid        REFERENCES "users"("id") ON DELETE CASCADE,
    "rating"     integer     NOT NULL,
    "comment"    text,
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "feedbacks_event_id_user_id_unique" UNIQUE ("event_id", "user_id")
);

-- Notifications
CREATE TABLE "notifications" (
    "id"         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"    uuid        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "event_id"   uuid        REFERENCES "events"("id") ON DELETE CASCADE,
    "message"    text        NOT NULL,
    "is_read"    boolean     DEFAULT false,
    "created_at" timestamptz DEFAULT now()
);

-- Push subscriptions
CREATE TABLE "push_subscriptions" (
    "id"         uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"    uuid  NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "endpoint"   text  NOT NULL,
    "p256dh"     text  NOT NULL,
    "auth"       text  NOT NULL,
    "created_at" timestamptz DEFAULT now()
);

-- Messages (P2P, optionally scoped to an event)
CREATE TABLE "messages" (
    "id"          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    "sender_id"   uuid        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "receiver_id" uuid        NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "event_id"    uuid        REFERENCES "events"("id") ON DELETE CASCADE,
    "content"     text        NOT NULL,
    "created_at"  timestamptz DEFAULT now()
);

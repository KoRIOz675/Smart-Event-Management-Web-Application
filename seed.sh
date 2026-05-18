#!/usr/bin/env bash
# =============================================================================
# seed.sh — Seed data generator for Smart Event Management
# Usage:
#   ./seed.sh                         # uses DATABASE_URL from environment
#   DATABASE_URL=postgresql://... ./seed.sh
# =============================================================================

set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[seed]${NC} $*"; }
warn()    { echo -e "${YELLOW}[warn]${NC} $*"; }
die()     { echo -e "${RED}[error]${NC} $*" >&2; exit 1; }

# ── Resolve DATABASE_URL ──────────────────────────────────────────────────────
# 1. CLI argument  2. env var  3. .env file
if [[ -n "${1:-}" ]]; then
  DATABASE_URL="$1"
elif [[ -z "${DATABASE_URL:-}" ]]; then
  ENV_FILE="$(dirname "$0")/.env"
  if [[ -f "$ENV_FILE" ]]; then
    # shellcheck disable=SC1090
    source "$ENV_FILE"
  fi
fi

[[ -z "${DATABASE_URL:-}" ]] && die "DATABASE_URL is not set. Export it or pass it as the first argument."

# ── Check psql ────────────────────────────────────────────────────────────────
command -v psql >/dev/null 2>&1 || die "psql is not installed or not in PATH."

psql_exec() { psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q "$@"; }

info "Connected to: ${DATABASE_URL%%@*}@…"

# =============================================================================
# SQL SEED
# =============================================================================
info "Inserting seed data…"

psql_exec <<'SQL'

-- ============================================================
-- 0.  Wipe existing seed data (safe re-run)
-- ============================================================
TRUNCATE feedbacks, bookings, ticket_types, events, users RESTART IDENTITY CASCADE;

-- ============================================================
-- 1.  USERS
--     Passwords are bcrypt hashes of "Password1!" (cost 10)
-- ============================================================
INSERT INTO users (id, email, password_hash, full_name, role) VALUES

  -- Admin
  ('00000000-0000-0000-0000-000000000001',
   'admin@smartevent.io',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Alice Admin', 'admin'),

  -- Organizers
  ('00000000-0000-0000-0000-000000000002',
   'bob.organizer@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Bob Organizer', 'organizer'),

  ('00000000-0000-0000-0000-000000000003',
   'claire.events@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Claire Dupont', 'organizer'),

  ('00000000-0000-0000-0000-000000000004',
   'david.tech@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'David Chen', 'organizer'),

  -- Attendees
  ('00000000-0000-0000-0000-000000000010',
   'emma@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Emma Martin', 'attendee'),

  ('00000000-0000-0000-0000-000000000011',
   'franck@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Franck Morel', 'attendee'),

  ('00000000-0000-0000-0000-000000000012',
   'grace@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Grace Kim', 'attendee'),

  ('00000000-0000-0000-0000-000000000013',
   'hugo@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Hugo Lefevre', 'attendee'),

  ('00000000-0000-0000-0000-000000000014',
   'isabelle@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Isabelle Bernard', 'attendee'),

  ('00000000-0000-0000-0000-000000000015',
   'jules@example.com',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lBji',
   'Jules Petit', 'attendee');

-- ============================================================
-- 2.  EVENTS
-- ============================================================
INSERT INTO events (id, organizer_id, title, description, location, is_virtual,
                    start_date, end_date, capacity, category, image_url) VALUES

  -- Past events (already happened — good for stats / feedbacks)
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'Paris Tech Summit 2025',
   'The biggest tech conference in Paris, gathering industry leaders, startups, and developers to discuss the future of AI, cloud computing, and open-source software.',
   'Palais des Congrès, Paris', false,
   NOW() - INTERVAL '60 days', NOW() - INTERVAL '59 days',
   500, 'Technology',
   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),

  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000003',
   'Festival Jazz & Blues Montmartre',
   'Three days of live jazz and blues music in the heart of Montmartre. Featuring local bands and international artists on three stages.',
   'Place du Tertre, Paris 18e', false,
   NOW() - INTERVAL '30 days', NOW() - INTERVAL '27 days',
   1200, 'Music',
   'https://images.unsplash.com/photo-1511735111819-9a3efd16269c?w=800'),

  ('10000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000004',
   'Introduction to Machine Learning – Online Workshop',
   'A hands-on 4-hour virtual workshop covering supervised learning, neural networks, and practical use cases with Python and scikit-learn.',
   NULL, true,
   NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days' + INTERVAL '4 hours',
   200, 'Education',
   'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800'),

  -- Upcoming events
  ('10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000002',
   'StartupNight Paris – Summer Edition',
   'Network with 200+ founders, investors, and tech enthusiasts. Pitch competition with €5,000 prize for the best startup idea.',
   'Station F, Paris 13e', false,
   NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '5 hours',
   250, 'Business',
   'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'),

  ('10000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000003',
   'Yoga & Wellness Weekend Retreat',
   'Disconnect from city life with two days of guided yoga sessions, meditation, and healthy cuisine in a peaceful setting near Fontainebleau.',
   'Forêt de Fontainebleau, 77300', false,
   NOW() + INTERVAL '21 days', NOW() + INTERVAL '23 days',
   40, 'Health & Wellness',
   'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'),

  ('10000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000004',
   'Cloud & DevOps Conference 2026',
   'Deep-dive talks on Kubernetes, GitOps, platform engineering, and SRE best practices. Workshop tracks in the afternoon.',
   'Cité des Sciences, Paris 19e', false,
   NOW() + INTERVAL '35 days', NOW() + INTERVAL '36 days',
   600, 'Technology',
   'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'),

  ('10000000-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000002',
   'Photography Walk – Golden Hour Paris',
   'Join our guided photography walk along the Seine at golden hour. All levels welcome. Bring your camera or smartphone!',
   'Pont des Arts, Paris 6e', false,
   NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
   25, 'Arts & Culture',
   'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'),

  -- Virtual / online upcoming
  ('10000000-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000003',
   'Live Coding: Build a REST API with Node.js',
   'Follow along as we build a production-ready REST API with Express, Drizzle ORM, and PostgreSQL. Q&A at the end.',
   NULL, true,
   NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '3 hours',
   500, 'Education',
   'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800');

-- ============================================================
-- 3.  TICKET TYPES
-- ============================================================
INSERT INTO ticket_types (id, event_id, name, price, quantity_available) VALUES

  -- Paris Tech Summit 2025
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Standard',   49.00, 350),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'VIP',        149.00,  50),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Student',     19.00, 100),

  -- Jazz & Blues Montmartre
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Day Pass',    25.00, 600),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '3-Day Pass',  60.00, 600),

  -- ML Workshop (online — free)
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Free Seat',    0.00, 150),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'Pro (recording + slides)', 29.00, 50),

  -- StartupNight
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', 'General',     15.00, 200),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', 'Pitcher',     25.00,  50),

  -- Yoga Retreat
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000005', 'Shared Room', 180.00, 30),
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000005', 'Private Room',280.00, 10),

  -- DevOps Conf
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000006', 'Attendee',    89.00, 500),
  ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000006', 'Workshop Bundle', 149.00, 100),

  -- Photo Walk
  ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000007', 'Participant', 12.00,  25),

  -- Live Coding
  ('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000008', 'Free',         0.00, 500);

-- ============================================================
-- 4.  BOOKINGS  (only for past / imminent events)
-- ============================================================
INSERT INTO bookings (id, user_id, ticket_type_id, status, booking_date) VALUES

  -- Tech Summit bookings
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000001', 'confirmed',  NOW() - INTERVAL '70 days'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000001', 'confirmed',  NOW() - INTERVAL '68 days'),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000002', 'confirmed',  NOW() - INTERVAL '67 days'),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000003', 'cancelled',  NOW() - INTERVAL '65 days'),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000001', 'confirmed',  NOW() - INTERVAL '64 days'),

  -- Jazz Festival bookings
  ('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000005', 'confirmed',  NOW() - INTERVAL '40 days'),
  ('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000004', 'confirmed',  NOW() - INTERVAL '38 days'),
  ('30000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000004', 'waitlist',   NOW() - INTERVAL '35 days'),

  -- ML Workshop bookings
  ('30000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000006', 'confirmed',  NOW() - INTERVAL '20 days'),
  ('30000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000007', 'confirmed',  NOW() - INTERVAL '19 days'),
  ('30000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000006', 'confirmed',  NOW() - INTERVAL '18 days'),

  -- StartupNight (upcoming)
  ('30000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000008', 'confirmed',  NOW() - INTERVAL '5 days'),
  ('30000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000015', '20000000-0000-0000-0000-000000000009', 'confirmed',  NOW() - INTERVAL '3 days');

-- ============================================================
-- 5.  FEEDBACKS  (only for past events, one per user per event)
-- ============================================================
INSERT INTO feedbacks (event_id, user_id, rating, comment) VALUES

  -- Tech Summit
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 5,
   'Absolutely fantastic event. The AI track was very insightful, and networking was great!'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 4,
   'Well organised. Would have liked more startup demo slots, but overall a very good day.'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 5,
   'The VIP lounge was worth every penny. Amazing speakers.'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000014', 3,
   'Good content but the venue was too crowded during lunch. Hope they fix that next year.'),

  -- Jazz Festival
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 5,
   'Best festival atmosphere in Paris this year. Incredible musicians!'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', 4,
   'Great music and vibes. Sound quality on stage 2 could be improved.'),

  -- ML Workshop
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011', 5,
   'Super hands-on and well-paced. The instructor was very clear. 10/10 would recommend.'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000013', 4,
   'Learned a lot about scikit-learn. The Q&A at the end was the highlight.'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000014', 5,
   'Excellent for beginners. Clear examples and the pace was perfect.');

SQL

info "✅ Seed complete!"
echo ""
echo "  Accounts seeded (password: Password1!):"
echo "    admin@smartevent.io          → admin"
echo "    bob.organizer@example.com    → organizer"
echo "    claire.events@example.com    → organizer"
echo "    david.tech@example.com       → organizer"
echo "    emma@example.com             → attendee  (+ bookings & feedbacks)"
echo "    franck@example.com           → attendee  (+ bookings & feedbacks)"
echo "    grace@example.com            → attendee  (+ bookings & feedbacks)"
echo "    hugo@example.com             → attendee"
echo "    isabelle@example.com         → attendee  (+ bookings & feedbacks)"
echo "    jules@example.com            → attendee  (+ bookings)"
echo ""
echo "  Events: 3 past · 5 upcoming (2 virtual)"
echo "  Ticket types: 15 across all events"
echo "  Bookings: 13 (confirmed/cancelled/waitlist)"
echo "  Feedbacks: 9 (for all 3 past events)"
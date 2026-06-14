ALTER TABLE "push_subscriptions" DROP CONSTRAINT "push_subscriptions_user_id_endpoint_unique";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "event_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN "event_id";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "is_read";
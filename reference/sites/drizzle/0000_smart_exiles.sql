CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`ai_summary` text,
	`ai_quote` text,
	`ai_generated_at` text,
	`last_checked_at` text,
	`change_status` text,
	`change_summary` text,
	`content_hash` text,
	`snapshot_id` text,
	`lock_until` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text NOT NULL,
	`checked_at` text NOT NULL,
	`status` text NOT NULL,
	`raw_html` text,
	`source_text` text,
	`content_hash` text,
	`ai_summary` text,
	`change_summary` text,
	`model` text,
	`prompt_version` text
);

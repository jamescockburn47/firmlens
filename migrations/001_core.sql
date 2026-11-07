CREATE TABLE IF NOT EXISTS entries (
 id TEXT PRIMARY KEY, data TEXT NOT NULL,
 ai_summary TEXT, ai_quote TEXT, ai_generated_at TEXT,
 last_checked_at TEXT, change_status TEXT, change_summary TEXT,
 content_hash TEXT, snapshot_id TEXT, lock_until DOUBLE PRECISION NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS snapshots (
 id TEXT PRIMARY KEY, entry_id TEXT NOT NULL, checked_at TEXT NOT NULL,
 status TEXT NOT NULL, raw_html TEXT, source_text TEXT, content_hash TEXT,
 ai_summary TEXT, change_summary TEXT, model TEXT, prompt_version TEXT
);
CREATE INDEX IF NOT EXISTS snapshots_entry_checked ON snapshots(entry_id,checked_at DESC);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY,value TEXT NOT NULL);

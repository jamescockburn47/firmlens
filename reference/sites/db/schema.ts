import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const entries = sqliteTable("entries", {
 id:text("id").primaryKey(), data:text("data").notNull(),
 aiSummary:text("ai_summary"), aiQuote:text("ai_quote"), aiGeneratedAt:text("ai_generated_at"),
 lastCheckedAt:text("last_checked_at"), changeStatus:text("change_status"), changeSummary:text("change_summary"),
 contentHash:text("content_hash"), snapshotId:text("snapshot_id"), lockUntil:integer("lock_until").notNull().default(0)
});
export const snapshots = sqliteTable("snapshots", {
 id:text("id").primaryKey(), entryId:text("entry_id").notNull(), checkedAt:text("checked_at").notNull(),
 status:text("status").notNull(), rawHtml:text("raw_html"), sourceText:text("source_text"), contentHash:text("content_hash"),
 aiSummary:text("ai_summary"), changeSummary:text("change_summary"), model:text("model"), promptVersion:text("prompt_version")
});
export const settings=sqliteTable("settings",{key:text("key").primaryKey(),value:text("value").notNull()});

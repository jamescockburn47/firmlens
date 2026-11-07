import uk from "../research/uk-sources.json";
import global from "../research/global-sources.json";
import {config} from "./config";
export const seedRecords=[...uk,...global];
export type Stored={id:string;data:string;ai_summary:string|null;ai_quote:string|null;ai_generated_at:string|null;last_checked_at:string|null;change_status:string|null;change_summary:string|null;content_hash:string|null;snapshot_id:string|null;lock_until:number};
export function publicEntry(row:Stored){return {...JSON.parse(row.data),aiSummary:row.ai_summary,aiQuote:row.ai_quote,aiGeneratedAt:row.ai_generated_at,lastCheckedAt:row.last_checked_at,changeStatus:row.change_status,changeSummary:row.change_summary};}
export async function seed(){
 const db=config().db;
 await db.batch(seedRecords.map(entry=>db.prepare('INSERT INTO entries(id,data) VALUES (?,?) ON CONFLICT(id) DO NOTHING').bind(entry.id,JSON.stringify(entry))));
 return {seeded:seedRecords.length};
}
export async function findRecord(id:string){return config().db.prepare('SELECT * FROM entries WHERE id=?').bind(id).first<Stored>();}
export async function allRecords(){const rows=await config().db.prepare("SELECT * FROM entries ORDER BY (data::jsonb->>'publishedDate') DESC NULLS LAST, id").all<Stored>();return rows.results.map(publicEntry);}

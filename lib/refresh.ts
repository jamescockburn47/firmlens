import {config} from './config';
import {findRecord,publicEntry} from './records';
import {fetchSource,hashText,PROMPT_VERSION,normalize} from './source.mjs';
export class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
export async function refreshRecord(id:string){
 const {db}=config();const model='Codex account';if(!await findRecord(id))throw new HttpError(404,'Announcement not found');
 const now=Date.now(),lease=now+300000;const locked=await db.prepare('UPDATE entries SET lock_until=? WHERE id=? AND lock_until<?').bind(lease,id,now).run();
 if(!locked.meta.changes)throw new HttpError(409,'This announcement is already being checked. Try again shortly.');
 const row=(await findRecord(id))!;
 const checkedAt=new Date().toISOString(),snapshotId=crypto.randomUUID();let fetched:{rawHtml:string;sourceText:string}|null=null;
 try{
  const entry=JSON.parse(row.data);fetched=await fetchSource(entry.url);
  if(!normalize(fetched.sourceText).includes(normalize(entry.evidenceQuote)))throw new Error('The original evidence passage was not found. This page needs human review.');
  const contentHash=await hashText(fetched.sourceText);
  const same=contentHash===row.content_hash;
  const status=!row.content_hash?'new':same?'unchanged':'changed';
  const ai={summary:same?row.ai_summary:null,quote:same?row.ai_quote:null};
  const changeSummary=status==='new'?'First source check saved. Ready for Codex to summarise.':same?'No change in the extracted source text.':'Source text changed. Awaiting a Codex explanation; this may include page-layout changes.';
  const saved=await db.batch([
   db.prepare('INSERT INTO snapshots(id,entry_id,checked_at,status,raw_html,source_text,content_hash,ai_summary,change_summary,model,prompt_version) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM entries WHERE id=? AND lock_until=?)').bind(snapshotId,id,checkedAt,status,fetched.rawHtml,fetched.sourceText,contentHash,ai.summary,changeSummary,model,PROMPT_VERSION,id,lease),
   db.prepare('UPDATE entries SET ai_summary=?,ai_quote=?,ai_generated_at=?,last_checked_at=?,change_status=?,change_summary=?,content_hash=?,snapshot_id=?,lock_until=0 WHERE id=? AND lock_until=?').bind(ai.summary,ai.quote,same?row.ai_generated_at:null,checkedAt,status,changeSummary,contentHash,snapshotId,id,lease)
  ]);
  if(!saved[1].meta.changes)throw new HttpError(409,'The update was superseded. Read the current record.');
  return {entry:publicEntry((await findRecord(id))!),status,message:changeSummary};
 }catch(error){
  const message=error instanceof Error?error.message:'Source check failed';
  await db.batch([
   db.prepare('INSERT INTO snapshots(id,entry_id,checked_at,status,raw_html,source_text,change_summary,model,prompt_version) SELECT ?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM entries WHERE id=? AND lock_until=?)').bind(snapshotId,id,checkedAt,'error',fetched?.rawHtml||null,fetched?.sourceText||null,message,model,PROMPT_VERSION,id,lease),
   db.prepare('UPDATE entries SET last_checked_at=?,change_status=?,change_summary=?,lock_until=0 WHERE id=? AND lock_until=?').bind(checkedAt,'error',message,id,lease)
  ]);
  console.error(JSON.stringify({event:'source_check_failed',id,reason:message}));
  throw new HttpError(502,message);
 }
}

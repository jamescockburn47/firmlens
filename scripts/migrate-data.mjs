import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {neon} from '@neondatabase/serverless';
process.loadEnvFile('.env.local');
const sql=neon(process.env.DATABASE_URL);
const backup=JSON.parse(await readFile('outputs/source-backup.json','utf8'));
if(backup.format!=='firmlens-backup-v1')throw Error('Unsupported backup');
if(backup.entries.some(r=>r.lock_until>Date.now()))throw Error('An update is in progress; export again after writers stop');
const columns={entries:['id','data','ai_summary','ai_quote','ai_generated_at','last_checked_at','change_status','change_summary','content_hash','snapshot_id','lock_until'],snapshots:['id','entry_id','checked_at','status','raw_html','source_text','content_hash','ai_summary','change_summary','model','prompt_version'],settings:['key','value']};
const digest=rows=>createHash('sha256').update(JSON.stringify(rows.map(r=>Object.fromEntries(Object.keys(r).sort().map(k=>[k,r[k]]))).sort((a,b)=>String(a.id??a.key).localeCompare(String(b.id??b.key))))).digest('hex');
for(const statement of (await readFile('migrations/001_core.sql','utf8')).split(';').filter(s=>s.trim()))await sql.query(statement);
if(process.argv.includes('--restore')){
 for(const table of Object.keys(columns)){const [{count}]=await sql.query(`SELECT COUNT(*) AS count FROM ${table}`);if(Number(count)!==0)throw Error(`Refusing to overwrite nonempty ${table}`);}
 const queries=[];
 for(const [table,cols]of Object.entries(columns))for(const row of backup[table]){
  if(Object.keys(row).sort().join()!==[...cols].sort().join())throw Error(`Unexpected columns in ${table}`);
  queries.push(sql.query(`INSERT INTO ${table} (${cols.join(',')}) VALUES (${cols.map((_,i)=>`$${i+1}`).join(',')})`,cols.map(k=>row[k])));
 }
 await sql.transaction(queries,{isolationLevel:'Serializable'});
}
const evidence={checkedAt:new Date().toISOString(),tables:{}};
for(const table of Object.keys(columns)){const actual=await sql.query(`SELECT * FROM ${table}`);const expectedHash=digest(backup[table]),actualHash=digest(actual);if(actualHash!==expectedHash)throw Error(`Restore mismatch in ${table}`);evidence.tables[table]={rows:actual.length,sha256:actualHash};}
await writeFile('outputs/restore-verification.json',JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence));

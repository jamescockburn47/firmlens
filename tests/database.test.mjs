import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {createDatabase} from '../lib/database.mjs';
import {readHistory} from '../lib/history.mjs';
test('Postgres adapter preserves values, rolls back a failed batch, and fences leases',async()=>{
 const pg=new PGlite();try{
 await pg.exec(await readFile('migrations/001_core.sql','utf8'));
 const db=createDatabase({one:q=>pg.query(q.sql,q.values),transaction:qs=>pg.transaction(async tx=>{const result=[];for(const q of qs)result.push(await tx.query(q.sql,q.values));return result;})});
 await db.prepare('INSERT INTO entries(id,data) VALUES (?,?)').bind('sample',JSON.stringify({title:"Question? O'Brien",publishedDate:null})).run();
 assert.equal(JSON.parse((await db.prepare('SELECT * FROM entries WHERE id=?').bind('sample').first()).data).title,"Question? O'Brien");
 const lease=await db.prepare('UPDATE entries SET lock_until=? WHERE id=? AND lock_until<?').bind(500,'sample',1).run();
 assert.equal(lease.meta.changes,1);
 assert.equal((await db.prepare('UPDATE entries SET lock_until=? WHERE id=? AND lock_until<?').bind(600,'sample',1).run()).meta.changes,0);
 await assert.rejects(()=>db.batch([db.prepare('UPDATE entries SET data=? WHERE id=?').bind('bad','sample'),db.prepare('INSERT INTO entries(id,data) VALUES (?,?)').bind('sample','duplicate')]));
 assert.notEqual((await db.prepare('SELECT data FROM entries WHERE id=?').bind('sample').first()).data,'bad');
 await db.prepare('INSERT INTO snapshots(id,entry_id,checked_at,status,change_summary,ai_summary,raw_html) VALUES (?,?,?,?,?,?,?)').bind('snapshot','sample','2026-11-07T12:00:00Z','changed','Pilot expanded','A saved summary','private raw source').run();
 const history=await readHistory(db,'sample');assert.equal(history[0].checkedAt,'2026-11-07T12:00:00Z');assert.equal(history[0].changeSummary,'Pilot expanded');assert.equal(history[0].aiSummary,'A saved summary');assert.equal('raw_html' in history[0],false);
 }finally{await pg.close();}
});

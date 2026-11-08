import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {demoResponse} from '../lib/demo.mjs';
import {changedSources} from '../components/firmlens/types.ts';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const tracker=read('../components/firmlens/tracker.tsx'),changes=read('../components/firmlens/changes.tsx'),css=read('../app/globals.css');
test('only entries whose latest check found a change count as changed',()=>{
 const entries=['new','unchanged','changed','error',null,'changed'].map((changeStatus,index)=>({id:String(index),changeStatus}));
 assert.deepEqual(changedSources(entries).map(entry=>entry.id),['2','5']);
 assert.deepEqual(changedSources([]),[]);
});
test('changed-source count links to a section listing every change with its explanation and source',async()=>{
 assert.match(tracker,/href="#changes"/);
 assert.match(tracker,/changedSources\(entries\)/);
 assert.match(tracker,/<ChangesSection entries=\{changedEntries\} \/>/);
 assert.match(changes,/id="changes"/);
 assert.match(changes,/\{entries\.map\(entry =>/);
 assert.match(changes,/entry\.changeSummary \|\|/);
 assert.match(changes,/href=\{entry\.url\}/);
 assert.match(changes,/AI helps explain changes and can make mistakes/);
 assert.match(css,/\.changes-list \{ overflow-wrap:anywhere/);
 const {entries}=await demoResponse(new Request('http://localhost/api/entries')).json();
 const changed=changedSources(entries);
 assert.equal(changed.length,1);
 assert.match(changed[0].changeSummary,/Synthetic/);
});
test('opening the shared #changes address scrolls to the section once it has loaded',()=>{
 assert.match(changes,/window\.location\.hash === "#changes"/);
 assert.match(changes,/scrollIntoView\(\)/);
});

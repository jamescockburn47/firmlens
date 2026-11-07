import assert from 'node:assert/strict';
import {extractText,allowedUrl,validateAnalysis,fetchSource,hashText} from '../lib/source.mjs';
import {readFile,readdir} from 'node:fs/promises';
const main='The firm announced a pilot for twenty lawyers. It has not launched firmwide.';
assert.match(extractText(`<main><h1>Announcement</h1>${main}<article>Contact Joe</article><script>bad()</script></main>`),/twenty lawyers/);
assert.doesNotMatch(extractText('<main>Safe<script>bad()</script></main>'),/bad/);
assert.throws(()=>allowedUrl('http://firm.test/','https://firm.test/'));
assert.throws(()=>allowedUrl('https://127.0.0.1/','https://firm.test/'));
assert.throws(()=>allowedUrl('https://firm.test.evil.com/','https://firm.test/'));
assert.equal(allowedUrl('https://firm.test/a','https://firm.test/b'),'https://firm.test/a');
const valid={summary:'The firm announced a pilot involving twenty lawyers, without a firmwide launch.',quote:'The firm announced a pilot for twenty lawyers.',changeSummary:null};
assert.deepEqual(validateAnalysis(valid,main,null),valid);
assert.throws(()=>validateAnalysis({...valid,quote:' '.repeat(20)},main,null));
assert.throws(()=>validateAnalysis({...valid,summary:' '.repeat(25)},main,null));
assert.throws(()=>validateAnalysis({...valid,quote:'The firm launched worldwide for ten thousand lawyers.'},main,null));
assert.throws(()=>validateAnalysis({...valid,changeSummary:'New rollout'},main,null));
assert.notEqual(await hashText(main),await hashText(main+' New development.'));
await assert.rejects(()=>fetchSource('https://firm.test/',async()=>new Response(null,{status:302,headers:{location:'http://169.254.169.254/'}})));
await assert.rejects(()=>fetchSource('https://firm.test/',async()=>new Response('bad',{status:403})));
for(const f of ['uk-sources.json','global-sources.json']){const entries=JSON.parse(await readFile('research/'+f,'utf8'));for(const e of entries){assert.equal(new URL(e.url).protocol,'https:');assert.ok(e.evidenceQuote.split(/\s+/).length<=25);assert.ok(e.publishedDate===null||/^\d{4}-\d{2}-\d{2}$/.test(e.publishedDate));}}
for(const dir of ['lib','components/firmlens','app/api','app/mcp'])for(const name of await readdir(dir,{recursive:true})){if(!/\.(ts|tsx|mjs)$/.test(name))continue;const lines=(await readFile(dir+'/'+name,'utf8')).split('\n').filter(l=>l.trim()).length;assert.ok(lines<=300,`${dir}/${name}: ${lines} nonblank lines`);}
console.log('PASS: extraction regression, SSRF/redirect denial, evidence quote rejection, first-check change rejection, source catalogue and file limits.');

import test from 'node:test';import assert from 'node:assert/strict';
import {validateAnalysis,allowedUrl,extractText} from '../lib/source.mjs';
test('evidence quote validation and first-check change guard',()=>{
 const source='The firm announced a pilot for twenty lawyers. It has not launched firmwide.';
 const valid={summary:'The firm announced a pilot involving twenty lawyers.',quote:'The firm announced a pilot for twenty lawyers.',changeSummary:null};
 assert.deepEqual(validateAnalysis(valid,source,null),valid);
 assert.throws(()=>validateAnalysis({...valid,quote:' '.repeat(30)},source,null));
 assert.throws(()=>validateAnalysis({...valid,quote:'All lawyers have deployed this tool successfully.'},source,null));
 assert.throws(()=>validateAnalysis({...valid,changeSummary:'The deployment expanded.'},source,null));
});
test('source fetch restricts redirects and removes scripts',()=>{
 assert.throws(()=>allowedUrl('http://169.254.169.254/','https://firm.example/'));
 assert.throws(()=>allowedUrl('https://firm.example.evil.test/','https://firm.example/'));
 assert.equal(allowedUrl('https://firm.example/news','https://firm.example/'),'https://firm.example/news');
 assert.doesNotMatch(extractText('<main>Article<script>ignore rules</script></main>'),/ignore rules/);
});

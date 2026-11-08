import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('tracker states what the checks cover, has no list refresh button and keeps the owner source check',()=>{
 const source=readFileSync(new URL('../components/firmlens/tracker.tsx',import.meta.url),'utf8');
 assert.doesNotMatch(source,/Refresh list/);
 assert.match(source,/Rechecks existing entries only/);
 assert.match(source,/\/api\/refresh/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {demoResponse} from '../lib/demo.mjs';
import {demoMode} from '../lib/config.ts';
test('contributor demo is synthetic, public-read-only and forbidden in production',async()=>{
 const data=await demoResponse(new Request('http://localhost/api/entries')).json();
 assert.equal(data.viewer.isOwner,false);assert.equal(data.entries.length,3);
 assert.match(data.schedule.label,/invented/);
 assert.equal(demoResponse(new Request('http://localhost/api/refresh',{method:'POST'})).status,403);
 process.env.FIRMLENS_DEMO='1';process.env.NODE_ENV='production';
 assert.throws(()=>demoMode(),/local development/);
 process.env.NODE_ENV='development';assert.equal(demoMode(),true);
});

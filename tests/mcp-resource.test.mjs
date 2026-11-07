import test from 'node:test';
import assert from 'node:assert/strict';
import {mcpResource,siteOrigin} from '../lib/config.ts';
import {sameOrigin} from '../lib/owner-policy.mjs';

test('domain cutover preserves the approved MCP audience without widening browser writes',()=>{
 const previous={APP_ORIGIN:process.env.APP_ORIGIN,MCP_RESOURCE_URL:process.env.MCP_RESOURCE_URL};
 try{
  process.env.APP_ORIGIN='https://firmlens.app';
  process.env.MCP_RESOURCE_URL='https://firmlens-beta.vercel.app/mcp';
  assert.equal(mcpResource(),'https://firmlens-beta.vercel.app/mcp');
  assert.equal(siteOrigin(),'https://firmlens.app');
  const request=origin=>new Request('https://firmlens.app/api/refresh',{method:'POST',headers:{origin}});
  assert.equal(sameOrigin(request('https://firmlens.app'),siteOrigin()),true);
  assert.equal(sameOrigin(request('https://firmlens-beta.vercel.app'),siteOrigin()),false);
  assert.equal(sameOrigin(request('https://untrusted.vercel.app'),siteOrigin()),false);
  delete process.env.MCP_RESOURCE_URL;
  assert.equal(mcpResource(),'https://firmlens.app/mcp');
  for(const invalid of ['http://insecure.test/mcp','https://user:password@example.test/mcp']){
   process.env.MCP_RESOURCE_URL=invalid;
   assert.throws(mcpResource,/Invalid server URL/);
  }
 }finally{
  for(const [name,value]of Object.entries(previous)){
   if(value===undefined)delete process.env[name];else process.env[name]=value;
  }
 }
});

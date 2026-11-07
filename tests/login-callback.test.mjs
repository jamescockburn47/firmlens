import test from 'node:test';
import assert from 'node:assert/strict';
import {processAuthMiddleware} from '@neon/auth/server';
import {loginPolicy} from '../lib/login-policy.mjs';
test('social MCP callback exchanges verifier before continuing signed query',async t=>{
 let calls=0;
 t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({session:null,user:null});});
 const url=new URL('https://app.example.test/sign-in?sig=signed-example&state=example&neon_auth_session_verifier=test-only');
 const request=new Request(url,{headers:{cookie:'__Secure-neon-auth.session_challenge=test-only'}});
 const config={request,pathname:url.pathname,skipRoutes:['/','/sign-in'],baseUrl:'https://auth.example.test/auth',cookieSecret:'test-secret-longer-than-thirty-two-characters',logLevel:'silent'};
 // Counterexample: the SDK short-circuits its configured login route.
 const inadequate=await processAuthMiddleware({...config,loginUrl:'/sign-in'});
 assert.equal(inadequate.action,'allow');assert.equal(calls,0);
 const policy=loginPolicy(url);
 const fixed=await processAuthMiddleware({...config,loginUrl:policy.loginUrl,skipRoutes:policy.publicRoutes});
 assert.equal(calls,1);assert.equal(fixed.action,'redirect_oauth');
 assert.equal(fixed.redirectUrl.searchParams.has('neon_auth_session_verifier'),false);
 assert.equal(fixed.redirectUrl.searchParams.get('sig'),'signed-example');
 assert.equal(loginPolicy(new URL('https://app.example.test/consent')).loginUrl,'/sign-in');
});

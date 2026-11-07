import test from 'node:test';import assert from 'node:assert/strict';
import {permittedOwner,sameOrigin} from '../lib/owner-policy.mjs';
const owner={email:'owner@example.test',id:'owner-id'};
test('owner requires verified identity and exact configured subject',()=>{
 assert.equal(permittedOwner(null,owner),false);
 assert.equal(permittedOwner({id:'owner-id',email:owner.email,emailVerified:false},owner),false);
 assert.equal(permittedOwner({id:'attacker',email:owner.email,emailVerified:true},owner),false);
 assert.equal(permittedOwner({id:'owner-id',email:'attacker@example.test',emailVerified:true},owner),false);
 assert.equal(permittedOwner({id:'owner-id',email:owner.email,emailVerified:true},owner),true);
});
test('browser mutations require the configured origin',()=>{
 const origin='https://firmlens.app';
 assert.equal(sameOrigin(new Request(origin,{headers:{Origin:'https://evil.test','oai-authenticated-user-email':owner.email}}),origin),false);
 assert.equal(sameOrigin(new Request(origin),origin),false);
 assert.equal(sameOrigin(new Request(origin,{headers:{Origin:origin}}),origin),true);
});

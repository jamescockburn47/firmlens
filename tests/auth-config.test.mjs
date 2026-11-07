import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCookieConfig} from '@neon/auth/server';
import {authConfig} from '../lib/config.ts';

test('real SDK accepts our configuration and rejects invalid cache settings',()=>{
 process.env.NEON_AUTH_BASE_URL='https://auth.example.test/auth';
 process.env.NEON_AUTH_COOKIE_SECRET='test-only-secret-with-more-than-thirty-two-characters';
 const config=authConfig();
 assert.doesNotThrow(()=>validateCookieConfig(config.cookies));
 assert.throws(()=>validateCookieConfig({...config.cookies,sessionDataTtl:0}),/positive number/);
});

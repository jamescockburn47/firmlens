import type {NextRequest} from 'next/server';
import {auth} from './lib/auth';
import {NextResponse} from 'next/server';
import {demoMode} from './lib/config';
import {loginPolicy} from './lib/login-policy.mjs';

// Exchange the managed Google callback. Public APIs and bearer MCP keep their own gates.
export default function proxy(request:NextRequest){
 if(demoMode())return NextResponse.next();
 // SDK 0.8.2 skips loginUrl before exchanging a social-login verifier.
 // On this public callback only, use the public home as its fallback so exchange runs.
 return auth().middleware(loginPolicy(request.nextUrl))(request);
}
export const config={matcher:['/','/sign-in','/consent']};

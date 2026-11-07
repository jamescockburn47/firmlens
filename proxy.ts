import type {NextRequest} from 'next/server';
import {auth} from './lib/auth';
import {NextResponse} from 'next/server';
import {demoMode} from './lib/config';

// Exchange the managed Google callback. Public APIs and bearer MCP keep their own gates.
export default function proxy(request:NextRequest){
 if(demoMode())return NextResponse.next();
 return auth().middleware({loginUrl:'/sign-in',publicRoutes:['/','/sign-in']})(request);
}
export const config={matcher:['/','/sign-in','/consent']};

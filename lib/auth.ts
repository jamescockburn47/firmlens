import {createNeonAuth} from '@neon/auth/next/server';
import {authConfig} from './config';
let instance:ReturnType<typeof createNeonAuth>|undefined;
export function auth(){return instance??=createNeonAuth(authConfig());}

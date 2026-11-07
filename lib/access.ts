import {headers} from 'next/headers';
import {auth} from './auth';
import {ownerConfig,siteOrigin} from './config';
import {permittedOwner,sameOrigin} from './owner-policy.mjs';
import {HttpError} from './refresh';
import {boundedJson} from './body';
export async function isOwner(){
 const h=await headers();if(!h.get('cookie'))return false;
 const {data:session,error}=await auth().getSession({query:{disableCookieCache:'true'}});
 if(error)throw new HttpError(503,'Owner sign-in is unavailable. Please try again.');
 return permittedOwner(session?.user,ownerConfig());
}
export async function ownerOnly(){if(!await isOwner())throw new HttpError(403,'Sign in as the owner to update sources.');}
export async function readInput(request:Request){if(!sameOrigin(request,siteOrigin()))throw new HttpError(403,'Submit through this site.');return boundedJson(request);}

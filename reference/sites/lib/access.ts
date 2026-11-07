import {getChatGPTUser} from '../app/chatgpt-auth';
import {config} from './config';
import {HttpError} from './refresh';
import {boundedJson} from './body';
export async function isOwner(){const user=await getChatGPTUser();return !!user&&!!config().owner&&user.email.toLowerCase()===config().owner;}
export async function ownerOnly(){if(!await isOwner())throw new HttpError(403,'Sign in as the owner to update sources.');}
export async function readInput(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)throw new HttpError(403,'Submit through this site.');
 return boundedJson(request);
}

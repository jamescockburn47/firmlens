import {createMcpAuth} from '@neon/oauth/mcp';
import {authConfig,siteOrigin,config,ownerConfig} from './config';
import {permittedOwner} from './owner-policy.mjs';
import {HttpError} from './refresh';
let instance:ReturnType<typeof createMcpAuth>|undefined;
export function mcpAuth(){return instance??=createMcpAuth({baseUrl:authConfig().baseUrl,resource:siteOrigin()+'/mcp',scopesSupported:['openid','profile','email']});}
export async function authorizeSubject(subject:string){
 const user=await config().db.prepare('SELECT id,email,"emailVerified" FROM neon_auth."user" WHERE id=?').bind(subject).first();
 if(!permittedOwner(user,ownerConfig()))throw new HttpError(403,'Only the FirmLens owner may change records.');
}

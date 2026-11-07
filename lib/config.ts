import {neon} from '@neondatabase/serverless';
import {createDatabase} from './database.mjs';
let database:ReturnType<typeof createDatabase>|undefined;
export function demoMode(){if(process.env.FIRMLENS_DEMO!=='1')return false;if(process.env.NODE_ENV!=='development')throw new Error('Demo data is only available in local development');return true;}
function required(name:string){const value=process.env[name];if(!value)throw new Error(`Missing server configuration: ${name}`);return value;}
function https(value:string){const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)throw new Error('Invalid server URL');return value.replace(/\/$/,'');}
export function authConfig(){return {baseUrl:https(required('NEON_AUTH_BASE_URL')),cookies:{secret:required('NEON_AUTH_COOKIE_SECRET').trim(),sessionDataTtl:60},logLevel:'error' as const};}
export function ownerConfig(){return {email:required('OWNER_EMAIL').toLowerCase(),id:process.env.OWNER_USER_ID||null};}
export function siteOrigin(){return https(required('APP_ORIGIN'));}
export function config(){
 if(!database){const sql=neon(required('DATABASE_URL'));
  database=createDatabase({one:(q:{sql:string;values:unknown[]})=>sql.query(q.sql,q.values,{fullResults:true}),transaction:(qs:{sql:string;values:unknown[]}[])=>sql.transaction(qs.map(q=>sql.query(q.sql,q.values)),{fullResults:true,isolationLevel:'Serializable'})});}
 return {db:database};
}

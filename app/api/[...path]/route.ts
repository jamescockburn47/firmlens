import {config,demoMode} from '../../../lib/config';
import {demoResponse} from '../../../lib/demo.mjs';
import {allRecords,seed} from '../../../lib/records';
import {isOwner,ownerOnly,readInput} from '../../../lib/access';
import {refreshRecord,HttpError} from '../../../lib/refresh';
import {readHistory} from '../../../lib/history.mjs';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function handle(request:Request){
 try{
  const path=new URL(request.url).pathname;
  if(demoMode())return demoResponse(request);
  if(request.method==='GET'&&path==='/api/entries'){
   const entries=await allRecords(),setting=await config().db.prepare("SELECT value FROM settings WHERE key='schedule'").first<{value:string}>();
   return reply({entries,stats:{total:entries.length,firms:new Set(entries.map(e=>e.firm)).size,checkedAt:entries.map(e=>e.lastCheckedAt).filter(Boolean).sort().at(-1)||null},viewer:{isOwner:await isOwner()},schedule:{label:setting?.value||'Weekly checks requested · scheduling not yet active'}});
  }
  const history=path.match(/^\/api\/entries\/([a-z0-9-]+)\/history$/);
  if(request.method==='GET'&&history)return reply({history:await readHistory(config().db,history[1])});
  if(request.method==='POST'){
   await ownerOnly();const body=await readInput(request);
   if(path==='/api/seed')return reply(await seed());
   if(path==='/api/refresh'){
    if(typeof body.id!=='string'||!/^[a-z0-9-]{1,100}$/.test(body.id))throw new HttpError(400,'Choose an existing announcement.');
    return reply(await refreshRecord(body.id));
   }
  }
  return reply({error:'Not found'},404);
 }catch(error){if(error instanceof HttpError)return reply({error:error.message},error.status);console.error(JSON.stringify({event:'api_failed',path:new URL(request.url).pathname}));return reply({error:'The request could not be completed. Please retry.'},500);}
}
export const GET=handle;export const POST=handle;

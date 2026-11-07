import {mcpAuth,authorizeSubject} from '../../lib/mcp-auth';
import {handleRpc} from '../../lib/rpc';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const identity=await mcpAuth().requireBearerAuth({onError:()=>console.error(JSON.stringify({event:'mcp_auth_failed'}))})(request);
 if(identity instanceof Response)return identity;
 return handleRpc(request,()=>authorizeSubject(identity.sub));
}
export async function GET(request:Request){const identity=await mcpAuth().requireBearerAuth()(request);return identity instanceof Response?identity:new Response(null,{status:405,headers:{Allow:'POST'}});}

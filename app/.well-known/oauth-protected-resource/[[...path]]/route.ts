import {mcpAuth} from '../../../../lib/mcp-auth';
export const dynamic='force-dynamic';
export async function GET(request:Request){return mcpAuth().handleMetadataRequest(request)||new Response('Not found',{status:404});}
export const OPTIONS=GET;

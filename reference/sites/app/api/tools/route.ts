import {POST as handleToolRequest} from '../../mcp/route';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Submit through this site.'},{status:403});
 return handleToolRequest(request);
}

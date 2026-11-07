import {handleRpc} from '../../../lib/rpc';
import {ownerOnly} from '../../../lib/access';
import {siteOrigin} from '../../../lib/config';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(request.headers.get('origin')!==siteOrigin())return Response.json({error:'Submit through this site.'},{status:403});
 return handleRpc(request,ownerOnly);
}

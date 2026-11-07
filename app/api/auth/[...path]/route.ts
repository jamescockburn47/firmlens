import {auth} from '../../../../lib/auth';
import {siteOrigin} from '../../../../lib/config';
export const dynamic='force-dynamic';
type Context={params:Promise<{path:string[]}>};
export async function GET(request:Request,context:Context){return auth().handler().GET(request,context);}
export async function POST(request:Request,context:Context){
 if(request.headers.get('origin')!==siteOrigin())return Response.json({error:'Submit through this site.'},{status:403});
 return auth().handler().POST(request,context);
}

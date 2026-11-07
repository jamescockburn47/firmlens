import {HttpError} from './refresh';
export async function boundedJson(request:Request,limit=4096){
 if(!request.headers.get('content-type')?.includes('application/json'))throw new HttpError(415,'Use JSON.');
 if(Number(request.headers.get('content-length')||0)>limit)throw new HttpError(413,'Request too large');
 const reader=request.body?.getReader();if(!reader)throw new HttpError(400,'JSON body required');
 const decoder=new TextDecoder();let text='',bytes=0;
 for(;;){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>limit){await reader.cancel();throw new HttpError(413,'Request too large');}text+=decoder.decode(part.value,{stream:true});}
 text+=decoder.decode();try{return JSON.parse(text);}catch{throw new HttpError(400,'Invalid JSON');}
}

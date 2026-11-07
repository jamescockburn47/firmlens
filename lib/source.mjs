export const PROMPT_VERSION="firmlens-1";
export function normalize(text){return text.normalize('NFKC').replace(/\s+/g,' ').trim();}
export function extractText(html){
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]||html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1]||html;
 const text=main.replace(/<(script|style|noscript|svg|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ')
 .replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>{const cp=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return cp>0&&cp<=0x10ffff?String.fromCodePoint(cp):' ';})
 .replace(/&(amp|nbsp|quot|apos|lt|gt|rsquo|lsquo|rdquo|ldquo|ndash|mdash);/g,(_,n)=>({amp:'&',nbsp:' ',quot:'"',apos:"'",lt:'<',gt:'>',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“',ndash:'–',mdash:'—'}[n]));
 return normalize(text);
}
export function allowedUrl(url,knownUrl){
 const target=new URL(url),known=new URL(knownUrl);
 if(target.protocol!=='https:'||target.username||target.password||target.port||target.hostname!==known.hostname)throw new Error('Source redirected outside its approved domain');
 return target.href;
}
export async function fetchSource(url,fetcher=fetch){
 let current=allowedUrl(url,url);
 for(let step=0;step<4;step++){
  const r=await fetcher(current,{redirect:'manual',signal:AbortSignal.timeout(18000),headers:{'User-Agent':'FirmLens/1.0 (public announcement tracker)','Accept':'text/html'}});
  if([301,302,303,307,308].includes(r.status)){const next=r.headers.get('location');if(!next)throw new Error('Source redirect is missing a destination');current=allowedUrl(new URL(next,current).href,url);continue;}
  if(!r.ok)throw new Error(`Source returned HTTP ${r.status}`);
  if(!(r.headers.get('content-type')||'').includes('text/html'))throw new Error('Source is not an HTML page');
  if(Number(r.headers.get('content-length')||0)>2_000_000)throw new Error('Source exceeds size limit');
  const reader=r.body?.getReader();if(!reader)throw new Error('Source body is empty');
  const decoder=new TextDecoder();let rawHtml='',size=0;
  for(;;){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>2_000_000){await reader.cancel();throw new Error('Source exceeds size limit');}rawHtml+=decoder.decode(part.value,{stream:true});}
  rawHtml+=decoder.decode();const sourceText=extractText(rawHtml);
  if(sourceText.length<180)throw new Error('Source contains too little readable text');
  if(/just a moment|verify you are human|access denied/i.test(sourceText.slice(0,180)))throw new Error('Source blocked automated access');
  return {rawHtml,sourceText};
 }
 throw new Error('Source redirected too many times');
}
export async function hashText(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function validateAnalysis(value,current,previous){
 if(!value||typeof value.summary!=='string'||value.summary.trim().length<20||value.summary.length>900)throw new Error('AI summary failed validation');
 if(typeof value.quote!=='string'||value.quote.trim().split(/\s+/).length<5||value.quote.trim().split(/\s+/).length>25||normalize(value.quote).length<15||!normalize(current).includes(normalize(value.quote)))throw new Error('AI evidence quote is not in the source');
 if(value.changeSummary!==null&&(typeof value.changeSummary!=='string'||value.changeSummary.trim().length<10||value.changeSummary.length>700))throw new Error('AI change explanation failed validation');
 if(!previous&&value.changeSummary!==null)throw new Error('First check cannot claim a change');
 return value;
}

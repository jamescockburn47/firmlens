import fs from 'node:fs';
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const boxes=[
 [55,135,270,110,'1  Public website',['Search · filter · inspect sources','Stored summaries and history'],'Public reads verified'],
 [405,135,340,110,'2  Server on Vercel',['Checks permissions and inputs','Reads and writes the database'],'Build and owner check passed'],
 [825,135,300,110,'3  Neon database',['Entries · source text · snapshots','Saved summaries and history'],'Full restore verified'],
 [55,345,270,110,'4  Owner sign-in',['Google → Neon Auth','Only configured owner can write'],'Live owner session verified'],
 [405,345,340,110,'5  AI through Codex',['Reads evidence · drafts analysis','Returns summary and exact quote'],'Native tool test pending'],
 [825,345,300,110,'6  Original source pages',['Known official firm URLs','Fetching is ordinary code'],'Some pages block retrieval'],
 [55,555,270,110,'7  GitHub',['Source · branches · pull requests','Residents propose; James reviews'],'Public repository; CI passes'],
 [405,555,340,110,'8  Hosting and updates',['Vercel runs the replacement app','Old weekly job paused for migration'],'Domain cutover pending'],
 [825,555,300,110,'Resident local preview',['Three invented example records','No credentials or model calls'],'Local UI verified'],
];
let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1180 790" role="img" aria-labelledby="title desc"><title id="title">FirmLens architecture and migration status</title><desc id="desc">Public website connects to the Vercel server and Neon database. The owner signs in through Neon. Codex supplies AI analysis through tools. Source fetches preserve evidence. GitHub holds proposed changes. Domain cutover and native tool execution remain pending.</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#52697b" stroke-width="1.5"/></marker></defs><rect width="1180" height="790" fill="#f7f8f3"/><g font-family="Arial,sans-serif" fill="#18364c"><text x="55" y="54" font-size="30" font-weight="700">FirmLens · what runs where</text><text x="55" y="88" font-size="17">Migration snapshot · 7 November 2026 · public domain still on the original host</text></g>';
svg+='<g stroke="#52697b" stroke-width="2" fill="none" marker-end="url(#arrow)"><path d="M325 187H400"/><path d="M745 187H820"/><path d="M190 345V283H510V250"/><path d="M575 345V250"/><path d="M975 345V250"/><path d="M325 610H400"/><path d="M575 555V460"/></g>';
for(const [x,y,w,h,title,lines,status] of boxes){const pending=status.includes('pending')||status.includes('block');svg+=`<g font-family="Arial,sans-serif"><rect x="${x}" y="${y}" width="${w}" height="${h+30}" rx="12" fill="white" stroke="#b7c7ca"/><text x="${x+18}" y="${y+29}" font-size="19" font-weight="700" fill="#18364c">${esc(title)}</text>${lines.map((s,i)=>`<text x="${x+18}" y="${y+57+i*23}" font-size="16" fill="#40596b">${esc(s)}</text>`).join('')}<text x="${x+18}" y="${y+117}" font-size="14" font-weight="700" fill="${pending?'#8d4b13':'#24604b'}">${esc(status)}</text></g>`;}
svg+='<text x="55" y="742" font-family="Arial,sans-serif" font-size="17" fill="#18364c">A quote match checks the words. It does not prove that every claim in the summary follows from them.</text></svg>';
const target='homework/images/architecture.svg';
if(process.argv.includes('--check')){
 if(fs.readFileSync(target,'utf8')!==svg)throw new Error('Architecture SVG is stale; run node scripts/render-diagram.mjs');
 console.log('Architecture SVG matches its source.');
}else fs.writeFileSync(target,svg);

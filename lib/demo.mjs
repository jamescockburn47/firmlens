// Invented records for local contributor previews. Never connected to the live database.
const common={region:'United Kingdom',category:'adoption',verifiedAt:'2026-11-07',aiGeneratedAt:null,lastCheckedAt:'2026-11-07T12:00:00Z',changeStatus:'new',changeSummary:null};
const entries=[
 {...common,id:'demo-pilot',firm:'Example & Co (fictional)',title:'Synthetic example: a six-person AI pilot',url:'/demo-sources.html#pilot',publishedDate:'2026-11-01',summary:'Example & Co says six lawyers will test DraftKit for eight weeks. It has not announced a firm-wide rollout.',evidenceQuote:'Six lawyers will test DraftKit for eight weeks.',aiSummary:'Example & Co says six lawyers will test DraftKit for eight weeks. It has not announced a firm-wide rollout.',aiQuote:'Six lawyers will test DraftKit for eight weeks.',aiGeneratedAt:'2026-11-07T12:01:00Z'},
 {...common,id:'demo-error',firm:'Sample Legal (fictional)',title:'Synthetic example: source unavailable',url:'/demo-sources.html#unavailable',publishedDate:null,summary:'An unverified demonstration entry. Its source could not be retrieved.',evidenceQuote:'',aiSummary:null,changeStatus:'error',changeSummary:'The demonstration source returned 403. This does not establish that the announcement was withdrawn.'},
 {...common,id:'demo-training',firm:'Example & Co (fictional)',title:'Synthetic example: staff training',url:'/demo-sources.html#training',publishedDate:'2026-10-30',category:'training',summary:'Example & Co reports a training workshop. The announcement does not report measured productivity improvements.',evidenceQuote:'We held a workshop on reviewing AI-generated drafts.',aiSummary:null},
];
export function demoResponse(request){
 const path=new URL(request.url).pathname;
 if(request.method!=='GET')return Response.json({error:'Local demo is read-only. Test mutations with isolated fixtures.'},{status:403});
 if(path==='/api/entries')return Response.json({entries,stats:{total:3,firms:2,checkedAt:common.lastCheckedAt},viewer:{isOwner:false},schedule:{label:'LOCAL DEMO · invented records · no live database or AI calls'}});
 const match=path.match(/^\/api\/entries\/(demo-[a-z]+)\/history$/);
 if(match&&entries.some(e=>e.id===match[1]))return Response.json({history:[{id:'demo-history',checkedAt:common.lastCheckedAt,status:match[1]==='demo-error'?'error':'new',changeSummary:'Synthetic first-check example.',aiSummary:null}]});
 return Response.json({error:'Not found in the local demo'},{status:404});
}

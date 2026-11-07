export async function readHistory(db,id){
 const rows=await db.prepare('SELECT id,checked_at,status,change_summary,ai_summary,model FROM snapshots WHERE entry_id=? ORDER BY checked_at DESC LIMIT 20').bind(id).all();
 return rows.results.map(row=>({id:row.id,checkedAt:row.checked_at,status:row.status,changeSummary:row.change_summary,aiSummary:row.ai_summary,model:row.model}));
}

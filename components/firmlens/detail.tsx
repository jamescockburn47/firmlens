"use client";
import { useEffect, useState } from "react";
import { api, dateLabel, type Entry, type History } from "./types";

export function EntryDetail({ entry, isOwner, busy, refresh }: { entry: Entry; isOwner: boolean; busy: boolean; refresh: (id: string) => void }) {
  const [history, setHistory] = useState<History[]>([]);
  const [historyError, setHistoryError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    setLoading(true); setHistoryError("");
    api<{ history: History[] }>(`/api/entries/${encodeURIComponent(entry.id)}/history`)
      .then(result => { if (live) setHistory(result.history); })
      .catch(error => { if (live) setHistoryError(error.message); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [entry.id, entry.lastCheckedAt]);
  return <div className="entry-detail" id={`detail-${entry.id}`}>
    <div className="detail-main">
      <p className="eyebrow">The announcement</p><h3>{entry.title}</h3>
      <div className="summary-label">{entry.aiSummary ? "AI summary · check against the source" : "Research summary · AI summary not yet generated"}</div>
      <p className="summary-text">{entry.aiSummary || entry.summary}</p>
      <p className="small muted">AI summaries are prepared through Codex and saved here.{entry.aiGeneratedAt ? ` Generated ${dateLabel(entry.aiGeneratedAt)}.` : ""}</p>
      <div className="source-evidence"><p className="eyebrow">A passage from the source</p><blockquote>{entry.aiSummary && entry.aiQuote ? entry.aiQuote : entry.evidenceQuote || "No source passage has been recorded."}</blockquote><a className="source-link" href={entry.url} target="_blank" rel="noopener noreferrer">Read the original announcement ↗<span className="sr-only"> (opens in a new tab)</span></a></div>
      <p className="small muted">This records what the firm says. It does not independently verify the effectiveness of its AI tools.</p>
    </div>
    <aside className="detail-side" aria-label="Source checks and history">
      <p className="eyebrow">Source record</p><dl className="source-dates"><div><dt>Published</dt><dd>{dateLabel(entry.publishedDate)}</dd></div><div><dt>Research checked</dt><dd>{dateLabel(entry.verifiedAt)}</dd></div><div><dt>Last automated check</dt><dd>{dateLabel(entry.lastCheckedAt)}</dd></div></dl>
      {isOwner && <button className="button primary refresh-button" disabled={busy} onClick={() => refresh(entry.id)}>{busy ? "Checking source…" : "Check source"}</button>}
      <div className="history"><h4>What changed?</h4>{entry.changeSummary && <p>{entry.changeSummary}</p>}
        {loading ? <p className="small muted">Loading saved checks…</p> : historyError ? <p role="alert" className="small error-text">{historyError}</p> : history.length === 0 ? <p className="small muted">No automated checks saved yet. A first check establishes the baseline for future comparisons.</p> : <ol>{history.slice(0, 5).map(item => <li key={item.id}><span className="history-date">{dateLabel(item.checkedAt)} · {item.status === "unchanged" ? "No change detected" : item.status === "new" ? "First check" : item.status === "changed" ? "Source changed" : "Check unsuccessful"}</span><p>{item.changeSummary || (item.status === "new" ? "Saved the first source snapshot." : item.status === "unchanged" ? "The checked source text matches the previous snapshot." : "See the saved source check.")}</p></li>)}</ol>}
      </div>
    </aside>
  </div>;
}

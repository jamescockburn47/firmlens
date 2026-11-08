"use client";
import { useEffect } from "react";
import { dateLabel, type Entry } from "./types";

export function ChangesSection({ entries }: { entries: Entry[] }) {
  const hasChanges = entries.length > 0;
  // The section appears only after records load, too late for the browser's own jump to #changes.
  useEffect(() => {
    if (hasChanges && window.location.hash === "#changes") document.getElementById("changes")?.scrollIntoView();
  }, [hasChanges]);
  if (!hasChanges) return null;
  return <section className="changes-section" id="changes" aria-labelledby="changes-title">
    <p className="eyebrow">WHAT CHANGED</p>
    <h2 id="changes-title">Sources changed at the last check</h2>
    <p className="changes-note">A change can be as small as a menu or footer. AI helps explain changes and can make mistakes, so check the original source.</p>
    <ul className="changes-list">{entries.map(entry => <li key={entry.id}>
      <span className="firm-name">{entry.firm}</span>
      <h3>{entry.title}</h3>
      <span className="check-date">Checked {dateLabel(entry.lastCheckedAt)}</span>
      <p>{entry.changeSummary || "No explanation of this change has been saved yet."}</p>
      <a className="source-link" href={entry.url} target="_blank" rel="noopener noreferrer">Read the original announcement ↗<span className="sr-only"> (opens in a new tab)</span></a>
    </li>)}</ul>
  </section>;
}

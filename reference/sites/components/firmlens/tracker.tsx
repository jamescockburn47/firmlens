"use client";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { EntryDetail } from "./detail";
import { api, categories, dateLabel, type Data, type Entry } from "./types";

export function FirmLens() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [firm, setFirm] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const load = useCallback(async () => {
    setError("");
    try { setData(await api<Data>("/api/entries")); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Could not load the tracker."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const updated = () => { void load(); };
    window.addEventListener("firmlens-updated", updated);
    return () => window.removeEventListener("firmlens-updated", updated);
  }, [load]);
  const entries = data?.entries || [];
  const firms = [...new Set(entries.map(entry => entry.firm))].sort();
  const regions = [...new Set(entries.map(entry => entry.region).filter(Boolean))].sort();
  const availableCategories = [...new Set(entries.map(entry => entry.category))].sort();
  const visible = useMemo(() => entries.filter(entry => {
    const query = search.trim().toLowerCase();
    return (!firm || entry.firm === firm) && (!category || entry.category === category) && (!region || entry.region === region)
      && (!query || [entry.firm, entry.title, entry.summary, entry.aiSummary, entry.region, categories[entry.category]].join(" ").toLowerCase().includes(query));
  }), [entries, search, firm, category, region]);
  const changed = entries.filter(entry => entry.changeStatus === "changed").length;
  const activeFilters = !!(search || firm || category || region);
  async function refresh(id: string) {
    setBusy(id); setNotice(""); setError("");
    try { const result = await api<{ entry: Entry; message?: string; status: string }>("/api/refresh", { id }); setNotice(result.message || "Source checked and the result saved."); await load(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "The source check failed."); }
    finally { setBusy(null); }
  }
  async function seed() {
    setBusy("seed"); setError("");
    try { await api("/api/seed", {}); await load(); setNotice("Research sources added to the tracker."); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "The source import failed."); }
    finally { setBusy(null); }
  }
  function clearFilters() { setSearch(""); setFirm(""); setCategory(""); setRegion(""); }
  return <>
    <a className="skip-link" href="#tracker">Skip to the tracker</a>
    <header className="site-header"><div className="header-inner"><a className="wordmark" href="/" aria-label="FirmLens home"><span className="brand-mark" aria-hidden="true">F<span>◉</span></span>FirmLens<span className="brand-subtitle">LAW FIRMS & AI</span></a><div className="header-right"><span className="source-tag"><span aria-hidden="true" />Source-linked research</span>{data?.viewer?.isOwner ? <span className="owner-tag">Owner view</span> : <a className="owner-link" href="/signin-with-chatgpt?return_to=%2F" target="_top">Owner sign in</a>}</div></div></header>
    <main className="page-shell">
      <section className="intro" aria-labelledby="page-title"><div className="intro-copy"><p className="eyebrow">THE LEGAL AI LANDSCAPE, IN ONE PLACE</p><h1 id="page-title">What are law firms<br className="desktop-break" /> doing with AI?</h1><p className="intro-description">Follow the announcements. See the evidence.<br />Keep track of what changes.</p></div><aside className="intro-note"><span className="note-number" aria-hidden="true">01 — THE TRACKER</span><p>From new tools to firm-wide adoption, a clear view of how legal practice is changing.</p><div className="update-cadence"><span aria-hidden="true">↻</span><span>{data?.schedule?.label || "Loading update schedule…"}</span></div></aside></section>
      <section className="metrics" aria-label="Tracker coverage"><div><span className="metric-value">{data ? firms.length : "—"}</span><span className="metric-label">Law firms covered</span></div><div><span className="metric-value">{data ? entries.length : "—"}</span><span className="metric-label">Sourced announcements</span></div><div><span className="metric-value">{data ? changed : "—"}</span><span className="metric-label">Sources changed at last check</span></div><p className="metrics-note">Public firm announcements.<br />Evidence linked to every entry.</p></section>
      <section className="tracker-section" id="tracker" aria-labelledby="tracker-title">
        <div className="section-heading"><div><p className="eyebrow">EXPLORE THE EVIDENCE</p><h2 id="tracker-title">The announcement tracker</h2></div><button className="button quiet" onClick={() => { setLoading(true); void load(); }} disabled={loading || !!busy}>↻ Refresh list</button></div>
        <div className="filters"><label className="search-field"><span>Search announcements</span><div className="search-input"><span aria-hidden="true">⌕</span><input type="search" placeholder="Firm, tool or keyword…" value={search} onChange={event => setSearch(event.target.value)} /></div></label><label><span>Law firm</span><select value={firm} onChange={event => setFirm(event.target.value)}><option value="">All firms</option>{firms.map(value => <option key={value}>{value}</option>)}</select></label><label><span>Activity</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="">All activities</option>{availableCategories.map(value => <option value={value} key={value}>{categories[value] || value}</option>)}</select></label><label><span>Region</span><select value={region} onChange={event => setRegion(event.target.value)}><option value="">All regions</option>{regions.map(value => <option key={value}>{value}</option>)}</select></label></div>
        <div className="results-bar"><p aria-live="polite">{loading ? "Loading announcements…" : `${visible.length} of ${entries.length} announcements`}{activeFilters && <button className="text-button" onClick={clearFilters}>Clear filters</button>}</p><span>Open an entry to inspect its source and history</span></div>
        {error && <div className="message error" role="alert">{error}<button className="text-button" onClick={() => void load()}>Try loading again</button></div>}{notice && <div className="message success" role="status">{notice}</div>}
        {loading && !data ? <div className="empty-state"><span className="loading-mark" aria-hidden="true" /><h3>Loading the evidence</h3><p>Retrieving the saved announcements and source checks.</p></div> : !visible.length ? <div className="empty-state"><h3>{activeFilters ? "No announcements match those filters" : "The tracker is ready for its first sources"}</h3><p>{activeFilters ? "Try a different keyword or clear the filters to see all announcements." : "Verified research will appear here once it has been saved."}</p>{activeFilters ? <button className="button primary" onClick={clearFilters}>Clear filters</button> : data?.viewer?.isOwner ? <button className="button primary" onClick={() => void seed()} disabled={!!busy}>{busy ? "Adding sources…" : "Add researched sources"}</button> : null}</div> : <div className="table-wrap"><table className="entry-table"><caption className="sr-only">Law-firm AI announcements. Open an announcement for its summary, source and change history.</caption><thead><tr><th scope="col">Law firm / announcement</th><th scope="col">Activity</th><th scope="col">Published</th><th scope="col">Source check</th><th scope="col"><span className="sr-only">Details</span></th></tr></thead><tbody>{visible.map(entry => <Fragment key={entry.id}><tr className={expanded === entry.id ? "selected-row" : ""}><td className="announcement-cell"><span className="firm-name">{entry.firm}</span><button className="entry-title" aria-expanded={expanded === entry.id} aria-controls={`detail-${entry.id}`} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>{entry.title}</button><span className="entry-region">{entry.region}</span></td><td><span className={`category-pill category-${entry.category}`}>{categories[entry.category] || entry.category}</span></td><td className="date-cell">{dateLabel(entry.publishedDate)}</td><td><span className={`check-status status-${entry.changeStatus || "pending"}`}><span aria-hidden="true" />{entry.changeStatus === "changed" ? "Changed" : entry.changeStatus === "unchanged" ? "No change" : entry.changeStatus === "new" ? "First check saved" : entry.changeStatus === "error" ? "Check failed" : "Research added"}</span><span className="check-date">{entry.lastCheckedAt ? dateLabel(entry.lastCheckedAt) : "Awaiting automated check"}</span></td><td><button className="expand-button" aria-label={`${expanded === entry.id ? "Close" : "Open"} details for ${entry.firm}: ${entry.title}`} aria-expanded={expanded === entry.id} onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>{expanded === entry.id ? "−" : "+"}</button></td></tr>{expanded === entry.id && <tr className="detail-row"><td colSpan={5}><EntryDetail entry={entry} isOwner={!!data?.viewer?.isOwner} busy={!!busy} refresh={id => void refresh(id)} /></td></tr>}</Fragment>)}</tbody></table></div>}
      </section>
      <section className="how-it-works" aria-labelledby="how-title"><div><p className="eyebrow">HOW TO READ THIS TRACKER</p><h2 id="how-title">An announcement is a starting point.<br />The source is what matters.</h2></div><ol><li><span>01</span><div><h3>Find an announcement</h3><p>Filter by firm, activity or region. This is a curated collection, not a complete market census.</p></div></li><li><span>02</span><div><h3>Read it in context</h3><p>Open the entry for its summary and a quoted passage. Follow the link to the original firm announcement.</p></div></li><li><span>03</span><div><h3>Follow what changes</h3><p>Saved source checks establish a baseline, then compare later versions. AI helps explain changes; it can make mistakes.</p></div></li></ol></section>
    </main>
    <footer className="site-footer"><a className="footer-brand" href="/">FirmLens</a><p>Built with the LegalQuants residency · A working research prototype</p><a href="#page-title">Back to top ↑</a></footer>
  </>;
}

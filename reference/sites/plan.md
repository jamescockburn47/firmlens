# FirmLens build plan

Start: 7 November 2026, 14:31 UTC. Target first deployment: 15:06 UTC.

1. Establish Desktop project, intent and rules; launch two source researchers in parallel.
2. Build database and public read API; seed verified official announcements without putting seed data into migrations.
3. Implement owner-only source refresh: allowlisted URLs, bounded fetch, stored snapshot, Codex account analysis with a validated quote, deterministic content comparison, saved history and clear errors.
4. Build plain navy searchable table and accessible firm/category/region filters. Show original source, published date, last check and AI status.
5. Run canonical tests, fresh independent review, publish, initialise real data and prove the live first-use journey. Confirm denied anonymous writes and persistent outputs.
6. Enable weekly unattended refresh only after proving service authorization; show its real state. Preserve a working public deployment if scheduling needs separate follow-up.

Acceptance: real official sources; no invented claims; public browsing without login; owner-only source and analysis writes; actual saved AI output; refresh preserves data; duplicate refresh does not duplicate entries; unavailable sources fail visibly; unknown dates remain null; changes retain prior evidence.

Hardening after the demo: broader source coverage and extraction tests; content-level change evaluation against navigation noise; reviewer approval for consequential interpretations; monitoring, backups and restore rehearsal; queue and rate-limit tuning; accessibility testing with keyboard and mobile readers.

Progress and evidence will be appended as the build runs.

14:43 UTC: user chose ChatGPT/Codex account processing instead of paid API calls. Removed deployed API key. Native tools fetch/read source evidence and save validated account-generated summaries. Weekly cloud task will use these authenticated tools; no model calls run inside the website.

## Delivery evidence — 15:02 UTC

Delivered within 31 minutes of the 14:31 start (including credential clarification and the change from API to account processing). Public site: https://firmlens-law-firm-ai.jcockburn.chatgpt.site . Code release 3, source commit 30b903e5eb78b0f6c9328f69e6968fc15908da93.

14 official announcements across 13 firms persisted in hosted D1. Twelve actual hosted source snapshots have account-generated AI summaries, exact source quotes and timestamps. Linklaters requires human review because the fetched page lacked the expected passage; HSF Kramer returns 403. Neither failure was represented as a successful AI check. Rechecking A&O produced an unchanged result, retained its summary and added history without another announcement.

Canonical npm run verify passed. Independent review resolved bounded-body, cross-origin, refresh-race and whitespace-evidence validation findings. Live public GET returns 200. Anonymous and forged-identity writes are denied. Browser source-check, summary save, reload persistence, search and desktop/narrow layouts verified. Evidence: outputs/live-verification.json and outputs/firmlens-live-proof.png.

Weekly schedule enabled: Mondays 09:00 Europe/London, starting 9 November 2026, automation Automation_5823f32dd15481918e03535922c09a8b. The first unattended run has not occurred. Native integration is installed; this chat used the open browser's authenticated WebMCP bridge because newly installed native tools were not exposed here. Future unattended native authentication remains to be observed in that first run; failures must be reported, not hidden.

Next product work: discovery of new announcements (the current weekly task checks existing catalogue URLs), better extraction of article-only text to avoid rotating page furniture, broader account-generated summary evals, category chart if useful, and source-review controls. These are next steps, not claims about the first release.

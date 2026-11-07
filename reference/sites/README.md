# FirmLens

Public source-backed tracker of law firms' AI announcements, built with residents' questionnaire preferences. Project intent and delivery plan live in intent.md and plan.md. Operating rules live in AGENTS.md.

## Run and verify

Node22.20.0, npm lockfile. Install using `node scripts/install-ci.mjs`. Run `npm run verify`: TypeScript, deterministic evidence/source tests, production build, then isolated built-Worker/D1 integration tests. Start a local preview with `npm run dev -- --port <available-port>` after checking that port. Local fixtures do not establish live source availability or model factual accuracy.

## Architecture

React/Vinext page → public read API and owner-only commands → Cloudflare D1 entries and immutable source snapshots. Official URLs come from the curated research catalogue. Source fetches are bounded, same-host HTTPS redirects only; failures remain visible. ChatGPT/Codex reads the source through authenticated tools and saves a summary plus an exact supporting quote against the current snapshot. No API key is required in the app. Weekly update instructions are in UPDATE-WORKFLOW.md.

## Deployment and recovery

Sites project identity is in .openai/hosting.json. Use the Sites source workflow helper with npm run verify before packaging, then save/deploy that exact pushed source commit and archive. Set OWNER_EMAIL as a hosted secret. Visitors are anonymous; only the verified owner can write. Do not copy mock identity headers into a deployed preview.

Redeploy a previous saved version to recover application code. Database schema is additive; snapshots are retained. No destructive migration or full restore has been tested. Before expanding to production reliance, establish backups, restore testing and broader extraction/AI evaluation.

## Limits

Curated coverage, not a complete market census. Firm announcements are self-reported. Some sources block automated access. Text change detection can include changes to page furniture; AI explanations need checking. Exact quote validation does not prove every summary claim. No visitor accounts, user uploads or confidential data.

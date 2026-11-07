# FirmLens — law firms and AI

A public tracker of law firms' own announcements about AI. Search firms, inspect summaries, follow original sources and see saved checking history. An announcement is not proof that a product works.

**Residents: start with [the homework brief](homework/START-HERE.md).** You can complete the exercise through the residency channel without coding or a GitHub account. Code contributions use [CONTRIBUTING.md](CONTRIBUTING.md).

Public address: https://firmlens.app. [Architecture and status](architecture.md) · [AI instructions and limits](homework/AI-INSTRUCTIONS.md) · [Assessment criteria](homework/ASSESSMENT.md).

## What is in this repository

| Path | Purpose |
|---|---|
| `app/`, `components/firmlens/` | Next.js pages, public API, owner sign-in and interface |
| `lib/source.mjs`, `lib/analysis.ts`, `lib/refresh.ts` | Fetching evidence, validating saved analysis and recording changes |
| `lib/access.ts`, `lib/mcp-auth.ts` | Separate browser-session and AI-tool authentication |
| `migrations/`, `scripts/migrate-data.mjs` | Postgres schema and verified import of the existing evidence |
| `tests/` | Deterministic checks using an isolated local Postgres engine |
| `research/` | The original curated catalogue and source notes |
| `homework/` | Resident brief, cases, criteria, feedback template and screenshots |
| `reference/sites/` | The original speed-build source, retained for comparison; not the Vercel application |

## Local work

Use Node **22.20.0** and npm **10.9.3**. From the repository root:

```sh
npm ci
npm test
npm run verify
```

`npm run verify` is the canonical check: deterministic tests followed by the production build and TypeScript checks. It needs no production credentials. Do not run the migration script unless maintaining the deployment. The offline tests exercise a disposable database; they do not contact law-firm sites or call an LLM.

For the resident preview, run `npm run dev:demo` and open the local URL it prints. This serves three clearly labelled invented records, with no database account, owner access or model calls. It is read-only and is forbidden in production. Set `PORT` if the default port is unsuitable.

For backend development beyond that preview, use a separate development Neon project and the names in `.env.example`. Do not copy James's production credentials. The private authentication service and cloud schedule are not bundled in a Git clone.

## Hosting and release

Target: GitHub source → checked Vercel build → Next.js server → Neon Postgres and managed Neon Auth. AI analysis still uses the owner's Codex account through authenticated tools; no model API key is bundled. Migration status and current proof are in [DEPLOYMENT.md](DEPLOYMENT.md). A pushed branch, a successful build and a live domain are different milestones.

Only James merges approved work and releases it. PRs must not run with production credentials. The original Sites application is a recovery reference until the full migration is verified.

## Known limitations worth studying

The catalogue is curated, not exhaustive. Source checks revisit known URLs; they do not discover all new announcements. Some pages block fetching. Changed page text may only be changed navigation. An exact quote can accompany an unsupported summary. Source packets are currently truncated to 24,000 characters without an explicit truncation flag. A scheduled job is not evidence that an unattended run succeeded. These are candid starting points for the exercise, not guarantees of correctness.

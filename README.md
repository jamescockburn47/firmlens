# FirmLens — how law firms say they use AI

[Use FirmLens](https://firmlens.app) · [Homework and agent prompts](homework/START-HERE.md) · [Step-by-step GitHub guide](CONTRIBUTING.md)

FirmLens collects law firms' public announcements about AI. You can search, filter, read saved summaries, open the original sources and inspect checking history. It records what firms say: an announcement is not independent proof that a product works or that a firm uses it well.

We built the first version together during the LegalQuants residency. The live app now runs on Vercel and Neon. This repository contains its code and the material you need to understand it, question it and propose improvements.

## Homework: start here

**Your task is to exercise judgment and taste.** Try answering a real question with the site before asking an agent to inspect anything. Choose either route:

- **Feedback, no coding:** spend 15–20 minutes using the site. Post what you tried, what you noticed and what you would keep or change, with a reason and a link or screenshot.
- **Optional small PR:** choose one observation, investigate it with your coding agent, make one focused change and test it yourself. A pull request is a proposal for James to review; it does not publish your change. [Follow the setup and submission guide](CONTRIBUTING.md).

| Look at | Ask yourself |
|---|---|
| Accuracy | Does the original source support each important claim? Has a planned trial become a claimed firm-wide rollout? Are dates and figures attributed correctly? |
| Breadth | Which firms, jurisdictions or kinds of AI use are missing? Give a real source for a suggested addition. More entries are useful only if they belong here and can be checked. |
| Functionality | Can you answer your question using search, filters, sources and history? What useful action is missing or misleading? |
| UI and UX | Can you read, navigate and compare comfortably, including on a phone? Which wording, layout or interaction would you change, and why? |

**Post feedback in the residency channel:** “I was trying to… I noticed… I would keep/change… because…”, with a link or screenshot.

You do not need to find a bug. A useful positive observation or a reasoned design preference counts. Do not submit a generic AI-generated code review. **You supply the observation and decide whether the proposed result is better.**

We will acknowledge contributions to the site, including useful feedback. Tell James how you would like to be credited; do not submit someone else's personal details.

## How the app works

![FirmLens architecture: code and review, website and database, source checking and AI. Current status is explained below.](homework/images/architecture.svg)

### Current status — checked 7 November 2026

**The migration is complete.** [firmlens.app](https://firmlens.app) runs on Vercel with Neon; `www.firmlens.app` redirects to it. The original hosting service is retained for recovery, with owner writes disabled.

| Part | What it does | Status |
|---|---|---|
| GitHub | Holds the code, proposed changes and automated checks. | Public. Resident PRs require James's approval. James has a PR-only review exception; passing checks remain required. |
| Vercel + Next.js | Runs the website and server/API: reads, source checks and saving. | Live on the public domain. Owner sign-in and the source-check button tested there. |
| Neon Postgres | Stores announcements, retrieved text, summaries and history. | Original 14 entries, 17 source snapshots and settings restored and compared field by field. New checks and summaries persist here. |
| Neon Auth | Checks identity; the server permits only the configured owner to update records. | Browser and AI-tool connections tested. Anonymous and forged-identity writes rejected. Public browsing needs no account. |
| ChatGPT / Codex tools | Let the owner's AI account read evidence and save analysis. | Cloud read → analyse → save → read-back passed. There is no model API key in the app. |
| Weekly cloud task | Revisits the existing source URLs and updates analysis. | Enabled for Mondays at 09:00 Europe/London. A manual run checked all 14 records, fetched 11 sources and saved 2 summaries. Three source failures were recorded. |

**Known source problems:** Fieldfisher and Herbert Smith Freehills Kramer blocked automated fetching (HTTP 403). The Linklaters page did not contain the expected evidence passage and needs human review. These are visible failures, not successful updates. A future timed run has not yet occurred.

The approved AI-tool address remains `firmlens-beta.vercel.app/mcp`. Despite its name, it serves the same production Vercel app and Neon database. Keeping it stable preserves the approved tool connections.

[More detail and the original architecture](architecture.md) · [Deployment evidence and recovery](DEPLOYMENT.md)

### Follow one announcement

1. An owner starts a check of an existing official source URL. The server fetches it and saves the retrieved text and checking result.
2. ChatGPT or Codex asks a tool for that evidence and any previous differing text, then drafts a summary, a quotation and, where applicable, a change explanation.
3. The save tool checks the owner's permission, whether the snapshot is still current and whether the quotation appears in the source. It saves accepted analysis in the database.
4. Visitors read the saved result. **Opening a card does not call an LLM.**

This is why there is a server and a database: visitors see shared, persistent records with source history, while only the owner can update them. The coding agent that helped build the software and the AI that writes its summaries perform different jobs. Search, filters, sign-in and quote matching are ordinary code.

## What to question about the AI

- A matching quote does **not** establish that every sentence in the summary is supported. Check the whole claim against the source.
- The catalogue is curated, not exhaustive. Rechecking known URLs does not discover every new announcement.
- A changed page may only have a changed menu or footer. A fetch failure is not evidence that the announcement is false or has disappeared.
- Evidence supplied to the model is limited to 24,000 characters per current/previous text, without an explicit truncation flag.
- Good instructions are not the same as enforced rules. For example, pilot-versus-rollout wording is requested in the instructions, but not semantically checked by the save code.

[Read the actual AI instructions and checks](homework/AI-INSTRUCTIONS.md) · [Weekly task instructions](UPDATE-WORKFLOW.md) · [Optional synthetic test cases](homework/AI-CASES.md)

## Optional: make one small PR

1. Start with something you noticed while using the site. Decide what you would change and why.
2. [Create a GitHub account](CONTRIBUTING.md#1-create-a-github-account). Send James your username if you want contributor access, or use a fork.
3. [Set up a local copy with your agent](CONTRIBUTING.md#3-open-a-local-copy-with-your-coding-agent). The safe demo uses invented records and needs no live credentials.
4. Ask the agent to investigate and implement your chosen change. [Use these prompts](homework/START-HERE.md#prompt-1--investigate-my-observation). Check the result yourself and run the project checks.
5. [Submit a PR for James to review](CONTRIBUTING.md#5-save-your-branch-and-open-a-pr). Include your observation, reason, before/after evidence and tests. Do not merge or deploy it yourself.

A PR is a proposed change, not an automatic release. A small improvement you can explain and demonstrate is enough. If setup gets in the way, give feedback instead.

## Find the part you want to understand

| Files | What to inspect |
|---|---|
| `app/`, `components/firmlens/` | Pages, search/filter interface, API routes and owner sign-in |
| `lib/source.mjs`, `lib/refresh.ts` | Source fetching, text extraction, quote validation and change recording |
| `lib/analysis.ts`, `lib/rpc.ts` | Evidence sent to the AI, instructions, tool definitions and saving analysis |
| `lib/access.ts`, `lib/mcp-auth.ts`, `lib/owner-policy.mjs` | Browser/tool authentication and owner permission rules |
| `lib/database.mjs`, `migrations/` | Database access and schema |
| `tests/` | Automated checks, including an isolated local database |
| `research/` | Original curated catalogue and source notes |
| `homework/` | Brief, prompts, review criteria, examples and diagrams |
| `reference/sites/` | Historical speed-build source; excluded from the replacement build |

## Run a safe local preview

Use Node **22.20.0** and npm **10.9.3**. If these are unfamiliar, use the setup prompt in [CONTRIBUTING.md](CONTRIBUTING.md).

```sh
npm ci
npm run verify
npm run dev:demo
```

Open the local URL printed in the terminal. The preview uses **three clearly labelled invented records**. It needs no hosting account, production database or AI credentials. It is read-only and does not test owner sign-in, production writes or model output. Keep the terminal running while you inspect it; Ctrl+C stops it. Set `PORT` if the default port is unavailable.

`npm run verify` checks the source-file limit, regeneratable diagram, tests, types and production build. It needs no production credentials and makes no model calls. Passing it does not prove that a summary is true or that the design is useful: inspect those yourself.

For backend work, use isolated fixtures or a separate development database. Do not copy James's credentials, run production migrations or change live records. PRs do not receive production secrets. James reviews changes before merging or releasing them. [Contribution guide](CONTRIBUTING.md) · [Project intent](intent.md) · [Agent rules](AGENTS.md)

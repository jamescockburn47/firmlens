# Deployment and recovery

Migration completed on 7 November 2026. https://firmlens.app serves the GitHub application on Vercel, using Neon Postgres and Neon Auth. https://www.firmlens.app redirects to it, preserving the path and query. The original Sites application is retained for recovery with owner writes disabled.

## What was proved

- The original export's 14 entries, 17 source snapshots and one settings row were restored and compared field by field, including raw HTML and retrieved text. Additional checks and analyses now persist in Neon.
- Cutover release: commit `8e0e3720cef5c667dbeb3367f0ddf6066b2aff1d`, Vercel deployment `dpl_7Zs64VqcVZz41m7JBarZbBf7tiga`. Required GitHub verification and Vercel build passed.
- The real journey at https://firmlens.app passed: Google owner sign-in → Owner view → Check source → saved checking history. The 17:47:07 UTC result was independently confirmed through the public API.
- The new ChatGPT cloud connection read evidence, refreshed A&O Shearman, saved analysis at 17:40:20 UTC and read it back. The saved summary was checked against the source, including the distinction between investment of lawyer time and cash.
- A manual run of the weekly cloud task checked all 14 entries sequentially: 11 fetched, 2 refreshed summaries saved (CMS and MinterEllison), 3 source failures. The two changed pages contained page-furniture changes, not substantive announcement changes. Summaries, timestamps and change explanations persisted in Neon and the public API.
- The first schedule-label save was rejected. A shorter label succeeded and the public API reflects the completed run. The task instructions now specify the 149-character limit; the tool schema and validation expose it explicitly.
- Independent review confirmed public reads/history, HTTPS, `www` redirect, anonymous and forged-identity write denial, MCP token rejection, stable OAuth metadata and the GitHub controls.

## Remaining product limits

Fieldfisher and Herbert Smith Freehills Kramer returned HTTP 403. Linklaters did not contain the original evidence passage and requires human review. These checks remain marked failed; they were not bypassed or reported as successes.

The weekly task is enabled for Mondays at 09:00 Europe/London, next scheduled for 9 November. A manual Run now exercised its production workflow. A future timed execution has not yet occurred. It checks existing URLs, not exhaustive discovery. [Saved instructions](UPDATE-WORKFLOW.md).

## Hosting and connections

The Vercel project is `firmlens`, in James Cockburn's projects. Its build command is `npm run verify:deploy`, which invokes the canonical `npm run verify`. Environment values are server-side and production-scoped. Do not attach production database/auth credentials to arbitrary PR previews.

`APP_ORIGIN` is `https://firmlens.app`. Neon Auth's login and consent pages use that origin. `MCP_RESOURCE_URL` remains `https://firmlens-beta.vercel.app/mcp`: this is a stable alias of the same production app and database, preserved to keep the already-approved OAuth audience valid. Do not blanket-redirect that hostname or change the audience without planning reconnection. Browser mutation-origin checks remain restricted to the configured public origin.

The cloud task uses the connection named **FirmLens — Vercel backend**. Its old linked-Sites icon remains in the task UI, but its saved instructions and verified tool execution use the Vercel backend. The old Sites native connection cannot write.

## GitHub review rules

[Main ruleset](https://github.com/jamescockburn47/firmlens/rules/26765341) requires one approving code-owner review and dismisses stale approvals. James's account alone has a **pull-request-only** review exception, avoiding the impossibility of approving his own PR. The exception applies to PR merges by James, not only PRs he authored. Residents still need his review.

Classic protection independently requires strict passing `verify` checks from GitHub Actions, including for administrators, and prohibits force pushes and branch deletion. The duplicate classic review rule was removed only after the replacement ruleset was active. No CI waiver or direct-main-push exception was added.

## Release path — James only

1. Review a focused PR and run `npm run verify` on its exact candidate. Auth/data changes also need fresh independent review and relevant live probes.
2. Wait for required GitHub checks. Merge the reviewed PR; the linked Vercel project runs the same verification before deploying production. Do not bypass checks.
3. Probe public reads/history and the affected owner journey on the real domain. Record the deployed commit and result.
4. Before a stateful release, export the current database, keep migrations compatible and plan reconciliation. A code rollback does not restore data.

GitHub CLI's preflight may report a review block despite James's ruleset exception. The normal GitHub PR merge API honours the exact-user exception and still enforces checks. Use the verified current PR head SHA; do not disable protection or use a broad administrator bypass.

## Recovery

Original source and exports are retained locally outside Git. `outputs/source-backup-final.json` contains the 14-entry/17-snapshot original export; restore verification compared all fields. `outputs/neon-before-cutover.json` preserves the Neon state before final-domain traffic. `outputs/dns-before-cutover.json` records prior DNS.

Freezing the old host required an explicit nonmatching owner value; removing the old environment entry alone did not disable its resolved configuration. A diagnostic source refresh at 17:42:59 UTC therefore exists only in the retained original database, after the original export. It is not part of the imported 17 snapshots. Subsequent old-host browser and native writes were denied. No original database was deleted.

Current DNS uses Vercel's configured apex A records `216.150.1.1` and `216.150.16.1`; `www` points to `7b494c6e9c2bbb17.vercel-dns-016.com`. Previous apex records were `162.159.143.30` and `172.66.3.26`; previous `www` was `custom-domains.chatgpt.site`. Read current record IDs before changes; updates can change them.

Prefer rolling back compatible Vercel code on the existing Neon database. If traffic must return to the original host, first pause the updater, export and reconcile all new Neon writes, restore the original owner's configuration deliberately, and verify the complete entry journey before changing DNS. Otherwise a host rollback would hide new updates. Production restore drills and destructive migrations are outside the resident exercise.

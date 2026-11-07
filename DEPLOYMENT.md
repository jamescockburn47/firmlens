# Deployment and recovery

Status at preparation, 7 November 2026: the existing Sites app still serves firmlens.app. The separate Vercel project and Neon database exist; full database restore passed. The replacement is deployed from GitHub at https://firmlens-beta.vercel.app. Public reads, all stored histories, Google owner sign-in, an owner source refresh and anonymous/forged-header denial have passed. OAuth consent and token exchange now pass. The headless client cannot execute tools because its approval policy cannot prompt; native tool execution remains unproven. The old weekly job is paused and domain cutover remains pending. Update this status when live evidence exists.

The Vercel project is `firmlens`, in James Cockburn's projects. Its build command is `npm run verify:deploy`, which invokes the canonical `npm run verify`. Environment values are server-side and production-scoped. GitHub contributors do not receive them. Do not attach production database/auth credentials to arbitrary PR previews.

## Release path (James only)

1. Review a focused PR and its tests. Run `npm run verify` on the exact candidate.
2. Review auth/data/publication changes independently. Ensure required GitHub checks and branch controls are configured before inviting writers; platform plan limits must be recorded, not silently ignored.
3. Deploy the reviewed commit through the linked Vercel project. Probe public reads, history, anonymous denial and the affected owner journey on the deployment before moving a domain.
4. For a stateful migration, stop old writers first, export again, reconcile changes and verify complete data. Do not drop the old database.
5. Record deployed commit, URL, checks and any remaining limitations. Only then announce completion.

## Recovery

Before cutover, the original Sites app remains the live recovery point. A complete export is stored locally outside Git. Restore verification compares every field of each table, including raw HTML and text.

After cutover, Vercel rollback restores code, not database contents. Keep schema changes additive and compatible with the previous release. If new writes have occurred, export/reconcile them before moving traffic back; otherwise rollback could discard visible updates. Record the previous DNS records before changing them. Destructive migrations and production restore drills are outside the resident exercise.

## AI and schedules

Browser tools and native MCP share application logic but have different authentication. Prove both. The old native connection points at the original Sites hostname; installing a new URL does not update that connection automatically. Likewise, migrating the database does not migrate the old cloud schedule. Retire or redirect the old schedule and verify the replacement's first run before claiming autonomous updates work.

## Evidence from the replacement

Initial deployed commit: `a479364541a7ca6c95da1aad2fad05f5f42a7444`. GitHub Actions run 42394469623 succeeded on a fresh Ubuntu environment without production secrets. Vercel deployment dpl_9xFePp5GywiezLkGdeq9KcLbgjQK succeeded in London. Public API returned 14 announcements and 12 saved AI summaries. Unauthenticated MCP returned 401; forged owner-header mutation returned 403. Google callback produced Owner view; source refresh saved a new snapshot at 2026-11-07T17:07:04.225Z, confirmed by an independent HTTP read.

A live MCP login then exposed a separate social-login continuation defect. Its fix is being tested before the connection or domain is declared complete.

# Migration and resident exercise

1. Export the complete original database through an owner-only route; keep the live site working.
2. Restore into a separate Neon database and compare every field. Completed: 14 entries, 17 snapshots, one setting, exact row hashes matched on 7 November 2026.
3. Port the application to Next.js/Vercel and replace Sites identity with managed authentication. Test read, write denial, owner callback and AI-tool round trip.
4. Independently review the migration; resolve material findings; create a private GitHub repository and connect Vercel.
5. Prove the replacement on its Vercel address, reconcile final source data, retire the old writer/schedule and switch both public domain variants. Retain recovery evidence.
6. Publish the resident homework pack with accurate current architecture/status and contribution instructions. Residents choose feedback or a proposed code/test/documentation change.

Completion requires the real first-use journey, not just a green build. Check DEPLOYMENT.md for release state.

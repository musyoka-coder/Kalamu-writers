# Kalamu Writers

This repository contains the static web frontend, the real admin dashboard, and the tracked Supabase Edge Function source.

## Frontend
- `index.html`, `kalamu-client.js`: registration, verified login, payment-review status, task browsing and tier upgrades, submission status and earnings.
- `admin.html`, `kalamu-admin.js`: real Supabase administrator login, payment review, task publishing and tier/payout settings, submission review, administrator account creation, suspension/reactivation and account controls.
- The browser uses a public Supabase publishable key. **Never add a service-role key or other secret to this repository.**

## Live backend
Supabase project: `lrwnhpdkaplrwisiyroo`. The active `kalamu-ops` Edge Function is version 10 (2026-11-06). The tracked source is synchronized with the deployed function. It includes browser CORS support for `x-client-info`, authenticated admin account creation, and Auth-level bans/unbans synchronized with profile status. It checks the authenticated user, confirmed email, active role, payment status, and package entitlement. Sensitive payment reviews, submission approval and withdrawal reservations use restricted database functions that execute as a single transaction.

New users submit the complete M-Pesa confirmation SMS during signup. The database records **pending**, never automatically approved. Admin approval is only appropriate after checking the real Safaricom/M-Pesa statement. The SMS alone does **not** establish payment. Email confirmation is also required.

Package access: Starter KES 500, Standard KES 1,500, Premium KES 3,000. An approved higher tier can claim eligible lower-tier tasks. A lower-tier member can submit an upgrade request, but the tier changes only after payment approval.

Submission text is reviewed by the administrator; users cannot self-approve or create earnings. The AI indicator is a **demonstration writing-pattern heuristic**, not a scientifically validated detector or proof of AI authorship. The administrator records an AI score, note, deduction and final award within the advertised task payout range. Withdrawal requests are reservations, **not automated M-Pesa payouts**.

## Production status — 2026-11-05
- GitHub code changes committed to the `main` branch.
- Supabase schema/permissions and Edge Function deployed.
- 40 unclaimed demo tasks closed; no verified real tasks currently open.
- Vercel connector can read the team but returns **403 Forbidden** for project creation and production deployment. The updated frontend has **not** been deployed through this connection.
- The prior Vercel admin URL is not currently verified.

The Vercel project-creation endpoint returned **403 Forbidden** again on 2026-11-06, so frontend production deployment is **not** confirmed. Code merges to GitHub do not imply a live release.

To deploy manually: sign in to Vercel with the owner account, open https://vercel.com/new, select team `musyokas-projects-0b14d658`, import `musyoka-coder/Kalamu-writers`, choose framework **Other** with repository root as source, and deploy. After deployment, the admin portal is `https://<your-deployed-domain>/admin.html`.

Before taking real registration fees, publish verified paid assignments and test email confirmation, payment approval, submissions, withdrawal reservations and administrator creation and learner suspension/reactivation with controlled test accounts.

Deployment status: production release requires verified Vercel project and end-to-end payment review testing.

## Admin regression checks (2026-11-06)
- Static JavaScript syntax checks passed for `kalamu-admin.js`, `kalamu-client.js`, and `supabase/functions/kalamu-ops/index.ts` (after removing TypeScript non-null assertions for JS parsing).
- Supabase `kalamu-ops` version 10 is deployed and its code matches the tracked source. The `x-client-info` CORS preflight header was missing before version 8.
- The database currently has one active verified super admin, two active learners, and no ordinary administrator accounts or stored payments. Do not infer real end-to-end success from these counts.
- Live checks still required: create an isolated administrator through the super-admin panel; log in as that account; suspend/reactivate a controlled learner; submit M-Pesa evidence for independent review; verify email redirect and delivery from the deployed domain.
- Suspension bans future sign-ins with Supabase Auth; existing access tokens may remain valid until expiration, so the Edge Function and task RLS also enforce active status.

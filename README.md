# Kalamu Writers

A static frontend backed by Supabase Auth, PostgreSQL/RLS and the `kalamu-ops` Edge Function. **Currently in free practice / workflow-testing mode.**

## What is available

- **Free signup and login**: full name, optional phone, email and password. No M-Pesa SMS, payment or fee during this phase. Email verification remains subject to Supabase Auth settings.
- **Tier catalog**: 8 Starter (KES 500 benchmark), 10 Standard (KES 1,500), and 15 Premium (KES 30,000) active practice projects. The amounts in project cards are illustrative, not wages.
- **Access**: new accounts are Starter. An authenticated, active learner can see the full catalog and claim their tier's work within the daily limit. Higher-tier attempts are saved and present an upgrade requirement; admins assign tiers through Supabase.
- **Submission testing**: learners paste text, submit for editorial review and view feedback. Admins see claim/submission/upgrade attempts; review a practice submission without generating earnings.
- **Role permissions**: the existing owner is `super_admin`. Additional `admin` accounts are created and assigned through Supabase only. No create-admin control or endpoint is exposed by the website.
- **Audit history**: admin activity records show the actor, action, time, target and reason. Suspension records include `suspended_by` and `suspended_at`. Auth-level account ban/unban accompanies application status.
- **Safety**: practice submissions are non-payable and do not affect withdrawal balances. Payment and withdrawal Edge Function actions are disabled for this phase. Users cannot approve their own assignments.

## Project files

| Path | Function |
| --- | --- |
| `index.html`, `kalamu-client.js` | Free signup, practice projects, tier access, submissions |
| `admin.html`, `kalamu-admin.js` | Admin login, project activity, editorial review and audit history |
| `supabase/functions/kalamu-ops/index.ts` | Supabase Edge Function (**deployed version 12**) |
| `supabase/seed/free_practice_catalog.sql` | Repeatable SQL seed for the 33 practice assignments |
| `supabase/ADMIN_SETUP.md` | Direct Supabase admin provisioning and practice-tier assignment |
| `assets/kalamu-writers-logo.svg` | Logo/favicon |

## Tested in the connected Supabase project

- Three-tier catalog counts confirmed: **8 / 10 / 15** live practice tasks.
- Learner role can read the live practice catalog; unauthorized users cannot read the catalog through its Data API permissions.
- Transactional practice review returned **approved** with **KES 0 payable**; all test inserts were rolled back.
- Edge Function v12 deployed with auth checks and the browser `x-client-info` CORS header.
- JS syntax checks pass for browser scripts and Edge Function (with Deno TS assertions stripped for parsing).
- **Not yet tested end-to-end**: full browser signup, real admin role setup, claim/submission with Supabase session, and account suspension using separate test users.

## Production deployment

Changes are pushed to GitHub. The connected Vercel team **does not have this project**, and its project-creation API returned **403 Forbidden**. Frontend deployment is **not confirmed**.

To deploy with the authorized account, import this GitHub repo at https://vercel.com/new, use framework **Other**, root directory `/`, and deploy. The admin portal is `https://<deployed-domain>/admin.html`.

Set the deployed origin in Supabase **Authentication → URL Configuration**, including Site URL and the allowed Redirect URLs for email verification. If the project requires immediate session creation at sign-up instead of confirming email, that depends on Supabase's Auth email-confirmation setting; it was **not changed** through the connector.

This is a practice/testing service. No claim that practice projects provide actual client work or payable income should be made.

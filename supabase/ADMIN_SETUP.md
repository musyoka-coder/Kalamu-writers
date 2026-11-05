# Administrator provisioning from Supabase

Administrator creation has been removed from the website. The authenticated role is held in `public.profiles.role`, not in browser-provided metadata. Only trusted Supabase console operators (project owners) should change it.

## Create an administrator

1. In **Supabase Dashboard → Authentication → Users → Add user**, create the account with a temporary strong password and confirm/verify its email address through Supabase's supported flow. Do not give it super_admin.
2. Open **Supabase Dashboard → SQL Editor** and run the following SQL, replacing the sample email with the actual new account's email:

```sql
UPDATE public.profiles
SET role = 'admin', account_status = 'active'
WHERE lower(email) = lower('admin@example.com')
  AND role = 'learner'
RETURNING id, email, role, account_status;
```

The query must return exactly one row with `role = admin`. If it returns zero, stop and check that the Auth account and profile exist. **Never assign `super_admin` to additional accounts.** Keep the existing owner's role unchanged.

3. Admins log in on `/admin.html` with their Supabase account email and password. Their authorized access comes from `public.profiles.role = 'admin'`.
4. Change initial passwords after first login. Use Supabase Auth recovery and MFA according to the organization's security policy.

## Grant practice-tier access

All new learners are assigned `starter` automatically. Changing a tier is a manual **practice-access grant** and does not represent payment:

```sql
UPDATE public.profiles
SET package_id = 'standard'
WHERE lower(email) = lower('learner@example.com')
  AND role = 'learner'
RETURNING email, package_id;
```

Valid tier IDs: `starter`, `standard`, `premium`. Premium is illustrated by a **KES 30,000 tier benchmark**, not a charge during free practice. Lower-tier learners may view the briefs but cannot claim higher-tier projects.

## Accountability and safety

- Suspend/reactivate actions record the administrator's identity, timestamp, reason and target in `public.audit_logs`, and `public.profiles.suspended_by/suspended_at`.
- Practice project claims, higher-tier attempts and submissions are stored in `public.task_events`.
- Admins and the super admin can read the activity views, while learners can only read their own assignment records.
- Practice projects are `is_demo=true` internally, clearly labelled as **practice** in user-facing copy, and generate **no withdrawable earnings**.
- Payment and withdrawal API actions are disabled during the trial.
- Email confirmation remains subject to Supabase Auth settings. The production URL must be on the allow list in Auth URL Configuration.

## Deployment

The changes are committed to GitHub and deployed as the Supabase Edge Function, but frontend availability depends on a separate Vercel static-site deployment. A GitHub commit is not proof of production deployment.

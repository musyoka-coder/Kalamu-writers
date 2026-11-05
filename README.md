# Kalamu Writers — public frontend

This repository contains only the static frontend and its Supabase browser client. Supabase URL and publishable key are intentionally public; never add a service-role key, secrets, passwords, or private keys.

Files: `index.html`, `admin.html`, `kalamu-client.js`, `kalamu-admin.js`.

**Security warning:** This is an unverified frontend. The server-side operations and database RLS must be audited and tested before handling real payments, uploads or withdrawals. M-Pesa SMS alone is not payment verification. The PDF/DOCX upload path is not yet fully implemented.

Deploy with Vercel as a static site. Keep privileged Edge Functions in Supabase; deploy only audited functions through a private backend workflow.

# Valora Group — Pre-launch checklist

Status: production build passes · **0 npm vulnerabilities** · security headers + RLS + rate limiting + bot protection in place · bilingual · privacy policy live.

## Turn the live site on (in Vercel → Settings → Environment Variables, then Redeploy)
- [ ] `NEXT_PUBLIC_SITE_URL` = your live URL (e.g. `https://valoragroup.ai`)
- [ ] `ANTHROPIC_API_KEY` — chat assistant
- [ ] `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — contact email
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — lead storage
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` — bot protection
- [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CHAT_DAILY_LIMIT` — rate limiting

## External setup
- [ ] **Supabase** — run `supabase/migrations/0001_create_leads.sql`; submit a test lead and confirm it lands in Table Editor → `leads`.
- [ ] **Resend** — verify your sending domain; point `CONTACT_FROM_EMAIL` at it.
- [ ] **Turnstile** — add your production domain to the widget's allowed hostnames.
- [ ] **Custom domain** (optional) — add in Vercel; update `NEXT_PUBLIC_SITE_URL`; add to Turnstile hostnames.
- [ ] **Smoke test live** — chat replies; contact form (email + Supabase row); EN/ES switch; mobile.

## Decisions that still need a human (legal / business)
- [ ] **Privacy policy** — fill the `[bracketed]` legal entity + address in `lib/legal.ts`; confirm the 24-month retention period; have counsel review if your market requires it.
- [ ] **Contact email** — replace the `hello@valoragroup.ai` placeholder if your real address differs (`messages/*.json`, `.env`).
- [ ] **Chat model** — keep `claude-sonnet-4-6` (fast/cheap) or switch to `claude-opus-4-8` via `ANTHROPIC_MODEL`.
- [ ] **`CHAT_DAILY_LIMIT`** — tune the daily AI-spend cap to your budget.
- [ ] **Consent style** — currently a notice line ("By submitting, you agree to our Privacy Policy"). Upgrade to a required checkbox if your jurisdiction needs explicit opt-in.

## Backups & restore
- **Code** — GitHub is the backup. Restore = clone + `npm install`.
- **Database** — Supabase takes automatic backups (point-in-time on paid tiers; free tier = manual). Export leads anytime via Table Editor or `pg_dump`. Nothing else is persisted.
- **Secrets** — live in Vercel env vars + your local `.env.local` (never in git). Keep a copy in a password manager.

## Notes (no action needed)
- `middleware.ts` shows a Next 16 deprecation notice (suggests `proxy.ts`); kept because next-intl documents `middleware.ts`.
- CSP uses `'unsafe-inline'` for scripts/styles (standard for Next without nonces); can be tightened to nonces later.
- The WebGL globe loads only on screens ≥ 640px (mobile performance).
- `postcss` is pinned via `overrides` to a patched version (clears the only audit advisory without downgrading Next).

# Valora Group — Hardening & Polish Plan

> Phase 1 deliverable. **No code has been changed.** Review the issues and proposed
> changes below, then approve and I'll proceed phase by phase, summarizing after each.

---

## 1. Architecture summary

| Aspect | Details |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript (strict) |
| **Styling** | Tailwind CSS v4 (CSS `@theme` tokens) + Framer Motion |
| **i18n** | next-intl v4 — locale routing `/en`, `/es` (middleware-driven) |
| **Hosting (intended)** | Vercel |
| **Database** | **None** — no persistence layer |
| **Auth** | **None** — fully public site, no accounts/login/admin |
| **3rd-party services** | Anthropic (Claude, chat assistant) · Resend (contact email). No analytics, no payments. |

### Routes / pages
- `/[locale]` — home (Hero w/ WebGL globe → PainPoints → Approach → Services → CaseStudy → WhyValora → FAQ → Contact)
- `/[locale]/work/fernando-piero` — case study deep-dive
- `/[locale]/opengraph-image` — dynamic OG image (per locale)
- `/sitemap.xml`, `/robots.txt`, `/icon.svg` — generated metadata

### API endpoints (server)
- `POST /api/chat` — streams a Claude response for the assistant widget. Public. Zod-validated (≤24 msgs, ≤4000 chars each, must start with a user turn). Per-IP rate limit (20/min). Static system prompt + knowledge base sent as a prompt-cached block. `max_tokens` capped at 1024. Aborts upstream on client disconnect. Returns 503 if no API key, 429 if limited, 400 on bad input.
- `POST /api/contact` — validates a lead (Zod), checks a honeypot, rate-limits (5/min/IP), sends email via Resend. If Resend isn't configured it logs the lead and returns success.

### Data collected
- **Contact form:** name, email, company (optional), message → emailed via Resend (not stored in any DB).
- **Chat:** user messages → sent to Anthropic for completion (not stored by us).
- No cookies beyond next-intl's locale handling; no tracking/analytics.

### Unfinished / placeholder / to-verify
- Contact email is the placeholder `hello@valoragroup.ai` (in `messages/*.json` + `.env.example`).
- Live features need keys: `ANTHROPIC_API_KEY` (chat), `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (contact). Both degrade gracefully without keys.
- No privacy policy / consent UI yet.
- `hero.tags` i18n key is now unused (left over from the pre-globe hero).

---

## 2. Prioritized issues

### 🔴 Critical — none found
No committed secrets (verified: `.gitignore` covers `.env*`/`*.pem`; content scan of all 54 tracked files is clean). No database, no auth surface, no admin/debug routes, no SQL. Nothing that risks a breach or data exposure on push.

### 🟠 High
- **H1 — No security headers.** Nothing sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, or Referrer-Policy. The site is clickjackable and missing standard hardening.
- **H2 — Weak abuse protection on paid endpoints.** Rate limiting is **in-memory per serverless instance** (resets per cold start, not shared across instances) and there's **no global spend cap** and **no CAPTCHA**. A determined caller could run up the Anthropic bill on `/api/chat` (or spam `/api/contact`).

### 🟡 Medium
- **M1 — `.env.example` is gitignored** (caught by `.env*`), so the template isn't committed — collaborators/Vercel won't see which vars to set.
- **M2 — PII in logs.** `/api/contact` logs the full lead (name/email/message) to the server console when Resend isn't configured.
- **M3 — No CORS / origin lock on API routes.** Browsers are same-origin by default, but server-to-server POSTs aren't restricted (ties into H2 abuse).
- **M4 — No privacy/consent.** A lead-collecting consulting site has no privacy policy or consent line (GDPR/CCPA consideration). *Business/legal decision.*
- **M5 — `npm audit`: 3 moderate vulnerabilities** reported — need review and patching.

### 🟢 Low
- **L1 — Dead i18n key** `hero.tags` (EN + ES) — unused since the globe hero.
- **L2 — Contrast check.** `text-faint` (#6f6a63) on the ink canvas may fall below WCAG AA for small text; verify and nudge if needed.
- **L3 — Stale doc note** in `AGENTS.md` (client-components list predates the globe).
- **L4 — Repo description typo** ("AI Consulting Form" → "Firm") — cosmetic, GitHub-side.
- **L5 — `middleware.ts` deprecation notice** (Next 16 suggests `proxy.ts`; next-intl still documents middleware) — cosmetic.

---

## 3. Proposed changes per phase

### Phase 2 — Security
- **H1:** Add a `headers()` config (next.config) with HSTS, X-Frame-Options `DENY`, X-Content-Type-Options `nosniff`, Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy, and a **Content-Security-Policy** tuned for this app (Next, the globe canvas, next/og, Resend). I'll start CSP in report-friendly/strict mode and flag anything it breaks.
- **M1:** Add `!.env.example` to `.gitignore` so the template commits (keeps real `.env*` ignored).
- **H2 / M3:** Strengthen limiting — keep per-IP, add a per-instance global cap as a backstop, add an **origin check** on both API routes (allow only your domain + localhost). Recommend **Upstash Redis** for true global limits and **Cloudflare Turnstile** (or hCaptcha) for bot protection on the chat + contact form — both need keys/accounts, so I'll **ask you** before wiring them and provide a clean integration point either way.
- **M2:** Redact/remove PII from logs (log a hashed/truncated reference, not the message body).
- Confirm (already fine): no stack traces leaked to clients; generic error codes; client disconnect aborts the AI call.

I'll report each item as **already-fine / fixed / needs-your-input**.

### Phase 3 — Data handling & privacy
- Confirm data minimization (already minimal; nothing stored server-side).
- Add a consent line near the contact form + a `/privacy` page. **Content (retention period, entity details, compliance scope) needs your input** — I'll draft sensible defaults for approval, not invent legal commitments.
- Document retention (leads currently live only in your email inbox) and a deletion path.
- Note GDPR/CCPA considerations for collecting client contact info + sending chat text to Anthropic.

### Phase 4 — Code organization
- Fix `.env.example` tracking (also under M1), remove the dead `hero.tags` key, scan for any other dead code/unused exports, confirm every dependency is used, and refresh `README.md` / `AGENTS.md`. (Structure is already conventional — this is cleanup, not a restructure.)

### Phase 5 — UI / a11y polish
- Verify WCAG AA contrast across text tokens (adjust `text-faint`/`text-muted` if any fail) and confirm focus states, keyboard nav, reduced-motion, and semantic structure (mostly in place). Confirm the globe is decorative/`aria-hidden` and lazy/gated (it is). Tasteful, no redesign — the ink + champagne-gold system stays.

### Phase 6 — Dependencies & pre-launch
- Run `npm audit`, assess and patch the 3 moderate vulns (flag any breaking upgrades before applying).
- Document "backups" (code = git; no DB to back up) and restore steps.
- Deliver a final pre-launch checklist + a list of items needing a human decision (keys, privacy content, repo visibility, custom domain).

---

## Decisions I'll need from you (surfaced now, not guessed)
1. **Bot protection** — OK to add Cloudflare Turnstile (free) to the chat + contact form? It needs a site/secret key.
2. **Global rate limiting** — add Upstash Redis (free tier) for cross-instance limits + AI spend caps, or keep in-memory for now?
3. **Privacy policy** — do you have entity details / preferred data-retention period, or should I draft defaults for your review?
4. **Strict CSP** may require small tweaks if it blocks anything — OK to iterate?

---

**Awaiting your approval to start Phase 2.** I won't change code until you say go.

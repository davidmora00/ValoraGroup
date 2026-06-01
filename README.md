# Valora Group

The website for **Valora Group** — an AI consultancy that solves everyday business pain points. Bilingual (English / Spanish), premium dark design, and a live, brand-aware AI assistant that is itself an example of what Valora builds.

> _We find what slows your business down — and hand it to AI._

---

## Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router) + **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** (CSS `@theme` tokens) + **Framer Motion** |
| i18n | **next-intl v4** — locale routing under `/en` and `/es` |
| AI assistant | **Anthropic SDK** (Claude) — streaming, prompt-cached knowledge base |
| Contact email | **Resend** + **React Hook Form** + **Zod** |
| Deploy | **Vercel** |

## Features

- **Single-page home** (`/en`, `/es`): Hero → Pain Points → Approach → What We Build → Fernando Piero case study → Why Valora → FAQ → Contact.
- **Case study deep-dive** at `/work/fernando-piero`.
- **Live AI assistant** (floating widget) — streams answers, grounded in a Valora knowledge base, replies in the visitor's language.
- **Contact form** with validation → email notification via Resend (logs to console until configured).
- Fully **bilingual** with a language switcher, **SEO** (per-locale metadata, `hreflang`, sitemap, robots), and dynamic **Open Graph** images.
- Accessible: keyboard-friendly nav and chat, reduced-motion support, semantic markup, native `<details>` FAQ.

## Project structure

```
app/
  [locale]/
    layout.tsx                 # fonts, providers, header/footer/chat, metadata
    page.tsx                   # home — composes the sections
    work/fernando-piero/       # case study deep-dive
    opengraph-image.tsx        # dynamic OG image per locale
  api/
    chat/route.ts              # streaming Claude assistant
    contact/route.ts           # Zod validation + Resend email
  globals.css                  # Tailwind v4 design tokens
  icon.svg, sitemap.ts, robots.ts
components/
  ui/                          # Container, Section, SectionHeading, Button, Card, Eyebrow, Reveal
  layout/                      # Header, Footer, Brand, LanguageSwitcher
  sections/                    # Hero, PainPoints, Approach, Services, CaseStudy, WhyValora, FAQ, Contact
  chat/ChatWidget.tsx          # floating streaming assistant
i18n/                          # next-intl routing, navigation, request config
lib/
  valora-knowledge.ts          # the assistant's system prompt + knowledge base
  rate-limit.ts                # in-memory rate limiter
  icons.tsx, utils.ts
messages/                      # en.json, es.json — all site copy
middleware.ts                  # next-intl locale routing
```

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in keys (all optional for local dev)
npm run dev                     # http://localhost:3000  -> redirects to /en
```

The site **builds and runs with no environment variables** — the assistant shows a friendly "not configured yet" message and the contact form logs submissions to the server console. Add keys to enable the live features.

### Environment variables

See [`.env.example`](.env.example). Summary:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata / sitemap / OG |
| `ANTHROPIC_API_KEY` | Enables the live chat assistant |
| `ANTHROPIC_MODEL` | Optional; defaults to `claude-sonnet-4-6`. Use `claude-opus-4-8` for max quality |
| `RESEND_API_KEY` | Enables contact-form email delivery |
| `CONTACT_TO_EMAIL` | Where inquiries are sent |
| `CONTACT_FROM_EMAIL` | "From" address (must be a Resend-verified domain) |

## The AI assistant

`POST /api/chat` streams responses from Claude. The system prompt + company knowledge live in [`lib/valora-knowledge.ts`](lib/valora-knowledge.ts) and are sent as a single `cache_control: ephemeral` block, so the static prefix is served from Anthropic's **prompt cache** on repeat requests. The endpoint is rate-limited and aborts the upstream call if the visitor disconnects. Edit the knowledge file to change what the assistant knows; keep it static so the cache stays warm.

## Contact form

`POST /api/contact` validates with Zod, blocks bots with a honeypot, rate-limits per IP, and sends an email via Resend. Without `RESEND_API_KEY` + `CONTACT_TO_EMAIL`, leads are logged to the server console and the form still reports success (handy for local dev).

## Editing content

All visible copy is in [`messages/en.json`](messages/en.json) and [`messages/es.json`](messages/es.json) — keep the two in structural sync (same keys / array lengths). The design palette and fonts are tokens at the top of [`app/globals.css`](app/globals.css); change `--color-gold` (and friends) to re-skin the whole site.

## Hero globe

The interactive globe is [`components/sections/Globe.tsx`](components/sections/Globe.tsx) (a client wrapper, mounted only on screens ≥ 640px so three.js stays off mobile) + [`components/sections/GlobeImpl.tsx`](components/sections/GlobeImpl.tsx) (the WebGL globe via `react-globe.gl`). To customize:

- **Accent color** — change `GOLD` / `GOLD_SOFT` at the top of `GlobeImpl.tsx` (and `atmosphereColor`). For the teal "network" look, try `GOLD = "#5eead4"`, `GOLD_SOFT = "#99f6e4"`.
- **Cities & connections** — edit the `CITIES` array and `ARC_PAIRS` (index pairs) in `GlobeImpl.tsx`.
- It auto-rotates and respects `prefers-reduced-motion`.

## Build & deploy (Vercel)

```bash
npm run build      # type-checks + prerenders all pages
npm run start      # serve the production build locally
```

1. Push the repo to GitHub and import it into [Vercel](https://vercel.com/new) (zero config for Next.js).
2. Add the environment variables from `.env.example` in the Vercel project settings.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Deploy.

## Notes

- **Security headers** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`. The CSP uses `'unsafe-inline'` for scripts/styles (Next bootstrap + inline styles); it can be tightened to nonces later.
- **Rate limiting** (`lib/rate-limit.ts`) uses Upstash Redis for global limits + a daily AI-spend cap (`CHAT_DAILY_LIMIT`) when `UPSTASH_*` is set, and falls back to per-instance in-memory otherwise. Both API routes also enforce a same-origin guard.
- **Bot protection**: the contact form uses Cloudflare Turnstile when the `*TURNSTILE*` keys are set (honeypot-only otherwise).
- **`middleware.ts`** drives locale routing. Next 16 prints a notice suggesting the newer `proxy.ts` convention; next-intl currently documents `middleware.ts`, so it's kept as-is.
- The default chat model is `claude-sonnet-4-6` for fast, low-cost replies on a public widget; switch via `ANTHROPIC_MODEL`.

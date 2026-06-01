<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Valora Group — project guide

Marketing site for an AI consultancy. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · next-intl v4 · Anthropic SDK · Resend. See `README.md` for the full overview.

## Commands
- `npm run dev` — local dev (`http://localhost:3000`, redirects to `/en`)
- `npm run build` — production build + type-check (run this to verify changes)
- `npm run lint`

## Conventions
- **Bilingual, always.** Every user-facing string lives in `messages/en.json` AND `messages/es.json`. Keep the two structurally identical (same keys, same array lengths). Never hardcode visible copy in components.
- **Server components by default.** Sections under `components/sections/` are server components using `useTranslations()` from next-intl (works synchronously server-side). Only add `"use client"` for real interactivity — currently just `Header`, `LanguageSwitcher`, `ChatWidget`, `Contact`, and `Reveal`.
- **Design tokens** are Tailwind v4 `@theme` variables at the top of `app/globals.css` (ink canvas, ivory text, champagne-gold accent). Use the token utilities (`bg-canvas`, `text-ink`, `text-muted`, `text-faint`, `text-gold`, `border-line`, …). Don't introduce new colors.
- **Primitives** live in `components/ui/` — reuse `Section`, `Container`, `SectionHeading`, `Eyebrow`, `Reveal`, `Card`, `Button`/`buttonVariants`, and `Icon` (string-named lucide via `lib/icons.tsx`).
- **Links:** use `Link` from `@/i18n/navigation` for internal/cross-page navigation; plain `<a href={`/${locale}#id`}>` for same-page section anchors.
- **Fonts:** `font-display` = Fraunces (headings), default sans = Geist, `font-mono` = Geist Mono (labels).

## Backend
- `app/api/chat/route.ts` — streaming Claude assistant. Knowledge base = `lib/valora-knowledge.ts` (static → prompt-cached; keep it static). Model via `ANTHROPIC_MODEL` (default `claude-sonnet-4-6`).
- `app/api/contact/route.ts` — Zod + honeypot + Resend.
- Both endpoints degrade gracefully when their env keys are absent and are rate-limited via `lib/rate-limit.ts`.

import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  // The two languages the site ships in.
  locales,
  // English is the default; Spanish lives under /es.
  defaultLocale: "en",
  // Always show the locale in the URL (/en, /es) for clean, unambiguous routing + hreflang.
  localePrefix: "always",
});

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every path EXCEPT API routes, Next internals, and files with an
  // extension (images, fonts, etc.). This keeps /api/* free of locale rewrites.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

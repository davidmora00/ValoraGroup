import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware navigation helpers. Use these everywhere instead of next/link
// and next/navigation so the active locale is preserved across the app.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

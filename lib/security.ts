// Same-origin guard + Cloudflare Turnstile verification for the public API routes.

function allowedHosts(): Set<string> {
  const hosts = new Set<string>(["localhost", "127.0.0.1"]);
  const add = (u?: string | null) => {
    if (!u) return;
    try {
      hosts.add(new URL(u.startsWith("http") ? u : `https://${u}`).hostname);
    } catch {
      /* ignore malformed URLs */
    }
  };
  add(process.env.NEXT_PUBLIC_SITE_URL);
  add(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  add(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null,
  );
  return hosts;
}

/**
 * Cheap CSRF/abuse guard: the request's Origin (or Referer) host must be one of
 * our own. Browsers always send Origin on cross-origin POSTs, so this blocks
 * other sites and casual scripts. (Determined server-to-server callers can spoof
 * it — rate limiting + Turnstile are the real backstops.)
 */
export function isAllowedOrigin(req: Request): boolean {
  const raw = req.headers.get("origin") ?? req.headers.get("referer");
  if (!raw) return false;
  let hostname: string;
  try {
    hostname = new URL(raw).hostname;
  } catch {
    return false;
  }
  return allowedHosts().has(hostname);
}

/**
 * Verify a Cloudflare Turnstile token. Returns true (skips verification) when
 * TURNSTILE_SECRET_KEY is not configured, so local dev works without keys.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — skip
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

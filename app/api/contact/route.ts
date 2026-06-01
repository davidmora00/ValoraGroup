import { z } from "zod";
import { Resend } from "resend";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isAllowedOrigin, verifyTurnstile } from "@/lib/security";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  // Honeypot: real users never see/fill this; bots do. Must stay empty.
  website: z.string().max(0).optional().default(""),
  locale: z.enum(["en", "es"]).optional().default("en"),
  turnstileToken: z.string().max(4096).optional(),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  // 1) Same-origin guard.
  if (!isAllowedOrigin(req)) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  // 2) Rate limit (per IP).
  const rl = await rateLimit(getClientIp(req), {
    limit: 5,
    windowMs: 60_000,
    name: "contact-ip",
  });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // 3) Validate.
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 4) Honeypot tripped → silently accept without doing anything.
  if (data.website) return Response.json({ ok: true });

  // 5) Bot protection (skipped automatically if Turnstile isn't configured).
  if (!(await verifyTurnstile(data.turnstileToken, getClientIp(req)))) {
    return Response.json({ ok: false, error: "captcha" }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Valora Group <onboarding@resend.dev>";

  // Not configured (e.g. local dev): capture a PII-redacted note so nothing
  // sensitive hits the logs, and report success so the form UX still works.
  if (!apiKey || !to) {
    console.warn("[contact] not configured — lead received (redacted):", {
      emailDomain: data.email.split("@")[1] ?? "unknown",
      hasCompany: Boolean(data.company),
      messageLength: data.message.length,
      locale: data.locale,
    });
    return Response.json({ ok: true, delivered: false });
  }

  const subject = `New inquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`;
  const lines = [
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Company: ${data.company || "—"}`,
    `Locale:  ${data.locale}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:auto;color:#111">
      <h2 style="margin:0 0 16px;font-size:18px">New inquiry from valoragroup.ai</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:90px">Name</td><td style="padding:6px 0"><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666">Company</td><td style="padding:6px 0">${escapeHtml(data.company) || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Language</td><td style="padding:6px 0">${data.locale}</td></tr>
      </table>
      <p style="margin:16px 0 6px;color:#666;font-size:14px">Message</p>
      <div style="white-space:pre-wrap;background:#f6f5f2;border-radius:10px;padding:14px;font-size:14px;line-height:1.55">${escapeHtml(data.message)}</div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text: lines,
      html,
    });
    if (error) {
      console.error("[contact] Resend send failed");
      return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return Response.json({ ok: true, delivered: true });
  } catch {
    console.error("[contact] unexpected send error");
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/valora-knowledge";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Default to a fast, cost-efficient model for a public chat widget. Swap to
// claude-opus-4-8 via ANTHROPIC_MODEL for maximum quality.
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(24)
    // The Messages API requires the conversation to start with a user turn.
    .refine((m) => m[0]?.role === "user", "First message must be from the user"),
});

export async function POST(req: Request) {
  // 1) Rate limit (per IP).
  const rl = rateLimit(`chat:${getClientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // 2) Not configured yet — let the client show the "offline" message.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "offline" }, { status: 503 });
  }

  // 3) Validate input.
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  // 4) Stream plain-text deltas straight to the browser.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const messageStream = client.messages.stream(
          {
            model: MODEL,
            max_tokens: 1024,
            // Static prefix → cached. Conversation stays volatile in `messages`.
            system: [
              {
                type: "text",
                text: ASSISTANT_SYSTEM_PROMPT,
                cache_control: { type: "ephemeral" },
              },
            ],
            messages: parsed.data.messages,
          },
          { signal: req.signal }, // client disconnect aborts the upstream call
        );

        for await (const event of messageStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        // Client navigated away / aborted — not an error worth surfacing.
        if (req.signal.aborted) {
          try {
            controller.close();
          } catch {}
          return;
        }
        if (err instanceof Anthropic.APIError) {
          console.error(`[chat] Anthropic API error ${err.status}:`, err.message);
        } else {
          console.error("[chat] stream error:", err);
        }
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no", // disable proxy buffering so tokens flush live
    },
  });
}

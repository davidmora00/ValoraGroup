import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "Valora Group — AI that solves everyday business pain points";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tHero = await getTranslations({ locale, namespace: "hero" });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "80px",
          color: "#f6f4ef",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <svg width="46" height="46" viewBox="0 0 24 24">
            <path
              d="M12 1.6 22.4 12 12 22.4 1.6 12Z"
              fill="none"
              stroke="#d8b27a"
              strokeWidth="1.4"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <path d="M6.4 12 12 6.4 17.6 12 12 17.6Z" fill="#d8b27a" />
          </svg>
          <span style={{ fontSize: 34, letterSpacing: -0.5 }}>Valora Group</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <span style={{ fontSize: 66, lineHeight: 1.05, letterSpacing: -2, maxWidth: "960px" }}>
            {tFooter("tagline")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#a7a29b",
            fontSize: 26,
          }}
        >
          <span style={{ width: 48, height: 2, background: "#d8b27a", display: "flex" }} />
          <span>{tHero("eyebrow")}</span>
        </div>
      </div>
    ),
    size,
  );
}

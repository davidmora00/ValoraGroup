import { useTranslations } from "next-intl";

/** A slow, infinite band of capability words — editorial + software signature.
 *  Decorative; CSS-animated (pauses for reduced-motion). */
export function Marquee() {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];
  const loop = [...items, ...items];

  return (
    <div aria-hidden className="relative overflow-hidden border-y border-line/50 py-7 sm:py-8">
      <div className="flex w-max animate-[marquee_55s_linear_infinite] items-center motion-reduce:animate-none">
        {loop.map((word, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap font-display text-2xl text-faint sm:text-3xl"
          >
            <span className="mx-8 inline-block size-1.5 rotate-45 bg-gold/50 sm:mx-14" />
            {word}
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-canvas to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-canvas to-transparent sm:w-32" />
    </div>
  );
}

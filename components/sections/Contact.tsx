"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-gold/60";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("form.validation.name")).max(120),
        email: z
          .string()
          .trim()
          .min(1, t("form.validation.email"))
          .email(t("form.validation.email"))
          .max(200),
        company: z.string().trim().max(160).optional(),
        message: z.string().trim().min(1, t("form.validation.message")).max(4000),
        website: z.string().max(0).optional(), // honeypot
      }),
    [t],
  );

  type Values = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (res.ok && data.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="contact" className="border-t border-line/60">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col gap-4">
                <a
                  href={`mailto:${t("info.email")}`}
                  className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full border border-line text-gold transition-colors group-hover:border-gold/40">
                    <Mail className="size-4" />
                  </span>
                  <span>
                    <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-faint">
                      {t("info.emailLabel")}
                    </span>
                    {t("info.email")}
                  </span>
                </a>
                <p className="text-sm text-faint">{t("info.responseTime")}</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <div className="surface-card rounded-3xl border border-line p-6 sm:p-8">
              {status === "success" ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                  <CheckCircle2 className="size-12 text-gold" strokeWidth={1.4} />
                  <h3 className="mt-5 font-display text-2xl text-ink">{t("form.successTitle")}</h3>
                  <p className="mt-2 max-w-sm text-pretty text-muted">{t("form.success")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  {/* Honeypot — hidden from real users */}
                  <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t("form.name")} error={errors.name?.message}>
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder={t("form.namePlaceholder")}
                        className={cn(fieldClass, errors.name && "border-red-500/50")}
                        {...register("name")}
                      />
                    </Field>
                    <Field label={t("form.email")} error={errors.email?.message}>
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder={t("form.emailPlaceholder")}
                        className={cn(fieldClass, errors.email && "border-red-500/50")}
                        {...register("email")}
                      />
                    </Field>
                  </div>

                  <Field label={t("form.company")} optional>
                    <input
                      type="text"
                      autoComplete="organization"
                      placeholder={t("form.companyPlaceholder")}
                      className={fieldClass}
                      {...register("company")}
                    />
                  </Field>

                  <Field label={t("form.message")} error={errors.message?.message}>
                    <textarea
                      rows={4}
                      placeholder={t("form.messagePlaceholder")}
                      className={cn(fieldClass, "resize-none", errors.message && "border-red-500/50")}
                      {...register("message")}
                    />
                  </Field>

                  {status === "error" ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      <strong className="font-medium">{t("form.errorTitle")}</strong> {t("form.error")}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-medium text-canvas shadow-[0_10px_34px_-14px_rgba(216,178,122,0.65)] transition-all hover:bg-gold-soft disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? t("form.sending") : t("form.submit")}
                    {!isSubmitting && <ArrowRight className="size-4" />}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-red-400">{error}</span> : null}
      {optional && !error ? <span className="sr-only">optional</span> : null}
    </label>
  );
}

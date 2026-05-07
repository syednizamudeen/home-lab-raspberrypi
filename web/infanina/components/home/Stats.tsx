import { useTranslations } from "next-intl";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";

const KEYS = ["shipped", "integrations", "languages", "uptime"] as const;

export default function Stats() {
    const t = useTranslations("Home.stats");

    return (
        <Section tone="muted">
            <div className="grid gap-10 xl:grid-cols-12 xl:gap-16">
                <Reveal className="xl:col-span-4">
                    <Eyebrow>{t("eyebrow")}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[40px]">
                        {t("title")}
                    </h2>
                </Reveal>

                <div className="xl:col-span-8">
                    <dl className="grid gap-px overflow-hidden rounded-[16px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
                        {KEYS.map((key, i) => (
                            <Reveal
                                key={key}
                                delay={i * 80}
                                className="flex min-w-0 flex-col gap-3 bg-[var(--color-surface-1)] px-6 py-7 transition-colors hover:bg-[var(--color-surface-2)]"
                            >
                                <dt className="text-[11px] font-semibold uppercase leading-snug tracking-[0.18em] text-[var(--color-text-muted)]">
                                    {t(`items.${key}.label`)}
                                </dt>
                                <dd className="font-display text-[36px] font-bold leading-[1] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[40px] lg:text-[34px] xl:text-[36px]">
                                    <CountUp value={t(`items.${key}.value`)} />
                                </dd>
                            </Reveal>
                        ))}
                    </dl>
                </div>
            </div>
        </Section>
    );
}

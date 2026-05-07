import { useTranslations } from "next-intl";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";

const KEYS = ["shipped", "integrations", "languages", "uptime"] as const;

export default function Stats() {
    const t = useTranslations("Home.stats");

    return (
        <Section tone="muted">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                    <Eyebrow>{t("eyebrow")}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[40px]">
                        {t("title")}
                    </h2>
                </div>

                <div className="lg:col-span-8">
                    <dl className="grid gap-px overflow-hidden rounded-[16px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
                        {KEYS.map((key) => (
                            <div
                                key={key}
                                className="flex flex-col gap-2 bg-[var(--color-surface-1)] px-6 py-7 transition-colors hover:bg-[var(--color-surface-2)]"
                            >
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                                    {t(`items.${key}.label`)}
                                </dt>
                                <dd className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[44px]">
                                    {t(`items.${key}.value`)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </Section>
    );
}

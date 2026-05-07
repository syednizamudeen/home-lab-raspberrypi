import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const CASES = ["fb_chain", "fintech", "retail"] as const;
const ACCENT = ["bg-[var(--color-brand)]", "bg-[var(--color-coral)]", "bg-[var(--color-attention)]"];

export default function SelectedWork() {
    const t = useTranslations("Home.work");
    const tw = useTranslations("Work.cases");

    return (
        <Section id="work" tone="default">
            <Reveal>
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl">
                        <Eyebrow>{t("eyebrow")}</Eyebrow>
                        <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[44px] lg:text-[52px]">
                            {t("title")}
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                            {t("subtitle")}
                        </p>
                    </div>
                    <Link
                        href="/work"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand)] hover:underline"
                    >
                        {t("cta")} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {CASES.map((slug, i) => {
                    const tags = tw.raw(`${slug}.tags`) as string[];
                    return (
                        <Reveal key={slug} delay={i * 90}>
                            <Link
                                href="/work"
                                className="group relative flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                                data-focus-ring
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 ${ACCENT[i % 3]}`} aria-hidden />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                                    {tw(`${slug}.client`)}
                                </p>
                                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                    {tw(`${slug}.title`)}
                                </h3>
                                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                    {tw(`${slug}.summary`)}
                                </p>
                                <div className="mt-5 flex flex-wrap gap-1.5">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand)]">
                                    Read more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </Link>
                        </Reveal>
                    );
                })}
            </div>
        </Section>
    );
}

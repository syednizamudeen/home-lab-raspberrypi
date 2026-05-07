import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Compass, Layers, GitBranch, Activity } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Card } from "../ui/Card";

const ITEMS = [
    { key: "strategy", icon: Compass, accent: "brand" as const, slug: "strategy" },
    { key: "build", icon: Layers, accent: "coral" as const, slug: "build" },
    { key: "integrate", icon: GitBranch, accent: "attention" as const, slug: "integrate" },
    { key: "support", icon: Activity, accent: "brand" as const, slug: "support" },
];

export default function ServicesOverview() {
    const t = useTranslations("Home.services");
    const ts = useTranslations("Services.items");
    const tc = useTranslations("Common");

    return (
        <Section id="services" tone="muted">
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
                    href="/services"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand)] hover:underline"
                >
                    {t("cta")} <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
                {ITEMS.map(({ key, icon: Icon, accent }) => (
                    <Card key={key} interactive accent={accent} className="flex flex-col gap-5">
                        <div className="flex items-start justify-between">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                <Icon className="h-5 w-5" />
                            </span>
                            <ArrowUpRight className="h-5 w-5 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-brand)]" />
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {ts(`${key}.title`)}
                            </h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                {ts(`${key}.summary`)}
                            </p>
                        </div>
                        <Link
                            href="/services"
                            className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand)] hover:underline"
                        >
                            {tc("learn_more")} <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Card>
                ))}
            </div>
        </Section>
    );
}

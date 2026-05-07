import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { Compass, Layers, GitBranch, Activity, Check, Search, PenTool, Hammer, Rocket } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const SERVICES = [
    { key: "strategy", icon: Compass, accent: "brand" as const },
    { key: "build", icon: Layers, accent: "coral" as const },
    { key: "integrate", icon: GitBranch, accent: "attention" as const },
    { key: "support", icon: Activity, accent: "brand" as const },
];

const PROCESS = [
    { key: "discover", icon: Search },
    { key: "design", icon: PenTool },
    { key: "build", icon: Hammer },
    { key: "ship", icon: Rocket },
] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Services" });
    return buildMetadata({
        locale: safe,
        path: "/services",
        title: t("title"),
        description: t("description"),
        keywords: ["AI development services Singapore", "AI strategy", "custom AI products", "AI integrations"],
    });
}

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Services");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("services") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
                withMesh
            />

            <Section tone="default" className="pt-0">
                <div className="grid gap-5 md:grid-cols-2">
                    {SERVICES.map(({ key, icon: Icon, accent }) => {
                        const deliverables = t.raw(`items.${key}.deliverables`) as string[];
                        return (
                            <Card key={key} accent={accent} interactive className="flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                                        0{SERVICES.findIndex((s) => s.key === key) + 1}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t(`items.${key}.title`)}
                                    </h2>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                        {t(`items.${key}.summary`)}
                                    </p>
                                </div>
                                <ul className="space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                                    {deliverables.map((d) => (
                                        <li key={d} className="flex gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                                            <span>{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            <Section tone="muted">
                <div className="max-w-2xl">
                    <Eyebrow>{t("process.eyebrow")}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[44px] lg:text-[48px]">
                        {t("process.title")}
                    </h2>
                </div>

                <ol className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
                    {PROCESS.map(({ key, icon: Icon }, i) => (
                        <li key={key} className="relative bg-[var(--color-surface-1)] p-7">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <span className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-muted)]">
                                    0{i + 1}
                                </span>
                            </div>
                            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {t(`process.steps.${key}.title`)}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                {t(`process.steps.${key}.desc`)}
                            </p>
                        </li>
                    ))}
                </ol>
            </Section>

            <Section tone="default">
                <div className="rounded-[24px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-10 text-center sm:p-14">
                    <h2 className="font-display text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]">
                        Ready to scope a project?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-secondary)]">
                        Tell us about the workflow you&rsquo;d like AI to take on. We&rsquo;ll come back within one working day.
                    </p>
                    <div className="mt-7 flex justify-center">
                        <Button href="/contact" size="lg">
                            Start a project <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("services"), path: "/services" },
                ])}
            />
        </>
    );
}

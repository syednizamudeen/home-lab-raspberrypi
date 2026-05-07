import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const CASES = ["fb_chain", "fintech", "retail"] as const;
const ACCENT = ["bg-[var(--color-brand)]", "bg-[var(--color-coral)]", "bg-[var(--color-attention)]"];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Work" });
    return buildMetadata({
        locale: safe,
        path: "/work",
        title: t("title"),
        description: t("description"),
        keywords: ["AI case studies Singapore", "AI projects", "AI implementation"],
    });
}

export default async function WorkPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Work");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("work") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
                withMesh
            />

            <Section tone="default" className="pt-0">
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {CASES.map((slug, i) => {
                        const tags = t.raw(`cases.${slug}.tags`) as string[];
                        return (
                            <article
                                key={slug}
                                className="group relative flex flex-col overflow-hidden rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                            >
                                <div className={`absolute inset-x-0 top-0 h-1 ${ACCENT[i % 3]}`} aria-hidden />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                                    {t(`cases.${slug}.client`)}
                                </p>
                                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                    {t(`cases.${slug}.title`)}
                                </h2>
                                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                    {t(`cases.${slug}.summary`)}
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
                            </article>
                        );
                    })}
                </div>
            </Section>

            <Section tone="muted">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-[32px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[40px]">
                        {t("cta.title")}
                    </h2>
                    <p className="mt-4 text-[var(--color-text-secondary)]">{t("cta.subtitle")}</p>
                    <div className="mt-7 flex justify-center">
                        <Button href="/contact" size="lg">
                            {t("cta.primary")} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("work"), path: "/work" },
                ])}
            />
        </>
    );
}

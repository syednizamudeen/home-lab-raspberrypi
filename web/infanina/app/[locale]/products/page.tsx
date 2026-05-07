import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Bot, Workflow, FileSearch, MessageSquareCode, ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const PRODUCTS = [
    { key: "assistant", icon: Bot, accent: "brand" as const },
    { key: "automation", icon: Workflow, accent: "coral" as const },
    { key: "documents", icon: FileSearch, accent: "attention" as const },
    { key: "analytics", icon: MessageSquareCode, accent: "brand" as const },
];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Products" });
    return buildMetadata({
        locale: safe,
        path: "/products",
        title: t("title"),
        description: t("description"),
        keywords: ["AI products for SMEs", "AI assistant", "document intelligence", "conversational analytics"],
    });
}

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Products");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("products") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
                withMesh
            />

            <Section tone="default" className="pt-0">
                <div className="grid gap-5 md:grid-cols-2">
                    {PRODUCTS.map(({ key, icon: Icon, accent }) => {
                        const highlights = t.raw(`items.${key}.highlights`) as string[];
                        return (
                            <Card key={key} accent={accent} interactive className="flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-attention)]/15 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-attention)]">
                                        <Sparkles className="h-3 w-3" /> Productized
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
                                <div className="flex flex-wrap gap-1.5">
                                    {highlights.map((h) => (
                                        <span
                                            key={h}
                                            className="inline-flex items-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)]"
                                        >
                                            {h}
                                        </span>
                                    ))}
                                </div>
                            </Card>
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
                    { name: tNav("products"), path: "/products" },
                ])}
            />
        </>
    );
}

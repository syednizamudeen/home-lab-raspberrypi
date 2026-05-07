import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ShieldCheck, KeyRound, ServerCog } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const PRINCIPLES = [
    { key: "honest", icon: ShieldCheck },
    { key: "owned", icon: KeyRound },
    { key: "production", icon: ServerCog },
] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.About" });
    return buildMetadata({
        locale: safe,
        path: "/about",
        title: t("title"),
        description: t("description"),
        keywords: ["Infanina team", "AI studio Singapore", "AI agency about"],
    });
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("About");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("about") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
                withMesh
            />

            <Section tone="default" className="pt-0">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <Eyebrow>{t("story.eyebrow")}</Eyebrow>
                        <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[40px]">
                            {t("story.title")}
                        </h2>
                    </div>
                    <div className="lg:col-span-7 space-y-5 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                        <p>{t("story.body_1")}</p>
                        <p>{t("story.body_2")}</p>
                    </div>
                </div>
            </Section>

            <Section tone="muted">
                <div className="max-w-2xl">
                    <Eyebrow>{t("principles.eyebrow")}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[44px] lg:text-[48px]">
                        {t("principles.title")}
                    </h2>
                </div>

                <ul className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-3">
                    {PRINCIPLES.map(({ key, icon: Icon }) => (
                        <li key={key} className="bg-[var(--color-surface-1)] p-7">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {t(`principles.items.${key}.title`)}
                            </h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                {t(`principles.items.${key}.desc`)}
                            </p>
                        </li>
                    ))}
                </ul>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("about"), path: "/about" },
                ])}
            />
        </>
    );
}

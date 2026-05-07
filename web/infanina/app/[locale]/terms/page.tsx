import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const SECTIONS = ["use", "ip", "liability", "law"] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Terms" });
    return buildMetadata({
        locale: safe,
        path: "/terms",
        title: t("title"),
        description: t("description"),
    });
}

export default async function TermsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Legal.Terms");
    const tNav = await getTranslations("Navigation");
    const tFooter = await getTranslations("Footer");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tFooter("terms_link") }]} />
            <PageHero eyebrow={t("updated")} title={t("title")} subtitle={t("intro")} />

            <Section tone="default" className="pt-0">
                <div className="mx-auto max-w-3xl space-y-10">
                    {SECTIONS.map((key) => (
                        <section key={key}>
                            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {t(`sections.${key}_title`)}
                            </h2>
                            <p className="mt-3 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                                {t(`sections.${key}_body`)}
                            </p>
                        </section>
                    ))}
                </div>
            </Section>
        </>
    );
}

import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/page/JsonLd";
import Capabilities from "@/components/home/Capabilities";
import Automation from "@/components/home/Automation";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WorldCut } from "@/components/ui/WorldCut";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const ENGAGEMENTS = ["sprint", "build", "care"] as const;

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
    const t = await getTranslations("ServicesPage");
    const nav = await getTranslations("Navigation");

    return (
        <>
            <PageHero
                breadcrumb={[{ label: nav("home"), href: "/" }, { label: nav("services") }]}
                title={t("title")}
                lead={t("lead")}
            />

            <Capabilities />

            <Section rhythm="normal">
                <h2 className="t-h2 max-w-[18ch]">{t("engagements_title")}</h2>
                <ul className="rule-list mt-12 border-y border-[var(--hairline)]">
                    {ENGAGEMENTS.map((key, i) => (
                        <Reveal key={key} index={i} as="li" className="grid gap-4 py-9 lg:grid-cols-12 lg:gap-8">
                            <div className="lg:col-span-4">
                                <h3 className="t-h3">{t(`engagements.${key}.title`)}</h3>
                                <p className="t-meta mt-2 text-[var(--on-surface-3)]">
                                    {t(`engagements.${key}.shape`)}
                                </p>
                            </div>
                            <p className="t-body text-[var(--on-surface-2)] lg:col-span-8">
                                {t(`engagements.${key}.body`)}
                            </p>
                        </Reveal>
                    ))}
                </ul>
                <Reveal className="mt-10">
                    <p className="t-body text-[0.875rem] text-[var(--on-surface-3)]">{t("pricing_note")}</p>
                </Reveal>
            </Section>

            <WorldCut />
            <Automation />

            <Section world="void" rhythm="tight">
                <Reveal className="flex flex-col items-start gap-6">
                    <h2 className="t-display-l max-w-[14ch]">{t("cta_title")}</h2>
                    <ButtonLink href="/contact" size="lg">
                        {t("cta")}
                    </ButtonLink>
                </Reveal>
            </Section>

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: "Home", path: "/" },
                        { name: "Services", path: "/services" },
                    ]),
                ]}
            />
        </>
    );
}

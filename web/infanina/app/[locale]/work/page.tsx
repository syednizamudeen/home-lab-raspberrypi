import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/page/JsonLd";
import WorkIndex from "@/components/home/WorkIndex";
import { WorldCut } from "@/components/ui/WorldCut";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

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
    const t = await getTranslations("WorkPage");
    const nav = await getTranslations("Navigation");

    return (
        <>
            <PageHero
                breadcrumb={[{ label: nav("home"), href: "/" }, { label: nav("work") }]}
                title={t("title")}
                lead={t("lead")}
            />

            <WorldCut />
            <WorkIndex />

            <Section world="void" rhythm="tight">
                <Reveal className="flex flex-col items-start gap-6 border-t border-[var(--hairline)] pt-12">
                    <h2 className="t-h2 max-w-[20ch]">{t("cta_title")}</h2>
                    <p className="t-body text-[var(--on-surface-2)]">{t("cta_body")}</p>
                    <ButtonLink href="/contact" size="lg">
                        {t("cta")}
                    </ButtonLink>
                </Reveal>
            </Section>

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: "Home", path: "/" },
                        { name: "Work", path: "/work" },
                    ]),
                ]}
            />
        </>
    );
}

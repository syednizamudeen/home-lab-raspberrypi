import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/page/JsonLd";
import { LegalDoc, type LegalSection } from "@/components/page/LegalDoc";
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
    const t = await getTranslations("Terms");
    const nav = await getTranslations("Navigation");
    const sections = t.raw("sections") as LegalSection[];

    return (
        <>
            <PageHero
                breadcrumb={[{ label: nav("home"), href: "/" }, { label: nav("terms") }]}
                title={t("title")}
                lead={t("lead")}
            />
            <LegalDoc
                sections={sections}
                updated={t("updated")}
                updatedLabel={t("updated_label")}
                indexLabel={t("index_label")}
            />
            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: "Home", path: "/" },
                        { name: "Terms", path: "/terms" },
                    ]),
                ]}
            />
        </>
    );
}

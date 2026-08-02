import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/page/JsonLd";
import Connect from "@/components/home/Connect";
import { WorldCut } from "@/components/ui/WorldCut";
import { SingaporeClock } from "@/components/ui/SingaporeClock";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE, type Locale } from "@/lib/site";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Contact" });
    return buildMetadata({
        locale: safe,
        path: "/contact",
        title: t("title"),
        description: t("description"),
    });
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);
    const t = await getTranslations("ContactPage");
    const nav = await getTranslations("Navigation");

    return (
        <>
            <PageHero
                breadcrumb={[{ label: nav("home"), href: "/" }, { label: nav("contact") }]}
                title={t("title")}
                lead={t("lead")}
                aside={
                    <dl className="rule-list border-t border-[var(--hairline)]">
                        <div className="flex items-baseline justify-between gap-6 py-4">
                            <dt className="t-meta text-[var(--on-surface-3)]">{t("local_time")}</dt>
                            <dd className="font-mono text-[0.8125rem] text-[var(--on-surface)]">
                                <SingaporeClock />
                            </dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-6 py-4">
                            <dt className="t-meta text-[var(--on-surface-3)]">{t("hours")}</dt>
                            <dd className="text-end font-mono text-[0.8125rem] text-[var(--on-surface)]">
                                {SITE.hours}
                            </dd>
                        </div>
                    </dl>
                }
            />

            <WorldCut />
            <Connect />

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: "Home", path: "/" },
                        { name: "Contact", path: "/contact" },
                    ]),
                ]}
            />
        </>
    );
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Capabilities from "@/components/home/Capabilities";
import WorkIndex from "@/components/home/WorkIndex";
import Automation from "@/components/home/Automation";
import Connect from "@/components/home/Connect";
import { WorldCut } from "@/components/ui/WorldCut";
import { JsonLd } from "@/components/page/JsonLd";
import { routing } from "@/i18n/routing";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);
    const t = await getTranslations("Home");

    return (
        <>
            {/* Paper: who we are. */}
            <Hero />
            <About />
            <Capabilities />

            {/* Void: what we ship. */}
            <WorldCut label={t("cut_label")} />
            <WorkIndex />
            <Automation />
            <Connect />

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [{ name: "Home", path: "/" }]),
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        url: `https://infanina.com/${safe}`,
                        name: "Infanina",
                        inLanguage: safe,
                    },
                ]}
            />
        </>
    );
}

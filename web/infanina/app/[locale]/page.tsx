import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import ServicesOverview from "@/components/home/ServicesOverview";
import AIShowcase from "@/components/home/AIShowcase";
import Stats from "@/components/home/Stats";
import SelectedWork from "@/components/home/SelectedWork";
import CTABand from "@/components/home/CTABand";
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

    return (
        <>
            <Hero />
            <ValueProps />
            <ServicesOverview />
            <AIShowcase />
            <Stats />
            <SelectedWork />
            <CTABand />

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

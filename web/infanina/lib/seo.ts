import type { Metadata } from "next";
import { SITE, type Locale } from "./site";

const OG_LOCALE_MAP: Record<Locale, string> = {
    en: "en_US",
    ms: "ms_MY",
    zh: "zh_CN",
    ta: "ta_IN",
    ar: "ar_AE",
};

interface BuildMetadataInput {
    locale: Locale;
    path?: string;
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    type?: "website" | "article";
}

/**
 * Build a per-page Metadata object with locale-aware canonical + hreflang alternates.
 * Title is composed as `<title> · Infanina` unless it already contains the brand.
 */
export function buildMetadata({
    locale,
    path = "",
    title,
    description,
    keywords,
    ogImage = "/og-default",
    type = "website",
}: BuildMetadataInput): Metadata {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    const localePath = `/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
    const canonical = `${SITE.url}${localePath}`;

    const fullTitle = title.includes(SITE.name) ? title : `${title} · ${SITE.name}`;

    const languageAlternates = Object.fromEntries(
        SITE.locales.map((l) => [l, `${SITE.url}/${l}${cleanPath ? `/${cleanPath}` : ""}`]),
    );

    return {
        metadataBase: new URL(SITE.url),
        title: fullTitle,
        description,
        keywords,
        alternates: {
            canonical,
            languages: {
                ...languageAlternates,
                "x-default": `${SITE.url}/${SITE.defaultLocale}${cleanPath ? `/${cleanPath}` : ""}`,
            },
        },
        openGraph: {
            type,
            url: canonical,
            siteName: SITE.name,
            title: fullTitle,
            description,
            locale: OG_LOCALE_MAP[locale],
            alternateLocale: SITE.locales.filter((l) => l !== locale).map((l) => OG_LOCALE_MAP[l]),
            images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

/**
 * Organization JSON-LD shape used on the home page.
 */
export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.legalName,
        alternateName: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/logo.png`,
        description: SITE.description,
        email: SITE.email,
        address: {
            "@type": "PostalAddress",
            addressLocality: SITE.address.locality,
            addressCountry: SITE.address.country,
        },
        sameAs: Object.values(SITE.socials),
    };
}

/**
 * BreadcrumbList JSON-LD for interior pages.
 * Items are passed in display order; we generate the @id URLs from locale + path segments.
 */
export function breadcrumbJsonLd(locale: Locale, items: Array<{ name: string; path: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE.url}/${locale}${item.path === "/" ? "" : item.path}`,
        })),
    };
}

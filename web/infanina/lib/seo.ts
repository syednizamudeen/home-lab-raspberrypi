import type { Metadata } from "next";
import { SITE, activeSocials, isPlaceholder, type Locale } from "./site";

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
        authors: [{ name: SITE.name, url: SITE.url }],
        publisher: SITE.name,
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
        /* No explicit index/follow: that is already the default, and stating it
           collides with the automatic `noindex` Next emits on the not-found
           boundary, leaving two contradictory robots tags on every 404. Only the
           directives that actually change behaviour are declared. */
        robots: {
            "max-image-preview": "large",
            "max-snippet": -1,
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
        name: isPlaceholder(SITE.legalName) ? SITE.name : SITE.legalName,
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
        /* Only publish identifiers that have been confirmed. A placeholder in
           structured data is worse than an omission. */
        ...(isPlaceholder(SITE.uen) ? {} : { identifier: SITE.uen }),
        ...(isPlaceholder(SITE.phone) ? {} : { telephone: SITE.phone }),
        sameAs: activeSocials().map((s) => s.href),
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

export interface CaseStudyJsonLdInput {
    locale: Locale;
    slug: string;
    title: string;
    summary: string;
    client: string;
    publishedAt: string;
}

export function caseStudyJsonLd({
    locale,
    slug,
    title,
    summary,
    client,
    publishedAt,
}: CaseStudyJsonLdInput) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        url: `${SITE.url}/${locale}/work/${slug}`,
        name: title,
        headline: title,
        description: summary,
        author: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
        },
        publisher: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
        },
        about: client,
        inLanguage: locale,
        datePublished: publishedAt,
    };
}

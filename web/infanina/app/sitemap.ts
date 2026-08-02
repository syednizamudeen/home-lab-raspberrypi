import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { projects } from "@/lib/projects";

const ROUTES = ["", "/services", "/work", "/about", "/contact", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const pageRoutes: MetadataRoute.Sitemap = ROUTES.flatMap((route) =>
        SITE.locales.map((locale) => ({
            url: `${SITE.url}/${locale}${route}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: route === "" ? 1.0 : route === "/contact" ? 0.9 : 0.7,
            alternates: {
                languages: Object.fromEntries(
                    SITE.locales.map((l) => [l, `${SITE.url}/${l}${route}`]),
                ),
            },
        })),
    );

    const caseRoutes: MetadataRoute.Sitemap = projects.flatMap((c) =>
        SITE.locales.map((locale) => ({
            url: `${SITE.url}/${locale}/work/${c.slug}`,
            lastModified: now,
            changeFrequency: "yearly" as const,
            priority: 0.6,
            alternates: {
                languages: Object.fromEntries(
                    SITE.locales.map((l) => [l, `${SITE.url}/${l}/work/${c.slug}`]),
                ),
            },
        })),
    );

    return [...pageRoutes, ...caseRoutes];
}

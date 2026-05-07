import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROUTES = ["", "/services", "/products", "/work", "/about", "/contact", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return ROUTES.flatMap((route) =>
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
}

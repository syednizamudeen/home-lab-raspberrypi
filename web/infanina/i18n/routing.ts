import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
    locales: ["en", "ms", "zh", "ta", "ar"],
    defaultLocale: "en",
    pathnames: {
        "/": "/",
        "/services": "/services",
        "/work": "/work",
        "/work/[slug]": "/work/[slug]",
        "/about": "/about",
        "/contact": "/contact",
        "/privacy": "/privacy",
        "/terms": "/terms",
    },
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

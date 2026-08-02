/**
 * Single source of truth for every business fact on the site.
 *
 * ─────────────────────────────────────────────────────────────
 *  BEFORE GOING LIVE: replace every value marked TODO_REPLACE.
 *  Anything still holding a placeholder renders visibly as
 *  "[ to be confirmed ]" rather than as a plausible-looking lie.
 * ─────────────────────────────────────────────────────────────
 */

export const PLACEHOLDER = "TODO_REPLACE" as const;

/** True when a config value has not been filled in yet. */
export function isPlaceholder(value: string): boolean {
    return value.startsWith(PLACEHOLDER);
}

/** Render helper: never print a raw TODO token to a visitor. */
export function display(value: string): string {
    return isPlaceholder(value) ? "[ to be confirmed ]" : value;
}

export const SITE = {
    name: "Infanina",
    legalName: `${PLACEHOLDER}: Infanina Pte. Ltd.`,
    /** ACRA Unique Entity Number. Printed in the footer and used in JSON-LD. */
    uen: `${PLACEHOLDER}: 20XXXXXXXG`,
    incorporated: `${PLACEHOLDER}: 2025`,

    tagline: "Software, built in Singapore.",
    description:
        "Infanina is a Singapore-registered software studio. We build web platforms, mobile apps, and AI automation for the manual work inside a business.",

    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanina.com",

    email: "hello@infanina.com",
    /** E.164, used for the tel: link. */
    phone: `${PLACEHOLDER}: +6580000000`,
    /** Human-formatted, used for display. */
    phoneDisplay: `${PLACEHOLDER}: +65 8000 0000`,
    /** Digits only, no plus sign — wa.me format. */
    whatsapp: `${PLACEHOLDER}: 6580000000`,

    address: {
        line1: `${PLACEHOLDER}: 1 Example Road, #01-01`,
        postalCode: `${PLACEHOLDER}: 000000`,
        locality: "Singapore",
        country: "SG",
    },

    /** Shown beside the live Singapore clock. */
    hours: "Mon–Fri, 9am–6pm SGT",
    responseWindow: "Replies within 1 business day",

    socials: {
        linkedin: `${PLACEHOLDER}: https://www.linkedin.com/company/infanina`,
        instagram: `${PLACEHOLDER}: https://www.instagram.com/infanina`,
        github: `${PLACEHOLDER}: https://github.com/infanina`,
    },

    locales: ["en", "ms", "zh", "ta", "ar"] as const,
    defaultLocale: "en" as const,
} as const;

export type Locale = (typeof SITE.locales)[number];

/** wa.me deep link with a prefilled first message. Null while unconfigured. */
export function whatsappLink(message: string): string | null {
    if (isPlaceholder(SITE.whatsapp)) return null;
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string | null {
    return isPlaceholder(SITE.phone) ? null : `tel:${SITE.phone}`;
}

/** Socials that have been filled in, in display order. */
export function activeSocials(): { key: string; label: string; href: string }[] {
    const labels: Record<string, string> = {
        linkedin: "LinkedIn",
        instagram: "Instagram",
        github: "GitHub",
    };
    return Object.entries(SITE.socials)
        .filter(([, href]) => !isPlaceholder(href))
        .map(([key, href]) => ({ key, label: labels[key] ?? key, href }));
}

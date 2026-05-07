export const SITE = {
    name: "Infanina",
    legalName: "Infanina Pte Ltd",
    tagline: "AI products that ship.",
    description:
        "Infanina is a Singapore-based AI product studio. We design, build and support custom AI products, agents and integrations for SMEs and growing businesses.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://infanina.com",
    email: "hello@infanina.com",
    phone: "+65 0000 0000",
    address: {
        locality: "Singapore",
        country: "SG",
    },
    socials: {
        linkedin: "https://www.linkedin.com/company/infanina",
        github: "https://github.com/infanina",
    },
    locales: ["en", "ms", "zh", "ta", "ar"] as const,
    defaultLocale: "en" as const,
} as const;

export type Locale = (typeof SITE.locales)[number];

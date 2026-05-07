import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    display: "swap",
    weight: ["500", "600", "700"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
        { media: "(prefers-color-scheme: dark)", color: "#0A1220" },
    ],
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safeLocale = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safeLocale, namespace: "Meta.Home" });

    return buildMetadata({
        locale: safeLocale,
        path: "",
        title: t("title"),
        description: t("description"),
        keywords: [
            "AI product studio Singapore",
            "AI development Singapore",
            "custom AI agents",
            "AI integrations for SMEs",
            "Infanina",
        ],
    });
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);

    const messages = await getMessages();
    const orgLd = organizationJsonLd();

    return (
        <html
            lang={locale}
            dir={locale === "ar" ? "rtl" : "ltr"}
            suppressHydrationWarning
            className={`${spaceGrotesk.variable} ${inter.variable}`}
        >
            <body className="antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-md focus:bg-[var(--color-brand)] focus:text-white"
                >
                    Skip to content
                </a>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <Header />
                        <main id="main" className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                </NextIntlClientProvider>
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
                />
            </body>
        </html>
    );
}

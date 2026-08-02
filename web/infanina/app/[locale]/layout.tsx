import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, Martian_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { routing } from "@/i18n/routing";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

/* Display + wordmark. The wdth axis carries the industrial-grotesque widening
   used on the hero line and the footer wordmark. */
const archivo = Archivo({
    variable: "--font-archivo",
    subsets: ["latin"],
    display: "swap",
    axes: ["wdth"],
});

const publicSans = Public_Sans({
    variable: "--font-public-sans",
    subsets: ["latin"],
    display: "swap",
});

const martianMono = Martian_Mono({
    variable: "--font-martian-mono",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
    /* Fixed art direction: the page opens on paper regardless of system theme. */
    themeColor: "#F5F2EB",
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
            className={`${archivo.variable} ${publicSans.variable} ${martianMono.variable}`}
        >
            <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-100 focus:rounded-[6px] focus:bg-acid focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.08em] focus:text-ink focus:uppercase"
                >
                    Skip to content
                </a>
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    <main id="main" className="flex-grow">
                        {children}
                    </main>
                    <Footer />
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

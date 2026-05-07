import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE, type Locale } from "@/lib/site";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Contact" });
    return buildMetadata({
        locale: safe,
        path: "/contact",
        title: t("title"),
        description: t("description"),
        keywords: ["contact AI agency Singapore", "AI consultation", "Infanina contact"],
    });
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Contact");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("contact") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
            />

            <Section tone="default" className="pt-0">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-7 shadow-[var(--shadow-sm)] sm:p-9">
                            <ContactForm fallbackEmail={SITE.email} />
                        </div>
                    </div>

                    <aside className="lg:col-span-5">
                        <ul className="space-y-7">
                            <li>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <h2 className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t("side.email_title")}
                                    </h2>
                                </div>
                                <p className="mt-2 ms-[52px]">
                                    <a className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)]" href={`mailto:${SITE.email}`}>
                                        {SITE.email}
                                    </a>
                                </p>
                            </li>
                            <li>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                        <MapPin className="h-4 w-4" />
                                    </span>
                                    <h2 className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t("side.address_title")}
                                    </h2>
                                </div>
                                <p className="mt-2 ms-[52px] text-[var(--color-text-secondary)]">
                                    {t("side.address_value")}
                                </p>
                            </li>
                            <li>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                        <Clock className="h-4 w-4" />
                                    </span>
                                    <h2 className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t("side.hours_title")}
                                    </h2>
                                </div>
                                <p className="mt-2 ms-[52px] text-[var(--color-text-secondary)]">
                                    {t("side.hours_value")}
                                </p>
                            </li>
                        </ul>
                    </aside>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("contact"), path: "/contact" },
                ])}
            />
        </>
    );
}

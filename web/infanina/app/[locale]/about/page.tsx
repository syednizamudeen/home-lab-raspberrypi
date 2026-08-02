import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/page/JsonLd";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WorldCut } from "@/components/ui/WorldCut";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE, display, type Locale } from "@/lib/site";

const PRINCIPLES = ["scope", "senior", "handover"] as const;
const HOW = ["week_zero", "weekly", "handover_step", "after"] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.About" });
    return buildMetadata({
        locale: safe,
        path: "/about",
        title: t("title"),
        description: t("description"),
    });
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);
    const t = await getTranslations("AboutPage");
    const nav = await getTranslations("Navigation");

    return (
        <>
            <PageHero
                breadcrumb={[{ label: nav("home"), href: "/" }, { label: nav("about") }]}
                title={t("title")}
                lead={t("lead")}
                aside={
                    <dl className="rule-list border-t border-[var(--hairline)]">
                        {[
                            { term: t("facts.registered"), value: display(SITE.uen) },
                            { term: t("facts.since"), value: display(SITE.incorporated) },
                            { term: t("facts.based"), value: "Singapore" },
                        ].map((row) => (
                            <div key={row.term} className="flex items-baseline justify-between gap-6 py-4">
                                <dt className="t-meta text-[var(--on-surface-3)]">{row.term}</dt>
                                <dd className="tnum font-mono text-[0.8125rem] text-[var(--on-surface)]">{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                }
            />

            <Section rhythm="normal">
                <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
                    <Reveal className="lg:col-span-7">
                        <div className="space-y-6">
                            <p className="t-body text-[var(--on-surface)]">{t("story_1")}</p>
                            <p className="t-body text-[var(--on-surface-2)]">{t("story_2")}</p>
                            <p className="t-body text-[var(--on-surface-2)]">{t("story_3")}</p>
                        </div>
                    </Reveal>

                    <div className="lg:col-span-5">
                        <h2 className="t-meta text-[var(--on-surface-3)]">{t("principles_title")}</h2>
                        <ul className="rule-list mt-5 border-t border-[var(--hairline)]">
                            {PRINCIPLES.map((key, i) => (
                                <Reveal key={key} index={i} as="li" className="block py-5">
                                    <h3 className="t-h3">{t(`principles.${key}.title`)}</h3>
                                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--on-surface-2)]">
                                        {t(`principles.${key}.body`)}
                                    </p>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            <WorldCut />

            <Section world="void" rhythm="normal">
                <SectionHead index="—" label={t("how_label")} title={t("how_title")} />
                <ol className="rule-list border-y border-[var(--hairline)]">
                    {HOW.map((key, i) => (
                        <Reveal key={key} index={i} as="li" className="grid gap-3 py-8 lg:grid-cols-12 lg:gap-8">
                            <span className="t-meta tnum text-[var(--accent-text)] lg:col-span-2">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="t-h3 lg:col-span-4">{t(`how.${key}.title`)}</h3>
                            <p className="t-body text-[var(--on-surface-2)] lg:col-span-6">{t(`how.${key}.body`)}</p>
                        </Reveal>
                    ))}
                </ol>

                <Reveal className="mt-14">
                    <ButtonLink href="/contact" size="lg">
                        {t("cta")}
                    </ButtonLink>
                </Reveal>
            </Section>

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: "Home", path: "/" },
                        { name: "About", path: "/about" },
                    ]),
                ]}
            />
        </>
    );
}

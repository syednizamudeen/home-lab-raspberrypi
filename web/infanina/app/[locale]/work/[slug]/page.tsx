import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/page/PageHero";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WorldCut } from "@/components/ui/WorldCut";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { DISCIPLINE_LABEL, getProject, getRelated, projects } from "@/lib/projects";
import type { Locale } from "@/lib/site";

export function generateStaticParams() {
    const out: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        for (const p of projects) out.push({ locale, slug: p.slug });
    }
    return out;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const project = getProject(slug);
    if (!project) return {};

    const t = await getTranslations({ locale: safe, namespace: `Work.projects.${project.i18nKey}` });
    return buildMetadata({
        locale: safe,
        path: `/work/${slug}`,
        title: t("title"),
        description: t("summary"),
        type: "article",
    });
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const project = getProject(slug);
    if (!project) notFound();

    const t = await getTranslations(`Work.projects.${project.i18nKey}`);
    const w = await getTranslations("Work");
    const nav = await getTranslations("Navigation");
    const related = getRelated(slug);

    return (
        <>
            <PageHero
                breadcrumb={[
                    { label: nav("home"), href: "/" },
                    { label: nav("work"), href: "/work" },
                    { label: t("title") },
                ]}
                title={t("title")}
                lead={t("summary")}
                aside={
                    <dl className="rule-list border-t border-[var(--hairline)]">
                        {[
                            { term: w("meta.discipline"), value: DISCIPLINE_LABEL[project.discipline] },
                            { term: w("meta.timeline"), value: project.timeline },
                            {
                                term: w("meta.status"),
                                value: project.status === "published" ? w("meta.status_live") : w("meta.status_shape"),
                            },
                        ].map((row) => (
                            <div key={row.term} className="flex items-baseline justify-between gap-6 py-4">
                                <dt className="t-meta text-[var(--on-surface-3)]">{row.term}</dt>
                                <dd className="font-mono text-[0.8125rem] text-[var(--on-surface)]">{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                }
            />

            {/* An honest label. This page describes a build we do, not a delivery we are claiming. */}
            {project.status === "template" && (
                <div className="world-paper">
                    <div className="shell">
                        <p className="t-meta border-t-2 border-acid py-4 text-[var(--on-surface-2)]">
                            {w("template_notice")}
                        </p>
                    </div>
                </div>
            )}

            <Section rhythm="normal">
                <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
                    <Reveal className="lg:col-span-7">
                        <h2 className="t-meta text-[var(--on-surface-3)]">{w("sections.problem")}</h2>
                        <p className="t-body mt-5 text-[var(--on-surface)]">{t("problem")}</p>

                        <h2 className="t-meta mt-14 text-[var(--on-surface-3)]">{w("sections.approach")}</h2>
                        <p className="t-body mt-5 text-[var(--on-surface-2)]">{t("approach")}</p>
                    </Reveal>

                    <div className="lg:col-span-5">
                        <h2 className="t-meta text-[var(--on-surface-3)]">{w("sections.scope")}</h2>
                        <ul className="rule-list mt-5 border-t border-[var(--hairline)]">
                            {Array.from({ length: project.scopeCount }).map((_, i) => (
                                <Reveal key={i} index={i} as="li" className="block py-4">
                                    <span className="flex gap-3 text-[0.9375rem] leading-relaxed text-[var(--on-surface)]">
                                        <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-acid" />
                                        {t(`scope.${i}`)}
                                    </span>
                                </Reveal>
                            ))}
                        </ul>

                        <h2 className="t-meta mt-12 text-[var(--on-surface-3)]">{w("sections.stack")}</h2>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {project.stack.map((s) => (
                                <li
                                    key={s}
                                    className="t-meta rounded-pill border border-[var(--hairline)] px-3 py-1.5 text-[var(--on-surface-2)]"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            <WorldCut />

            <Section world="void" rhythm="normal">
                <div className="flex flex-col items-start gap-6">
                    <h2 className="t-display-l max-w-[16ch]">{w("detail_cta_title")}</h2>
                    <ButtonLink href="/contact" size="lg">
                        {w("detail_cta")}
                    </ButtonLink>
                </div>

                {related.length > 0 && (
                    <div className="mt-20">
                        <h3 className="t-meta text-[var(--on-surface-3)]">{w("related")}</h3>
                        <ul className="rule-list mt-5 border-t border-[var(--hairline)]">
                            {related.map((r) => (
                                <li key={r.slug}>
                                    <Link
                                        href={{ pathname: "/work/[slug]", params: { slug: r.slug } }}
                                        className="group flex items-baseline justify-between gap-6 py-6 transition-colors duration-[180ms] hover:bg-[var(--surface-raised)]"
                                    >
                                        <span className="t-h3">{w(`projects.${r.i18nKey}.title`)}</span>
                                        <span
                                            aria-hidden
                                            className="t-meta text-acid opacity-0 transition-opacity duration-[180ms] group-hover:opacity-100 rtl:rotate-180"
                                        >
                                            →
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Section>

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: "Home", path: "/" },
                        { name: "Work", path: "/work" },
                        { name: project.slug, path: `/work/${project.slug}` },
                    ]),
                ]}
            />
        </>
    );
}

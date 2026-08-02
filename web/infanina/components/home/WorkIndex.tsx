import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Section, SectionHead } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { DISCIPLINE_LABEL, RESERVED_SLOTS, projects } from "@/lib/projects";

/**
 * Section 04, first in the void world. An index of rows, not a grid of tiles:
 * a row can hold a real sentence and reads as a list of work rather than a
 * brochure. The reserved rows at the bottom are deliberate; an honest gap is
 * better proof of method than an invented case study.
 */
export default function WorkIndex() {
    const t = useTranslations("Work");

    return (
        <Section id="work" world="void" rhythm="normal">
            <SectionHead index="04" label={t("label")} title={t("title")} lead={t("lead")} />

            <ul className="rule-list border-y border-[var(--hairline)]">
                {projects.map((project, i) => (
                    <li key={project.slug}>
                        <Reveal index={i}>
                            <Link
                                href={{ pathname: "/work/[slug]", params: { slug: project.slug } }}
                                className="group grid items-baseline gap-3 py-8 transition-colors duration-[180ms] hover:bg-[var(--surface-raised)] sm:py-10 lg:grid-cols-12 lg:gap-8 lg:px-4 lg:-mx-4"
                            >
                                <span className="t-meta tnum text-[var(--on-surface-3)] lg:col-span-1">
                                    {project.index}
                                </span>

                                <span className="t-h2 block lg:col-span-6">
                                    {t(`projects.${project.i18nKey}.title`)}
                                </span>

                                <span className="t-meta text-[var(--on-surface-3)] lg:col-span-3">
                                    {DISCIPLINE_LABEL[project.discipline]}
                                </span>

                                <span className="t-meta flex items-center justify-between gap-4 text-[var(--on-surface-3)] lg:col-span-2 lg:justify-end">
                                    {project.timeline}
                                    <span
                                        aria-hidden
                                        className="text-acid opacity-0 transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                    >
                                        →
                                    </span>
                                </span>
                            </Link>
                        </Reveal>
                    </li>
                ))}

                {Array.from({ length: RESERVED_SLOTS }).map((_, i) => (
                    <li key={`reserved-${i}`}>
                        <Reveal index={projects.length + i}>
                            <div className="grid items-baseline gap-3 py-8 sm:py-10 lg:grid-cols-12 lg:gap-8">
                                <span className="t-meta tnum text-[var(--on-surface-3)] opacity-50 lg:col-span-1">
                                    {String(projects.length + i + 1).padStart(2, "0")}
                                </span>
                                <span className="t-h2 block text-[var(--on-surface-3)] opacity-60 lg:col-span-6">
                                    {t("reserved")}
                                </span>
                                <span className="t-meta text-[var(--on-surface-3)] opacity-60 lg:col-span-5 lg:text-end">
                                    {t("reserved_note")}
                                </span>
                            </div>
                        </Reveal>
                    </li>
                ))}
            </ul>

            <Reveal className="mt-8">
                <p className="t-body text-[var(--on-surface-2)]">{t("disclosure")}</p>
            </Reveal>
        </Section>
    );
}

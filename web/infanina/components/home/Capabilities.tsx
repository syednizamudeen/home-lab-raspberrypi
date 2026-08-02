import { useTranslations } from "next-intl";
import { Section, SectionHead } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

const ITEMS = [
    { key: "web", index: "01", stack: ["Next.js", "TypeScript", "Postgres", "Stripe"] },
    { key: "mobile", index: "02", stack: ["React Native", "Swift", "Kotlin", "App Store + Play"] },
    { key: "ai", index: "03", stack: ["Claude", "RAG", "Workflow orchestration", "Human handoff"] },
] as const;

/**
 * Section 03a. Three disciplines as full-width rows rather than three identical
 * cards: the row is wide enough to hold a real sentence, and the mono stack line
 * tells a technical reader what they actually get.
 */
export default function Capabilities() {
    const t = useTranslations("Capabilities");

    return (
        <Section id="services" rhythm="tight">
            <SectionHead index="03" label={t("label")} title={t("title")} lead={t("lead")} />

            <ul className="rule-list border-y border-[var(--hairline)]">
                {ITEMS.map((item, i) => (
                    <li key={item.key}>
                        <Reveal index={i} className="grid gap-4 py-10 sm:py-12 lg:grid-cols-12 lg:gap-8">
                            <div className="lg:col-span-4">
                                <span className="t-meta tnum text-[var(--accent-text)]">{item.index}</span>
                                <h3 className="t-h2 mt-3">{t(`items.${item.key}.title`)}</h3>
                            </div>

                            <div className="lg:col-span-6">
                                <p className="t-body text-[var(--on-surface-2)]">{t(`items.${item.key}.body`)}</p>
                            </div>

                            <div className="lg:col-span-2">
                                <ul className="flex flex-wrap gap-x-3 gap-y-2 lg:flex-col lg:gap-2">
                                    {item.stack.map((s) => (
                                        <li key={s} className="t-meta text-[var(--on-surface-3)]">
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

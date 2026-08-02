import { useTranslations } from "next-intl";
import { Section, SectionHead } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * Section 02. Who the company is. Asymmetric: the statement holds the left,
 * the operating facts sit right in a hairline list. No cards, no icons.
 */
export default function About() {
    const t = useTranslations("About");
    const facts = ["ownership", "team", "engagement", "stack"] as const;

    return (
        <Section id="about" rhythm="normal">
            <SectionHead index="02" label={t("label")} title={t("title")} />

            <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                    <Reveal className="space-y-6">
                        <p className="t-body text-[var(--on-surface)]">{t("body_1")}</p>
                        <p className="t-body text-[var(--on-surface-2)]">{t("body_2")}</p>
                    </Reveal>
                </div>

                <div className="lg:col-span-5">
                    <dl className="rule-list border-t border-[var(--hairline)]">
                        {facts.map((key, i) => (
                            <Reveal key={key} index={i} className="py-5">
                                <dt className="t-meta text-[var(--on-surface-3)]">{t(`facts.${key}.term`)}</dt>
                                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--on-surface)]">
                                    {t(`facts.${key}.value`)}
                                </dd>
                            </Reveal>
                        ))}
                    </dl>
                </div>
            </div>
        </Section>
    );
}

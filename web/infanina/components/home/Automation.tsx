import { useTranslations } from "next-intl";
import { Section, SectionHead } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

type Step = { key: string; kind: "manual" | "auto" | "human" };

const BEFORE: Step[] = [
    { key: "b1", kind: "manual" },
    { key: "b2", kind: "manual" },
    { key: "b3", kind: "manual" },
    { key: "b4", kind: "manual" },
    { key: "b5", kind: "manual" },
];

const AFTER: Step[] = [
    { key: "a1", kind: "auto" },
    { key: "a2", kind: "auto" },
    { key: "a3", kind: "human" },
    { key: "a4", kind: "auto" },
];

function Flow({
    steps,
    read,
    tone,
}: {
    steps: Step[];
    read: (key: string) => string;
    tone: "before" | "after";
}) {
    return (
        <ol className="relative">
            {steps.map((step, i) => (
                <li key={step.key} className="relative ps-8">
                    {/* Connector rail. */}
                    {i < steps.length - 1 && (
                        <span
                            aria-hidden
                            className={`absolute start-[7px] top-6 bottom-0 w-px ${
                                tone === "after" ? "bg-acid/40" : "bg-[var(--hairline)]"
                            }`}
                        />
                    )}
                    <span
                        aria-hidden
                        className={`absolute start-0 top-4 size-[15px] rounded-full border ${
                            step.kind === "auto"
                                ? "border-acid bg-acid"
                                : step.kind === "human"
                                  ? "border-acid bg-transparent"
                                  : "border-[var(--on-surface-3)] bg-transparent"
                        }`}
                    />
                    <div className="py-3">
                        <p className="text-[0.9375rem] leading-relaxed text-[var(--on-surface)]">{read(step.key)}</p>
                        <p className="t-meta mt-1 text-[var(--on-surface-3)]">
                            {step.kind === "auto" ? "automated" : step.kind === "human" ? "your call" : "manual"}
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}

/**
 * Section 05. Automation explained as a shape rather than a percentage: the
 * same process before and after, with the steps a person still owns marked in
 * acid outline. No invented savings, no neural-network line art.
 */
export default function Automation() {
    const t = useTranslations("Automation");

    return (
        <Section id="automation" world="void" rhythm="generous">
            <SectionHead index="05" label={t("label")} title={t("title")} lead={t("lead")} />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-5">
                    <h3 className="t-meta pb-6 text-[var(--on-surface-3)]">{t("before_title")}</h3>
                    <Flow steps={BEFORE} read={(k) => t(`steps.${k}`)} tone="before" />
                </Reveal>

                <Reveal index={1} className="lg:col-span-5">
                    <h3 className="t-meta pb-6 text-[var(--accent-text)]">{t("after_title")}</h3>
                    <Flow steps={AFTER} read={(k) => t(`steps.${k}`)} tone="after" />
                </Reveal>

                <Reveal index={2} className="lg:col-span-2">
                    <p className="t-body text-[var(--on-surface-2)]">{t("note")}</p>
                </Reveal>
            </div>
        </Section>
    );
}

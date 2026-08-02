import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Rhythm = "tight" | "normal" | "generous";

const rhythms: Record<Rhythm, string> = {
    tight: "py-16 sm:py-20",
    normal: "py-20 sm:py-28",
    generous: "py-28 sm:py-36 lg:py-40",
};

/**
 * A band of the page. `world` decides which token set everything inside reads;
 * sections never hardcode a colour.
 */
export function Section({
    children,
    id,
    world = "paper",
    rhythm = "normal",
    className = "",
    bleed = false,
}: {
    children: ReactNode;
    id?: string;
    world?: "paper" | "void";
    rhythm?: Rhythm;
    className?: string;
    /** Skip the inner shell so the child can run edge to edge. */
    bleed?: boolean;
}) {
    return (
        <section id={id} className={`world-${world} ${rhythms[rhythm]} ${className}`}>
            {bleed ? children : <div className="shell">{children}</div>}
        </section>
    );
}

/**
 * Section opener: a mono index label, a rule, and the heading. Repeated across
 * the page so a reader can tell where they are without a table of contents.
 */
export function SectionHead({
    index,
    label,
    title,
    lead,
    className = "",
}: {
    /** "02" */
    index: string;
    label: string;
    title: ReactNode;
    lead?: ReactNode;
    className?: string;
}) {
    return (
        <header className={`mb-12 sm:mb-16 ${className}`}>
            <Reveal className="flex items-baseline gap-4 border-b border-[var(--hairline)] pb-4">
                <span className="t-meta tnum text-[var(--accent-text)]">{index}</span>
                <span className="t-meta text-[var(--on-surface-3)]">{label}</span>
            </Reveal>

            {/* Title left, lead right and bottom-aligned: the width gets used
                instead of leaving a dead column beside every heading. */}
            <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
                <Reveal index={1} className="lg:col-span-7">
                    {/* max-width sits on the heading so `ch` resolves at display size. */}
                    <h2 className="t-display-l max-w-[15ch]">{title}</h2>
                </Reveal>
                {lead && (
                    <Reveal index={2} className="lg:col-span-5 lg:pb-2">
                        <p className="t-lead text-[var(--on-surface-2)]">{lead}</p>
                    </Reveal>
                )}
            </div>
        </header>
    );
}

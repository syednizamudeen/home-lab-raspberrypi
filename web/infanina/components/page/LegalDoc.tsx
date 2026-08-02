import { Reveal } from "../ui/Reveal";

export interface LegalSection {
    title: string;
    /** One or more paragraphs. */
    body: string[];
}

/**
 * Long-form legal copy. Numbered sections, a sticky index on wide screens, and
 * a prose measure that stays inside 68ch so a terms page is actually readable.
 */
export function LegalDoc({
    sections,
    updated,
    updatedLabel,
    indexLabel,
}: {
    sections: LegalSection[];
    updated: string;
    updatedLabel: string;
    indexLabel: string;
}) {
    return (
        <div className="world-paper pb-28">
            <div className="shell">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
                    <nav aria-label={indexLabel} className="lg:col-span-3">
                        <div className="lg:sticky lg:top-28">
                            <h2 className="t-meta text-[var(--on-surface-3)]">{indexLabel}</h2>
                            <ol className="mt-4 space-y-2">
                                {sections.map((s, i) => (
                                    <li key={s.title}>
                                        <a
                                            href={`#s-${i + 1}`}
                                            className="flex gap-3 text-[0.875rem] leading-relaxed text-[var(--on-surface-2)] transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
                                        >
                                            <span className="tnum font-mono text-[0.75rem] text-[var(--on-surface-3)]">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                            <p className="t-meta mt-8 text-[var(--on-surface-3)]">
                                {updatedLabel} {updated}
                            </p>
                        </div>
                    </nav>

                    <div className="lg:col-span-8 lg:col-start-5">
                        <div className="rule-list border-t border-[var(--hairline)]">
                            {sections.map((s, i) => (
                                <Reveal key={s.title} as="section" className="block scroll-mt-28 py-10">
                                    <div id={`s-${i + 1}`} className="flex items-baseline gap-4">
                                        <span className="t-meta tnum text-[var(--accent-text)]">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <h2 className="t-h3">{s.title}</h2>
                                    </div>
                                    <div className="mt-5 space-y-4 ps-0 sm:ps-12">
                                        {s.body.map((p, j) => (
                                            <p key={j} className="t-body text-[var(--on-surface-2)]">
                                                {p}
                                            </p>
                                        ))}
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

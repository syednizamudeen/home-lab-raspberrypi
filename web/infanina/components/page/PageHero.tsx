import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { Reveal, RevealLine } from "../ui/Reveal";

/**
 * Interior-page opener. Same anatomy as the home hero at reduced amplitude:
 * mono breadcrumb, one display line, one lead. Always paper, so an interior
 * page still starts in daylight.
 */
export function PageHero({
    breadcrumb,
    title,
    lead,
    aside,
}: {
    breadcrumb: { label: string; href?: "/" | "/work" | "/services" }[];
    title: string;
    lead?: ReactNode;
    aside?: ReactNode;
}) {
    return (
        <section className="world-paper pt-14 pb-16 sm:pt-20 sm:pb-24">
            <div className="shell">
                <Reveal>
                    <nav aria-label="Breadcrumb">
                        <ol className="t-meta flex flex-wrap items-center gap-2 text-[var(--on-surface-3)]">
                            {breadcrumb.map((crumb, i) => (
                                <li key={crumb.label} className="flex items-center gap-2">
                                    {i > 0 && (
                                        <span aria-hidden className="text-[var(--hairline)]">
                                            /
                                        </span>
                                    )}
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span aria-current="page" className="text-[var(--on-surface)]">
                                            {crumb.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </Reveal>

                <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <h1 className="t-display-l max-w-[16ch]">
                            <RevealLine index={1}>{title}</RevealLine>
                        </h1>
                        {lead && (
                            <Reveal index={3} className="mt-8">
                                <p className="t-lead text-[var(--on-surface-2)]">{lead}</p>
                            </Reveal>
                        )}
                    </div>
                    {aside && (
                        <Reveal index={4} className="lg:col-span-4">
                            {aside}
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}

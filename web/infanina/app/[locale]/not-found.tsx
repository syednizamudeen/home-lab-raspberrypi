"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Reveal, RevealLine } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

/**
 * 404.
 *
 * Paper world, same anatomy as every other opener on the site: mono label,
 * one display line with the acid underline, then a hairline index of where to
 * go instead. A dead end is still a page a visitor judges us on, so it gets the
 * same treatment as the rest, not a centred sad face.
 *
 * Client component: `not-found.tsx` receives no route params, so it reads
 * messages from the NextIntlClientProvider mounted in the locale layout.
 */

const DESTINATIONS = [
    { href: "/work", key: "work" },
    { href: "/services", key: "services" },
    { href: "/about", key: "about" },
    { href: "/contact", key: "contact" },
] as const;

export default function NotFound() {
    const t = useTranslations("NotFound");
    const nav = useTranslations("Navigation");
    const title = t("title");

    /* The not-found boundary inherits the layout's metadata, so without this the
       tab reads like a real page. Setting it here is the only place it sticks. */
    useEffect(() => {
        document.title = `${title} · Infanina`;
    }, [title]);

    return (
        <section className="world-paper py-20 sm:py-28 lg:py-32">
            <div className="shell">
                <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-7">
                        <Reveal className="t-meta text-[var(--accent-text)]">{t("code")}</Reveal>

                        <h1 className="t-display-l mt-6 max-w-[14ch]">
                            <RevealLine index={1}>
                                <span className="relative inline-block">
                                    {t("title")}
                                    <span
                                        aria-hidden
                                        className="absolute inset-x-0 -bottom-1 h-[0.08em] bg-acid sm:-bottom-2"
                                    />
                                </span>
                            </RevealLine>
                        </h1>

                        <Reveal index={3} className="mt-8">
                            <p className="t-lead text-[var(--on-surface-2)]">{t("lead")}</p>
                        </Reveal>

                        <Reveal index={4} className="mt-8">
                            <p className="t-body text-[0.9375rem] text-[var(--on-surface-3)]">
                                {t("report")}{" "}
                                <a
                                    href={`mailto:${SITE.email}?subject=${encodeURIComponent("Broken link on infanina.com")}`}
                                    className="text-[var(--on-surface)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors duration-[180ms] hover:decoration-acid"
                                >
                                    {SITE.email}
                                </a>
                            </p>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-5">
                        <h2 className="t-meta text-[var(--on-surface-3)]">{t("elsewhere")}</h2>
                        <ul className="rule-list mt-5 border-t border-[var(--hairline)]">
                            {DESTINATIONS.map((d, i) => (
                                <Reveal key={d.href} index={i} as="li" className="block">
                                    <Link
                                        href={d.href}
                                        className="group flex items-baseline justify-between gap-6 py-5 transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
                                    >
                                        <span className="t-h3">{nav(d.key)}</span>
                                        <span
                                            aria-hidden
                                            className="t-meta text-[var(--accent-text)] transition-transform duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                        >
                                            →
                                        </span>
                                    </Link>
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

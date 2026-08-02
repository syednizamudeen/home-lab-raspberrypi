"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import { WordmarkLink } from "../ui/Wordmark";
import { ButtonLink } from "../ui/Button";

const NAV_ITEMS = [
    { href: "/services", key: "services" },
    { href: "/work", key: "work" },
    { href: "/about", key: "about" },
] as const;

/**
 * Floating pill nav. It reads which world it is currently floating over by
 * measuring the marker the page drops at the world cut, and inverts its own
 * tokens so it never sits paper-on-paper or void-on-void.
 */
export default function Header() {
    const t = useTranslations("Navigation");
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [overVoid, setOverVoid] = useState(false);
    const [lifted, setLifted] = useState(false);
    const frame = useRef(0);

    /* Close the sheet when the route changes, adjusted during render rather
       than in an effect so it never paints an open menu on the new page. */
    const [lastPath, setLastPath] = useState(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setOpen(false);
    }

    useEffect(() => {
        const measure = () => {
            frame.current = 0;
            setLifted(window.scrollY > 12);

            const cut = document.querySelector<HTMLElement>("[data-world-cut]");
            if (!cut) {
                setOverVoid(false);
                return;
            }
            // The pill's own vertical centre, in viewport coordinates.
            setOverVoid(cut.getBoundingClientRect().top <= 48);
        };

        const onScroll = () => {
            if (frame.current) return;
            frame.current = requestAnimationFrame(measure);
        };

        frame.current = requestAnimationFrame(measure);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header
            className={`${overVoid ? "world-void" : "world-paper"} sticky top-0 z-50 w-full bg-transparent!`}
            data-over-void={overVoid || undefined}
        >
            <div className="shell">
                <div
                    className={`mt-3 flex h-14 items-center justify-between gap-4 rounded-pill px-4 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:mt-4 sm:px-5 ${
                        lifted
                            ? "border border-[var(--hairline)] bg-[var(--surface-raised)] shadow-[var(--e1)]"
                            : "border border-transparent"
                    }`}
                >
                    <WordmarkLink />

                    <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`t-meta relative inline-flex h-9 items-center rounded-pill px-3.5 transition-colors duration-[180ms] ${
                                        active
                                            ? "text-[var(--on-surface)]"
                                            : "text-[var(--on-surface-3)] hover:text-[var(--on-surface)]"
                                    }`}
                                >
                                    {t(item.key)}
                                    {active && (
                                        <span aria-hidden className="absolute inset-x-3.5 bottom-1.5 h-px bg-acid" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <div className="hidden sm:block">
                            <LanguageSwitcher />
                        </div>
                        <div className="hidden sm:block">
                            <ButtonLink href="/contact" size="md">
                                {t("contact")}
                            </ButtonLink>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={open}
                            className="t-meta inline-flex h-11 items-center gap-2 rounded-pill border border-[var(--hairline)] px-4 text-[var(--on-surface)] md:hidden"
                        >
                            menu
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sheet — always the void world, so the cut reads as intentional. */}
            <div
                className={`world-void fixed inset-0 z-50 flex flex-col transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!open}
            >
                <div className="shell flex h-14 items-center justify-between pt-3 sm:pt-4">
                    <span className="text-[var(--on-surface)]">
                        <WordmarkLink />
                    </span>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="t-meta inline-flex h-11 items-center rounded-pill border border-[var(--hairline)] px-4 text-[var(--on-surface)]"
                    >
                        close
                    </button>
                </div>

                <nav className="shell mt-10 flex flex-1 flex-col" aria-label="Mobile">
                    <ul className="rule-list border-t border-[var(--hairline)]">
                        {[...NAV_ITEMS, { href: "/contact", key: "contact" } as const].map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    tabIndex={open ? undefined : -1}
                                    className="t-h2 flex items-baseline justify-between py-5 text-[var(--on-surface)]"
                                >
                                    {t(item.key)}
                                    <span aria-hidden className="t-meta text-acid">
                                        →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between border-t border-[var(--hairline)] py-6">
                        <LanguageSwitcher />
                        <span className="t-meta text-[var(--on-surface-3)]">Singapore</span>
                    </div>
                </nav>
            </div>
        </header>
    );
}

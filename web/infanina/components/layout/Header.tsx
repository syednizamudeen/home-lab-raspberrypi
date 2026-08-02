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
    const triggerRef = useRef<HTMLButtonElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);

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

    /* Escape closes, and focus moves into the sheet on open and back to the
       trigger on close, so the menu is operable without a pointer. */
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);

        /* Focus the close control rather than the first link: it is the
           standard exit for a dialog, and it is reliably focusable once the
           inert attribute has been lifted on this frame. */
        const raf = requestAnimationFrame(() => {
            sheetRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        });

        return () => {
            document.removeEventListener("keydown", onKey);
            cancelAnimationFrame(raf);
            triggerRef.current?.focus();
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
                            {/* DESIGN.md allows two acid moments per viewport. Over
                                paper the hero CTA already spends one and the
                                headline underline the other, so the nav sits
                                outlined; it takes the accent once it is over the
                                void and is the only call to action on screen. */}
                            <ButtonLink href="/contact" size="md" variant={overVoid ? "primary" : "outline"}>
                                {t("contact")}
                            </ButtonLink>
                        </div>

                        <button
                            ref={triggerRef}
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label="Open menu"
                            aria-controls="mobile-menu"
                            aria-expanded={open}
                            className="t-meta inline-flex h-11 items-center gap-2 rounded-pill border border-[var(--hairline)] px-4 text-[var(--on-surface)] md:hidden"
                        >
                            menu
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sheet — always the void world, so the cut reads as intentional.
                It moves as well as fades: opacity alone reads as a flicker. */}
            <div
                ref={sheetRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                inert={!open}
                /* `inert` does the hiding: it blocks focus, pointer events and
                   assistive tech in one attribute. A `visibility` toggle would
                   fight the fade and, mid-transition, make the close button
                   briefly unfocusable. */
                className={`world-void fixed inset-0 z-50 flex h-dvh flex-col transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
                    open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                }`}
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

                {/* Scrollable, because five language rows plus the nav overflow a
                    667px-tall phone, and padded for the home indicator. */}
                <nav
                    className="shell mt-8 flex flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                    aria-label="Mobile"
                >
                    <ul className="rule-list border-t border-[var(--hairline)]">
                        {[...NAV_ITEMS, { href: "/contact", key: "contact" } as const].map((item, i) => (
                            <li
                                key={item.href}
                                /* Each row arrives just after the one above it. The delay is
                                   dropped on close so the sheet leaves in one piece. */
                                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                                className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                                }`}
                            >
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
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

                    <div className="mt-auto pt-8">
                        <p className="t-meta mb-2 text-[var(--on-surface-3)]">{t("language")}</p>
                        <LanguageSwitcher variant="inline" />
                    </div>
                </nav>
            </div>
        </header>
    );
}

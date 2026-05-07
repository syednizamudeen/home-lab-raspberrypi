"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";

const NAV_ITEMS = [
    { href: "/services", key: "services" },
    { href: "/products", key: "products" },
    { href: "/work", key: "work" },
    { href: "/about", key: "about" },
] as const;

export default function Header() {
    const t = useTranslations("Navigation");
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const id = requestAnimationFrame(() => setOpen(false));
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? "border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]/80 backdrop-blur-xl"
                    : "border-b border-transparent bg-transparent"
            }`}
        >
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
                <Logo />

                <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                data-focus-ring
                                className={`relative inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors ${
                                    active
                                        ? "text-[var(--color-brand)]"
                                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                }`}
                            >
                                {t(item.key)}
                                {active && (
                                    <span
                                        aria-hidden
                                        className="absolute -bottom-0.5 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-[var(--color-brand)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden md:flex items-center gap-2 ps-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                    <div className="hidden sm:block ps-1">
                        <Button href="/contact" size="md">
                            {t("contact")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <button
                        type="button"
                        data-focus-ring
                        onClick={() => setOpen((o) => !o)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-1)] text-[var(--color-text-primary)]"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
                    open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
                } border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]/95 backdrop-blur-xl`}
            >
                <nav className="px-5 sm:px-8 py-5 flex flex-col gap-1" aria-label="Mobile">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-[10px] px-3 py-3 text-base font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
                        >
                            {t(item.key)}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="rounded-[10px] px-3 py-3 text-base font-semibold text-[var(--color-brand)] hover:bg-[var(--color-brand-subtle-bg)]"
                    >
                        {t("contact")}
                    </Link>
                    <div className="mt-3 flex items-center gap-3 border-t border-[var(--color-border-subtle)] pt-4">
                        <ThemeToggle />
                        <LanguageSwitcher />
                    </div>
                </nav>
            </div>
        </header>
    );
}

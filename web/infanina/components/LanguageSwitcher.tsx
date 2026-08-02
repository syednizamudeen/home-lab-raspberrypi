"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect, useTransition } from "react";

/**
 * Languages are listed by **endonym**: each one written in its own script, the
 * way a speaker of it would write it. A Tamil reader scans for தமிழ், not for
 * the Latin letters "TA", so two-letter codes are the one thing a language
 * switcher must not rely on.
 *
 * `dir` is per-entry because Arabic has to lay out right-to-left even while the
 * surrounding page is left-to-right.
 */
const LANGUAGES = [
    { code: "en", endonym: "English", dir: "ltr" },
    { code: "ms", endonym: "Bahasa Melayu", dir: "ltr" },
    { code: "zh", endonym: "简体中文", dir: "ltr" },
    { code: "ta", endonym: "தமிழ்", dir: "ltr" },
    { code: "ar", endonym: "العربية", dir: "rtl" },
] as const;

/**
 * `menu` is the compact desktop dropdown. `inline` is a full list for the
 * mobile sheet: a dropdown anchored to a control at the bottom of a full-screen
 * sheet opens below the fold and off the edge of the screen.
 */
export default function LanguageSwitcher({ variant = "menu" }: { variant?: "menu" | "inline" }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = useLocale();
    const t = useTranslations("Navigation");
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    /* Hooks run before any branch: an early return above a hook changes the
       hook order between renders. */
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

    const change = (next: string) => {
        startTransition(() => {
            // next-intl typed routing: for dynamic segments, pass `{ pathname, params }` so
            // the route pattern (e.g. "/work/[slug]") is rehydrated with the current slug.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.replace({ pathname, params: params as any } as any, { locale: next });
            setOpen(false);
        });
    };

    if (variant === "inline") {
        return (
            <ul className="rule-list border-t border-[var(--hairline)]" aria-label={t("language")}>
                {LANGUAGES.map((lang) => {
                    const active = locale === lang.code;
                    return (
                        <li key={lang.code}>
                            <button
                                type="button"
                                lang={lang.code}
                                dir={lang.dir}
                                disabled={isPending}
                                aria-current={active ? "true" : undefined}
                                onClick={() => change(lang.code)}
                                className={`flex min-h-13 w-full items-center justify-between gap-4 py-3.5 text-start text-[1.0625rem] transition-colors duration-[180ms] ${
                                    active
                                        ? "font-semibold text-[var(--on-surface)]"
                                        : "text-[var(--on-surface-2)] active:text-[var(--on-surface)]"
                                }`}
                            >
                                <span>{lang.endonym}</span>
                                {active && (
                                    <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-acid" />
                                )}
                            </button>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`${t("language")}: ${current.endonym}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-pill px-3 text-[0.875rem] text-[var(--on-surface-2)] transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
            >
                <span lang={current.code} dir={current.dir}>
                    {current.endonym}
                </span>
                <svg
                    viewBox="0 0 10 6"
                    aria-hidden
                    className={`w-2.5 shrink-0 transition-transform duration-[180ms] ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                    <path d="M1 1l4 4 4-4" strokeLinecap="square" />
                </svg>
            </button>

            <div
                role="listbox"
                aria-label={t("language")}
                className={`absolute end-0 z-50 mt-3 w-52 overflow-hidden rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-raised)] shadow-[var(--e2)] transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] ltr:origin-top-right rtl:origin-top-left ${
                    open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                }`}
            >
                <ul className="rule-list">
                    {LANGUAGES.map((lang) => {
                        const active = locale === lang.code;
                        return (
                            <li key={lang.code}>
                                <button
                                    type="button"
                                    role="option"
                                    lang={lang.code}
                                    dir={lang.dir}
                                    aria-selected={active}
                                    disabled={isPending}
                                    tabIndex={open ? undefined : -1}
                                    onClick={() => change(lang.code)}
                                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm transition-colors duration-[180ms] ${
                                        active
                                            ? "font-semibold text-[var(--on-surface)]"
                                            : "text-[var(--on-surface-2)] hover:bg-[var(--surface)]"
                                    }`}
                                >
                                    <span>{lang.endonym}</span>
                                    {active && (
                                        <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

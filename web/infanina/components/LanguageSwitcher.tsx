"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect, useTransition } from "react";

const LANGUAGES = [
    { code: "en", name: "English", label: "EN" },
    { code: "ms", name: "Bahasa Melayu", label: "MS" },
    { code: "zh", name: "简体中文", label: "ZH" },
    { code: "ta", name: "தமிழ்", label: "TA" },
    { code: "ar", name: "العربية", label: "AR" },
] as const;

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = useLocale();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

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

    const change = (next: string) => {
        startTransition(() => {
            // next-intl typed routing: for dynamic segments, pass `{ pathname, params }` so
            // the route pattern (e.g. "/work/[slug]") is rehydrated with the current slug.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.replace({ pathname, params: params as any } as any, { locale: next });
            setOpen(false);
        });
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Language: ${current.name}`}
                className="t-meta inline-flex h-9 items-center gap-1.5 rounded-pill px-3 text-[var(--on-surface-2)] transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
            >
                {current.label}
                <svg viewBox="0 0 10 6" aria-hidden className={`w-2.5 transition-transform duration-[180ms] ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l4 4 4-4" strokeLinecap="square" />
                </svg>
            </button>

            <div
                role="listbox"
                aria-label="Language"
                className={`absolute end-0 z-50 mt-3 w-48 overflow-hidden rounded-[10px] border border-[var(--hairline)] bg-[var(--surface-raised)] shadow-[var(--e2)] transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] ltr:origin-top-right rtl:origin-top-left ${
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
                                    aria-selected={active}
                                    disabled={isPending}
                                    onClick={() => change(lang.code)}
                                    className={`flex w-full items-center justify-between px-4 py-3 text-start text-sm transition-colors duration-[180ms] ${
                                        active
                                            ? "font-semibold text-[var(--on-surface)]"
                                            : "text-[var(--on-surface-2)] hover:bg-[var(--surface)]"
                                    }`}
                                >
                                    <span>{lang.name}</span>
                                    {active && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-acid" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

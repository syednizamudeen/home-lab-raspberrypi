"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState, useRef, useEffect, useTransition } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

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
            router.replace(pathname, { locale: next });
            setOpen(false);
        });
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                data-focus-ring
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-3 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
            >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{current.name}</span>
                <span className="sm:hidden">{current.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            <div
                role="listbox"
                className={`absolute end-0 mt-2 w-52 rounded-[12px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] shadow-[var(--shadow-md)] overflow-hidden ltr:origin-top-right rtl:origin-top-left transition-all duration-200 z-50
                    ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
            >
                <ul className="p-1.5">
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
                                    className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-sm transition-colors ${
                                        active
                                            ? "bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)] font-semibold"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
                                    }`}
                                >
                                    <span>{lang.name}</span>
                                    {active && <Check className="h-4 w-4" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

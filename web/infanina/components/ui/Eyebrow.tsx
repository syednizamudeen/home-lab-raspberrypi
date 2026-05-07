import { ReactNode } from "react";

export function Eyebrow({
    children,
    className = "",
    tone = "brand",
}: {
    children: ReactNode;
    className?: string;
    tone?: "brand" | "muted" | "on-brand";
}) {
    const toneClasses = {
        brand: "text-[var(--color-brand)]",
        muted: "text-[var(--color-text-muted)]",
        "on-brand": "text-white/85",
    }[tone];

    return (
        <span
            className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses} ${className}`}
        >
            <span className="h-px w-6 bg-current opacity-60" aria-hidden />
            {children}
        </span>
    );
}

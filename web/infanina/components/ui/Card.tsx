import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    interactive?: boolean;
    accent?: "none" | "brand" | "coral" | "attention";
}

const ACCENT_BAR: Record<NonNullable<CardProps["accent"]>, string> = {
    none: "",
    brand: "before:bg-[var(--color-brand)]",
    coral: "before:bg-[var(--color-coral)]",
    attention: "before:bg-[var(--color-attention)]",
};

export function Card({
    children,
    className = "",
    interactive = false,
    accent = "none",
}: CardProps) {
    const interactiveClasses = interactive
        ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] hover:border-[var(--color-border-strong)]"
        : "";

    const accentClasses =
        accent !== "none"
            ? `relative overflow-hidden before:absolute before:inset-y-4 before:start-0 before:w-[3px] before:rounded-full before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 ${ACCENT_BAR[accent]}`
            : "";

    return (
        <div
            className={`group rounded-[16px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 sm:p-7 shadow-[var(--shadow-sm)] ${interactiveClasses} ${accentClasses} ${className}`}
        >
            {children}
        </div>
    );
}

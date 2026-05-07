import { ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps {
    children: ReactNode;
    id?: string;
    className?: string;
    innerClassName?: string;
    tone?: "default" | "muted" | "brand";
    bare?: boolean;
}

const TONE_BG: Record<NonNullable<SectionProps["tone"]>, string> = {
    default: "bg-[var(--color-surface-0)]",
    muted: "bg-[var(--color-surface-2)]",
    brand: "bg-[var(--color-brand)] text-[var(--color-text-on-brand)]",
};

export function Section({
    children,
    id,
    className = "",
    innerClassName = "",
    tone = "default",
    bare = false,
}: SectionProps) {
    return (
        <section
            id={id}
            className={`relative isolate ${TONE_BG[tone]} ${bare ? "" : "py-20 sm:py-24 lg:py-32"} ${className}`}
        >
            <Container className={innerClassName}>{children}</Container>
        </section>
    );
}

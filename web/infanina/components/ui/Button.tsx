import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/routing";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
    "group relative inline-flex items-center justify-center gap-3 rounded-pill font-sans font-semibold " +
    "transition-[background-color,color,border-color,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] " +
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
    md: "min-h-11 ps-5 pe-2 py-2 text-[0.9375rem]",
    lg: "min-h-14 ps-7 pe-3 py-3 text-base",
};

const variants: Record<Variant, string> = {
    /* Acid pill, ink type. Identical in both worlds: the accent is the constant. */
    primary: "bg-acid text-ink hover:bg-[oklch(92%_0.2_125)]",
    outline:
        "border border-[var(--hairline)] text-[var(--on-surface)] hover:border-[var(--on-surface)] " +
        "hover:bg-[var(--surface-raised)]",
    ghost: "px-0! text-[var(--on-surface)] hover:text-[var(--accent-text)]",
};

function Chevron() {
    return (
        <span
            aria-hidden
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,currentColor_14%,transparent)] transition-transform duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180"
        >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
            </svg>
        </span>
    );
}

type CommonProps = {
    children: ReactNode;
    variant?: Variant;
    size?: Size;
    /** Trailing circular arrow. On by default for primary. */
    arrow?: boolean;
    className?: string;
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    arrow,
    className = "",
    ...rest
}: CommonProps & Omit<ComponentProps<"button">, "children" | "className">) {
    const showArrow = arrow ?? variant === "primary";
    return (
        <button
            className={`${base} ${sizes[size]} ${variants[variant]} ${showArrow ? "" : "pe-5"} ${className}`}
            {...rest}
        >
            <span>{children}</span>
            {showArrow && <Chevron />}
        </button>
    );
}

export function ButtonLink({
    children,
    href,
    variant = "primary",
    size = "md",
    arrow,
    external = false,
    className = "",
    ...rest
}: CommonProps & {
    href: string;
    external?: boolean;
} & Omit<ComponentProps<"a">, "children" | "href" | "className">) {
    const showArrow = arrow ?? variant === "primary";
    const cls = `${base} ${sizes[size]} ${variants[variant]} ${showArrow ? "" : "pe-5"} ${className}`;
    const inner = (
        <>
            <span>{children}</span>
            {showArrow && <Chevron />}
        </>
    );

    if (external) {
        return (
            <a href={href} className={cls} rel="noreferrer noopener" target="_blank" {...rest}>
                {inner}
            </a>
        );
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Link href={href as any} className={cls} {...rest}>
            {inner}
        </Link>
    );
}

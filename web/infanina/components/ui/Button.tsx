import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";
import { Link } from "@/i18n/routing";

type Variant = "primary" | "secondary" | "ghost" | "on-brand";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
    primary:
        "bg-[var(--color-brand)] text-white shadow-[var(--shadow-brand)] hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-active)]",
    secondary:
        "bg-[var(--color-surface-1)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]",
    ghost: "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]",
    "on-brand":
        "bg-white text-[var(--color-brand)] hover:bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
};

const SIZE: Record<Size, string> = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
};

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold whitespace-nowrap transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-brand-subtle-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

interface CommonProps {
    variant?: Variant;
    size?: Size;
    children: ReactNode;
    className?: string;
}

type ButtonAsButton = CommonProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
        href?: undefined;
    };

type ButtonAsLink = CommonProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href"> & {
        href: string;
        external?: boolean;
    };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
    { variant = "primary", size = "md", className = "", children, ...rest },
    ref,
) {
    const cls = `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`;

    if ("href" in rest && rest.href !== undefined) {
        const { href, external, ...anchorRest } = rest as ButtonAsLink;
        if (external || /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    className={cls}
                    rel={external ? "noopener noreferrer" : undefined}
                    target={external ? "_blank" : undefined}
                    {...anchorRest}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} className={cls} {...anchorRest}>
                {children}
            </Link>
        );
    }

    return (
        <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...(rest as ButtonAsButton)}>
            {children}
        </button>
    );
});

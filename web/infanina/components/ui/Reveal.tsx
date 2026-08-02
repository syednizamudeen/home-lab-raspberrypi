"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Props = {
    children: ReactNode;
    /** Stagger position within its group. Each step adds 60ms. */
    index?: number;
    /** Display lines travel further and slower than blocks. */
    variant?: "block" | "line";
    as?: ElementType;
    className?: string;
};

/**
 * One-shot entrance. Fires once at 20% intersection and then stops observing:
 * nothing on this site re-animates when you scroll back up.
 */
export function Reveal({ children, index = 0, variant = "block", as, className = "" }: Props) {
    const Tag = (as ?? "div") as ElementType;
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === "undefined") {
            // No observer support: show everything on the next frame.
            const raf = requestAnimationFrame(() => setShown(true));
            return () => cancelAnimationFrame(raf);
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setShown(true);
                        io.disconnect();
                    }
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            data-reveal={variant}
            className={`${shown ? "is-in" : ""} ${className}`.trim()}
            style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
        >
            {children}
        </Tag>
    );
}

/**
 * A display line that rises out of its own mask. Used for hero and section
 * openers, where a plain fade would read as too soft.
 */
export function RevealLine({
    children,
    index = 0,
    className = "",
}: {
    children: ReactNode;
    index?: number;
    className?: string;
}) {
    return (
        <Reveal variant="line" index={index} className={className}>
            <span className="line-mask">
                <span>{children}</span>
            </span>
        </Reveal>
    );
}

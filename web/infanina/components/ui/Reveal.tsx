"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * One shared IntersectionObserver for every entrance on the page.
 *
 * The home page mounts around forty of these. An observer per element means
 * forty separate observers each doing their own intersection bookkeeping; one
 * observer with a callback registry does the same work once. Targets are
 * unobserved as they fire, so the registry drains to empty.
 */
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function sharedObserver(): IntersectionObserver | null {
    if (typeof IntersectionObserver === "undefined") return null;
    if (observer) return observer;

    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const fire = callbacks.get(entry.target);
                if (fire) {
                    fire();
                    callbacks.delete(entry.target);
                }
                observer?.unobserve(entry.target);
            }
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    return observer;
}

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
 * One-shot entrance. Fires once at 20% intersection and then stops watching:
 * nothing on this site re-animates when you scroll back up.
 */
export function Reveal({ children, index = 0, variant = "block", as, className = "" }: Props) {
    const Tag = (as ?? "div") as ElementType;
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = sharedObserver();
        if (!io) {
            // No observer support: show everything on the next frame.
            const raf = requestAnimationFrame(() => setShown(true));
            return () => cancelAnimationFrame(raf);
        }

        callbacks.set(el, () => setShown(true));
        io.observe(el);

        return () => {
            callbacks.delete(el);
            io.unobserve(el);
        };
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

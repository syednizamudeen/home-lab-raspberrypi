"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Stagger delay in ms. */
    delay?: number;
    /** Translate-from distance in px. Default 12. */
    distance?: number;
    /** Override the rendered element. Default `div`. */
    as?: ElementType;
    /** Forward style on the rendered element. */
    style?: CSSProperties;
}

/**
 * Fade-and-rise reveal triggered the first time the element enters the viewport.
 * SSR-safe (initial render is the hidden state on both server and client; IO upgrades it).
 * Honors prefers-reduced-motion: appears immediately without animation.
 */
export function Reveal({
    children,
    className,
    delay = 0,
    distance = 12,
    as,
    style,
}: RevealProps) {
    const Tag = (as ?? "div") as ElementType;
    const ref = useRef<HTMLElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const id = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(id);
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
        );
        io.observe(node);
        return () => io.disconnect();
    }, []);

    const motionStyle: CSSProperties = {
        transition:
            "opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${distance}px,0)`,
        willChange: visible ? "auto" : "opacity, transform",
        ...style,
    };

    return (
        <Tag ref={ref} className={className} style={motionStyle}>
            {children}
        </Tag>
    );
}

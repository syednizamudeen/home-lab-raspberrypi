"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
    /** Final value as string. Supports prefix/suffix: "+40", "99.95%", "120+". */
    value: string;
    /** Duration in ms. Default 1400. */
    duration?: number;
    className?: string;
}

/**
 * Tweens a numeric portion of `value` from 0 to its parsed number when the
 * element first enters the viewport. Manipulates textContent directly so React
 * never re-renders during animation. SSR renders the final value, so users with
 * JS off (or with prefers-reduced-motion) just see the static number.
 */
export function CountUp({ value, duration = 1400, className }: CountUpProps) {
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const match = /^([^\d.]*)([\d.]+)(.*)$/.exec(value);
        if (!match) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const [, prefix, numStr, suffix] = match;
        const target = parseFloat(numStr);
        const decimals = numStr.split(".")[1]?.length ?? 0;

        let raf = 0;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                io.disconnect();

                node.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - t, 3);
                    node.textContent = `${prefix}${(eased * target).toFixed(decimals)}${suffix}`;
                    if (t < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.4 },
        );
        io.observe(node);
        return () => {
            io.disconnect();
            if (raf) cancelAnimationFrame(raf);
        };
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            {value}
        </span>
    );
}

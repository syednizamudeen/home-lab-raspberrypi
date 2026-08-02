"use client";

import { useEffect, useState } from "react";

const FORMAT: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
};

/**
 * Live Singapore wall clock. Renders a stable placeholder on the server so
 * hydration can't mismatch, then starts ticking on mount. Not decorative: it is
 * the cheapest honest proof that someone is actually in this timezone.
 */
export function SingaporeClock() {
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const tick = () => setTime(new Intl.DateTimeFormat("en-GB", FORMAT).format(new Date()));
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, []);

    return (
        /* A clock reads left to right in every locale, including Arabic. */
        <span dir="ltr" className="tnum inline-flex gap-2 tabular-nums" suppressHydrationWarning>
            <span>{time ?? "--:--:--"}</span>
            <span className="text-[var(--on-surface-3)]">SGT</span>
        </span>
    );
}

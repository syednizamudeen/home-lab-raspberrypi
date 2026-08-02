import { Link } from "@/i18n/routing";

/**
 * The identity. No icon, no lockup, no gradient: the name set in Archivo at a
 * tight negative tracking, with the dot that separates "infan" from "ina"
 * carrying the acid. The mark is the typography.
 */
export function Wordmark({
    size = "sm",
    className = "",
}: {
    size?: "sm" | "xl";
    className?: string;
}) {
    const scale =
        size === "xl"
            ? "text-[clamp(3.5rem,16.8vw,15rem)] leading-[0.82]"
            : "text-[1.0625rem] leading-none";

    return (
        <span
            /* The mark is a name, not prose: it stays left-to-right in Arabic,
               so the acid dot never jumps to the front. */
            dir="ltr"
            className={`font-display font-extrabold tracking-[-0.045em] lowercase ${scale} ${className}`}
            style={{ fontStretch: size === "xl" ? "118%" : "104%" }}
        >
            infanina
            <span aria-hidden className="text-acid">
                .
            </span>
        </span>
    );
}

export function WordmarkLink({ className = "" }: { className?: string }) {
    return (
        <Link
            href="/"
            aria-label="Infanina, home"
            className={`inline-flex items-center text-[var(--on-surface)] ${className}`}
        >
            <Wordmark />
        </Link>
    );
}

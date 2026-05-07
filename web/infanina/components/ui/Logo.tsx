import { Link } from "@/i18n/routing";

export function Logo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
    return (
        <Link
            href="/"
            onClick={onClick}
            className={`inline-flex items-center gap-2 group ${className}`}
            aria-label="Infanina home"
        >
            <span aria-hidden className="relative">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="block">
                    <rect x="3" y="3" width="22" height="22" rx="6" fill="var(--color-brand)" />
                    <path
                        d="M9 19V11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5V13.5C14 14.8807 15.1193 16 16.5 16C17.8807 16 19 14.8807 19 13.5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
                <span
                    className="absolute -inset-1 rounded-lg bg-[var(--color-coral)]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden
                />
            </span>
            <span className="font-display text-[20px] font-bold tracking-tight text-[var(--color-text-primary)]">
                infanina
            </span>
        </Link>
    );
}

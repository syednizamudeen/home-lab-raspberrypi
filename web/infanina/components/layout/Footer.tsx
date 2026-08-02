import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Wordmark } from "../ui/Wordmark";
import { SITE, activeSocials, display, isPlaceholder, telLink, whatsappLink } from "@/lib/site";

const LEGAL = [
    { href: "/privacy", key: "privacy" },
    { href: "/terms", key: "terms" },
] as const;

export default function Footer() {
    const t = useTranslations("Footer");
    const nav = useTranslations("Navigation");
    const socials = activeSocials();
    const wa = whatsappLink("Hi Infanina, I'd like to book the free consultation hour.");
    const tel = telLink();
    const year = new Date().getFullYear();

    const linkStyle =
        "text-[var(--on-surface)] underline decoration-[var(--hairline)] decoration-1 underline-offset-4 transition-colors duration-[180ms] hover:decoration-acid";

    return (
        <footer className="world-void overflow-hidden pt-24 sm:pt-32">
            <div className="shell">
                <div className="grid gap-12 border-b border-[var(--hairline)] pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    <div className="lg:col-span-2">
                        <p className="t-h3 max-w-[20ch] text-[var(--on-surface)]">{t("pitch")}</p>
                        <p className="t-meta mt-6 text-[var(--on-surface-3)]">{SITE.hours}</p>
                        <p className="t-meta mt-1 text-[var(--on-surface-3)]">{SITE.responseWindow}</p>
                    </div>

                    <div>
                        <h2 className="t-meta text-[var(--on-surface-3)]">{t("reach_us")}</h2>
                        <ul className="mt-5 space-y-3 text-[0.9375rem]">
                            <li>
                                <a href={`mailto:${SITE.email}`} className={linkStyle}>
                                    {SITE.email}
                                </a>
                            </li>
                            {/* Unconfigured channels are omitted, not printed as
                                blanks: an absent row costs nothing, a
                                "[ to be confirmed ]" row costs the claim. */}
                            {tel && (
                                <li>
                                    <a href={tel} className={linkStyle}>
                                        {SITE.phoneDisplay}
                                    </a>
                                </li>
                            )}
                            {wa && (
                                <li>
                                    <a href={wa} rel="noreferrer noopener" target="_blank" className={linkStyle}>
                                        {t("whatsapp")}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h2 className="t-meta text-[var(--on-surface-3)]">{t("company")}</h2>
                        <ul className="mt-5 space-y-3 text-[0.9375rem]">
                            {(["services", "work", "about", "contact"] as const).map((key) => (
                                <li key={key}>
                                    <Link
                                        href={key === "contact" ? "/contact" : `/${key}`}
                                        className="text-[var(--on-surface-2)] transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
                                    >
                                        {nav(key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {socials.length > 0 && (
                            <ul className="mt-8 space-y-3 text-[0.9375rem]">
                                {socials.map((s) => (
                                    <li key={s.key}>
                                        <a
                                            href={s.href}
                                            rel="noreferrer noopener"
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-[var(--on-surface-2)] transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
                                        >
                                            {s.label}
                                            <span aria-hidden className="text-acid">
                                                ↗
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* The registration block appears once the details exist. Printing
                    four labelled blanks reads as a company that is not real yet,
                    which is the opposite of what this block is for. */}
                <dl className="grid gap-x-8 gap-y-5 py-10 sm:grid-cols-2 lg:grid-cols-4 empty:hidden">
                    {[
                        !isPlaceholder(SITE.legalName) && { term: t("registered_name"), value: SITE.legalName },
                        !isPlaceholder(SITE.uen) && { term: t("uen"), value: SITE.uen },
                        !isPlaceholder(SITE.address.line1) && {
                            term: t("registered_address"),
                            value: `${SITE.address.line1}, Singapore ${display(SITE.address.postalCode)}`,
                        },
                        { term: t("jurisdiction"), value: "Singapore" },
                    ].filter((row): row is { term: string; value: string } => Boolean(row)).map((row) => (
                        <div key={row.term}>
                            <dt className="t-meta text-[var(--on-surface-3)]">{row.term}</dt>
                            <dd className="tnum mt-2 font-mono text-[0.8125rem] leading-relaxed text-[var(--on-surface-2)]">
                                {row.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] py-6">
                    <p className="t-meta text-[var(--on-surface-3)]">
                        © {year} {isPlaceholder(SITE.legalName) ? SITE.name : SITE.legalName}
                    </p>
                    <ul className="flex items-center gap-6">
                        {LEGAL.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="t-meta text-[var(--on-surface-3)] transition-colors duration-[180ms] hover:text-[var(--on-surface)]"
                                >
                                    {nav(item.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* The mark, at the size it deserves, bleeding past both edges. */}
            <div aria-hidden className="select-none overflow-hidden px-[clamp(1.25rem,4vw,3rem)] pt-4">
                <span className="block whitespace-nowrap text-[var(--on-surface)]">
                    <Wordmark size="xl" className="block" />
                </span>
            </div>
        </footer>
    );
}

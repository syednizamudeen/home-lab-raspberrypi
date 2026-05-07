import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";
import { SITE } from "@/lib/site";

export default function Footer() {
    const t = useTranslations("Footer");
    const tNav = useTranslations("Navigation");
    const year = new Date().getFullYear().toString();

    return (
        <footer className="relative mt-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
            <Container className="py-16">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Logo />
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {t("company_desc")}
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href={SITE.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                data-focus-ring
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href={SITE.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                data-focus-ring
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                            {t("explore_title")}
                        </h4>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li><Link href="/services" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)]">{tNav("services")}</Link></li>
                            <li><Link href="/products" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)]">{tNav("products")}</Link></li>
                            <li><Link href="/work" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)]">{tNav("work")}</Link></li>
                            <li><Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)]">{tNav("about")}</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4">
                        <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                            {t("contact_title")}
                        </h4>
                        <ul className="mt-5 space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand)]" />
                                <a href={`mailto:${SITE.email}`} className="hover:text-[var(--color-brand)]">{SITE.email}</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand)]" />
                                <span>{t("address")}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-4 border-t border-[var(--color-border-subtle)] pt-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        {t("copyright", { year })} · {t("reg_no")}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-[var(--color-brand)]">{t("privacy_link")}</Link>
                        <Link href="/terms" className="hover:text-[var(--color-brand)]">{t("terms_link")}</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

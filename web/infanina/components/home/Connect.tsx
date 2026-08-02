import { useTranslations } from "next-intl";
import { Section, SectionHead } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { ContactForm } from "../contact/ContactForm";
import { SITE, display, telLink, whatsappLink } from "@/lib/site";

/**
 * Section 06. The free consultation hour, and three ways to reach a human that
 * do not involve a form. The form is the primary path, not the only one: an SME
 * owner who wants to WhatsApp you at 9pm should be able to.
 */
export default function Connect() {
    const t = useTranslations("Connect");
    const wa = whatsappLink(t("whatsapp_prefill"));
    const tel = telLink();

    const channels = [
        { key: "whatsapp", href: wa, value: display(SITE.whatsapp), external: true },
        { key: "phone", href: tel, value: display(SITE.phoneDisplay), external: false },
        { key: "email", href: `mailto:${SITE.email}`, value: SITE.email, external: false },
    ];

    return (
        <Section id="connect" world="void" rhythm="normal">
            <SectionHead index="06" label={t("label")} title={t("title")} lead={t("lead")} />

            <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
                <Reveal className="lg:col-span-7">
                    <ContactForm fallbackEmail={SITE.email} />
                </Reveal>

                <div className="lg:col-span-4 lg:col-start-9">
                    <Reveal index={1}>
                        <h3 className="t-meta text-[var(--on-surface-3)]">{t("hour_title")}</h3>
                        <ul className="mt-5 space-y-3">
                            {(["scope", "estimate", "plan"] as const).map((k) => (
                                <li key={k} className="flex gap-3 text-[0.9375rem] leading-relaxed text-[var(--on-surface-2)]">
                                    <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-acid" />
                                    {t(`hour_points.${k}`)}
                                </li>
                            ))}
                        </ul>
                        <p className="t-body mt-6 text-[0.875rem] text-[var(--on-surface-3)]">{t("hour_note")}</p>
                    </Reveal>

                    <Reveal index={2} className="mt-12">
                        <h3 className="t-meta text-[var(--on-surface-3)]">{t("direct_title")}</h3>
                        <ul className="rule-list mt-5 border-t border-[var(--hairline)]">
                            {channels.map((c) => (
                                <li key={c.key} className="py-4">
                                    <p className="t-meta text-[var(--on-surface-3)]">{t(`channels.${c.key}`)}</p>
                                    {c.href ? (
                                        <a
                                            href={c.href}
                                            {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                                            dir="ltr"
                                            className="mt-1 inline-block font-mono text-[0.875rem] text-[var(--on-surface)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors duration-[180ms] hover:decoration-acid"
                                        >
                                            {c.value}
                                        </a>
                                    ) : (
                                        <span className="mt-1 block font-mono text-[0.875rem] text-[var(--on-surface-3)]">
                                            {c.value}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <p className="t-meta mt-5 text-[var(--on-surface-3)]">{SITE.hours}</p>
                    </Reveal>
                </div>
            </div>
        </Section>
    );
}

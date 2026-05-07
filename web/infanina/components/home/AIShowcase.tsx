import { useTranslations } from "next-intl";
import { CheckCircle2, Send, Sparkles, Globe2, Database } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

export default function AIShowcase() {
    const t = useTranslations("Home.showcase");

    const features = [
        { key: "feature_1", icon: Sparkles },
        { key: "feature_2", icon: Database },
        { key: "feature_3", icon: Globe2 },
    ] as const;

    return (
        <Section id="showcase" tone="default">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-5">
                    <Eyebrow>{t("eyebrow")}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[44px] lg:text-[52px]">
                        {t("title")}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                        {t("subtitle")}
                    </p>

                    <ul className="mt-8 space-y-5">
                        {features.map(({ key, icon: Icon }, i) => (
                            <Reveal key={key} as="li" delay={120 + i * 80} className="flex gap-4">
                                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div>
                                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                                        {t(`${key}_title`)}
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                        {t(`${key}_desc`)}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </ul>
                </Reveal>

                <Reveal className="lg:col-span-7" delay={120}>
                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute -inset-6 -z-10 rounded-[32px] blur-2xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-brand-subtle-bg), transparent 60%, rgba(255,163,175,0.15))",
                            }}
                        />

                        <div className="overflow-hidden rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] shadow-[var(--shadow-md)]" dir="ltr">
                            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-5 py-3">
                                <div className="flex items-center gap-3">
                                    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand)] text-white font-display text-sm font-bold">
                                        Ai
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                            {t("chatbot_name")}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-success)]">
                                            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                                            {t("status")}
                                        </p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-subtle-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-brand)]">
                                    <CheckCircle2 className="h-3 w-3" /> Live
                                </span>
                            </div>

                            <div className="space-y-4 p-5 sm:p-6">
                                <div className="flex max-w-[85%] gap-3">
                                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-semibold text-white">
                                        Ai
                                    </span>
                                    <div className="rounded-[14px] rounded-tl-sm bg-[var(--color-surface-2)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
                                        {t("msg_hello")}
                                    </div>
                                </div>

                                <div className="flex max-w-[85%] ml-auto justify-end">
                                    <div className="rounded-[14px] rounded-tr-sm bg-[var(--color-brand)] px-4 py-3 text-sm leading-relaxed text-white shadow-[var(--shadow-sm)]">
                                        {t("msg_user")}
                                    </div>
                                </div>

                                <div className="flex max-w-[85%] gap-3">
                                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-semibold text-white">
                                        Ai
                                    </span>
                                    <div className="rounded-[14px] rounded-tl-sm bg-[var(--color-surface-2)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
                                        {t("msg_response")}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] p-3">
                                <div className="flex items-center gap-2 rounded-[12px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] pl-4 pr-1.5 py-1.5">
                                    <input
                                        type="text"
                                        readOnly
                                        placeholder={t("input_placeholder")}
                                        className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                                        aria-label={t("input_placeholder")}
                                    />
                                    <button
                                        type="button"
                                        aria-label="Send"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-brand)] text-white"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </Section>
    );
}

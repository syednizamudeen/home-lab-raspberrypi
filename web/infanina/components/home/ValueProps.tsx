import { useTranslations } from "next-intl";
import { Hammer, Plug, LifeBuoy } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";

const ITEMS = [
    { key: "build", icon: Hammer },
    { key: "integrate", icon: Plug },
    { key: "support", icon: LifeBuoy },
] as const;

export default function ValueProps() {
    const t = useTranslations("Home.values");

    return (
        <Section id="how" tone="default">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                    <Eyebrow>{t("eyebrow")}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-[44px] lg:text-[52px]">
                        {t("title")}
                    </h2>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                        {t("subtitle")}
                    </p>
                </div>

                <ul className="lg:col-span-7 grid gap-px overflow-hidden rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)]">
                    {ITEMS.map(({ key, icon: Icon }) => (
                        <li
                            key={key}
                            className="group relative flex flex-col gap-3 bg-[var(--color-surface-1)] p-7 transition-colors hover:bg-[var(--color-surface-2)]"
                        >
                            <div className="flex items-center gap-4">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--color-brand-subtle-bg)] text-[var(--color-brand)]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                    {t(`items.${key}.title`)}
                                </h3>
                            </div>
                            <p className="ms-[60px] text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                {t(`items.${key}.desc`)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}

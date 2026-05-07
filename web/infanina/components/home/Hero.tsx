import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { MeshBackdrop } from "../ui/MeshBackdrop";

const TRUSTED = ["F&B", "RETAIL", "FINTECH", "GOV", "EDU", "LOGISTICS"];

export default function Hero() {
    const t = useTranslations("Home.hero");

    return (
        <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-32">
            <MeshBackdrop />

            <Container className="relative">
                <div className="hero-stagger flex flex-col items-center text-center">
                    <Eyebrow>{t("eyebrow")}</Eyebrow>

                    <h1 className="mt-6 max-w-4xl font-display text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-6xl lg:text-[88px] lg:leading-[0.96]">
                        <span className="block">{t("title_1")}</span>
                        <span className="block">
                            <span className="brand-mark">{t("title_2")}</span>
                        </span>
                        <span className="mt-3 block text-[20px] font-medium leading-snug tracking-normal text-[var(--color-text-secondary)] sm:text-2xl lg:text-3xl">
                            {t("title_3")}
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                        {t("subtitle")}
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                        <Button href="/contact" size="lg" variant="primary">
                            {t("cta_primary")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button href="/work" size="lg" variant="secondary">
                            {t("cta_secondary")}
                        </Button>
                    </div>

                    <div className="mt-16 w-full">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                            {t("trusted_by")}
                        </div>
                        <div className="relative mt-5 overflow-hidden">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 start-0 w-20 bg-gradient-to-e from-[var(--color-surface-0)] to-transparent z-10"
                                style={{ background: "linear-gradient(to right, var(--color-surface-0), transparent)" }}
                            />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 end-0 w-20 z-10"
                                style={{ background: "linear-gradient(to left, var(--color-surface-0), transparent)" }}
                            />
                            <div className="marquee">
                                {[...TRUSTED, ...TRUSTED].map((label, i) => (
                                    <span
                                        key={`${label}-${i}`}
                                        className="font-display text-[15px] font-semibold tracking-[0.18em] text-[var(--color-text-muted)]"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

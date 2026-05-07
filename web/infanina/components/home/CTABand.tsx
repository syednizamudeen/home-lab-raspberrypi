import { useTranslations } from "next-intl";
import { ArrowRight, Mail } from "lucide-react";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SITE } from "@/lib/site";

export default function CTABand() {
    const t = useTranslations("Home.cta");

    return (
        <section className="relative isolate overflow-hidden bg-[var(--color-brand)] py-20 text-white sm:py-28">
            {/* Decorative shapes */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 opacity-60"
                style={{
                    background:
                        "radial-gradient(60% 60% at 90% 0%, rgba(255,163,175,0.35), transparent 70%), radial-gradient(50% 60% at 10% 100%, rgba(251,175,0,0.18), transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="absolute inset-0 -z-10 opacity-30 mix-blend-overlay"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                    backgroundSize: "20px 20px",
                }}
            />

            <Container>
                <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                    <Reveal className="lg:col-span-8">
                        <Eyebrow tone="on-brand">{t("eyebrow")}</Eyebrow>
                        <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[48px] lg:text-[56px]">
                            {t("title")}
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                            {t("subtitle")}
                        </p>
                    </Reveal>

                    <Reveal className="lg:col-span-4" delay={120}>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                            <Button href="/contact" size="lg" variant="on-brand" className="w-full sm:w-auto lg:w-full justify-center">
                                {t("primary")}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <a
                                href={`mailto:${SITE.email}`}
                                className="inline-flex h-12 w-full sm:w-auto lg:w-full items-center justify-center gap-2 rounded-[12px] border border-white/30 bg-white/0 px-6 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                                data-focus-ring
                            >
                                <Mail className="h-4 w-4" /> {t("secondary")}
                            </a>
                        </div>
                    </Reveal>
                </div>
            </Container>
        </section>
    );
}

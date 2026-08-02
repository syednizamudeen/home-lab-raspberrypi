import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "../ui/Button";
import { Reveal, RevealLine } from "../ui/Reveal";

/**
 * Section 01.
 *
 * Headline on the left, then one wide photograph of the Singapore CBD as a
 * full-bleed band. The photo is the "we are here" signal; the facts that used
 * to sit beside the headline (UEN, direct line, response time) now live in the
 * footer, where a visitor looks for them anyway.
 *
 * Photo: Skyline of Singapore Central Business District, Wikimedia Commons,
 * released CC0. https://commons.wikimedia.org/wiki/File:Skyline_of_Singapore_Central_Business_District_20250903.jpg
 * To swap it, drop a replacement at public/singapore-cbd.jpg at 2560×1028 or
 * wider, keeping roughly a 2.5:1 crop.
 */
export default function Hero() {
    const t = useTranslations("Hero");

    return (
        <section className="world-paper relative pt-14 sm:pt-20 lg:pt-24">
            <div className="shell">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <Reveal className="t-meta text-[var(--on-surface-3)]">{t("eyebrow")}</Reveal>

                        <h1 className="t-display-xl mt-8">
                            <RevealLine index={1}>{t("line_1")}</RevealLine>
                            <RevealLine index={2}>
                                <span className="relative inline-block">
                                    {t("line_2")}
                                    <span
                                        aria-hidden
                                        className="absolute inset-x-0 -bottom-1 h-[0.09em] bg-acid sm:-bottom-2"
                                    />
                                </span>
                            </RevealLine>
                        </h1>
                    </div>

                    <Reveal index={3} className="lg:col-span-4 lg:pt-6">
                        <p className="t-lead text-[var(--on-surface-2)]">{t("lead")}</p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <ButtonLink href="/contact" size="lg">
                                {t("cta_primary")}
                            </ButtonLink>
                            <ButtonLink href="/work" variant="outline" size="lg" arrow={false}>
                                {t("cta_secondary")}
                            </ButtonLink>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Full-bleed band. Taller crop on phones so the towers still read. */}
            <Reveal index={4} className="mt-14 sm:mt-20">
                <figure className="relative m-0 h-[min(52vh,340px)] w-full overflow-hidden sm:h-[min(48vh,420px)] lg:h-[min(56vh,520px)]">
                    <Image
                        src="/singapore-cbd.jpg"
                        alt={t("image_alt")}
                        fill
                        priority
                        sizes="100vw"
                        /* Bias the crop down: in a tall phone box, centring
                           this 2.5:1 frame fills it with sky. */
                        className="object-cover object-[center_68%] sm:object-[center_60%]"
                    />
                    {/* A warm paper wash top and bottom so the photo joins the
                        page instead of sitting on it like a pasted rectangle. */}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to bottom, var(--paper) 0%, transparent 18%, transparent 82%, var(--paper) 100%)",
                        }}
                    />
                </figure>
            </Reveal>
        </section>
    );
}

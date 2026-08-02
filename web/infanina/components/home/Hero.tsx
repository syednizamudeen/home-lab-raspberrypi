import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink } from "../ui/Button";
import { Reveal, RevealLine } from "../ui/Reveal";

/**
 * Section 01.
 *
 * Headline on the left, then a wide line drawing of the Singapore skyline as a
 * full-bleed band. The drawing is the "we are here" signal; the facts that used
 * to sit beside the headline (UEN, direct line, response time) now live in the
 * footer, where a visitor looks for them anyway.
 *
 * The drawing is generated line art on the site's own paper colour, so it is
 * placed at its natural aspect ratio with no crop and no gradient wash: the
 * background of the file and the background of the page are the same value
 * (sRGB 245,243,238), and the edges simply disappear.
 *
 * The source art and the exact rebuild command live in design/README.md; that
 * directory is versioned but neither served nor deployed. public/singapore-skyline.webp
 * is the processed result used here.
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

            {/* Full-bleed, uncropped. On phones the drawing is scaled up and
                anchored to the CBD end, because at 390px wide the full
                panorama would render the towers as illegible specks. */}
            <Reveal index={4} className="mt-12 sm:mt-16">
                <figure className="m-0 overflow-hidden">
                    <Image
                        src="/singapore-skyline.webp"
                        alt={t("image_alt")}
                        width={3082}
                        height={610}
                        priority
                        sizes="100vw"
                        /* Served byte-for-byte. The optimizer's lossy re-encode
                           shifts this drawing's flat background by a few values,
                           which shows as a seam against the page. The file is
                           already a 272KB palette-reduced lossless WebP. */
                        unoptimized
                        /* The art is trimmed to the ink, so it is now 5:1 and
                           very short. Phones zoom into the Marina Bay end
                           rather than showing the full panorama at 77px tall;
                           the empty water in the middle of the panorama is the
                           one part not worth cropping to. */
                        className="w-[240%] max-w-none sm:w-[150%] lg:w-full"
                    />
                </figure>
            </Reveal>
        </section>
    );
}

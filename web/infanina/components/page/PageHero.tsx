import { ReactNode } from "react";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { MeshBackdrop } from "../ui/MeshBackdrop";

export function PageHero({
    eyebrow,
    title,
    subtitle,
    children,
    withMesh = false,
}: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    children?: ReactNode;
    withMesh?: boolean;
}) {
    return (
        <section className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
            {withMesh && <MeshBackdrop />}
            <Container className="relative">
                <div className="max-w-3xl">
                    <Eyebrow>{eyebrow}</Eyebrow>
                    <h1 className="mt-5 font-display text-[44px] font-bold leading-[1.04] tracking-[-0.025em] text-[var(--color-text-primary)] sm:text-[56px] lg:text-[68px]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
                            {subtitle}
                        </p>
                    )}
                    {children && <div className="mt-8">{children}</div>}
                </div>
            </Container>
        </section>
    );
}

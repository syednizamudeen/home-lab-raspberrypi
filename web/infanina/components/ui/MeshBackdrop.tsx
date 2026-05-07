/**
 * Signature backdrop: Ocean Blue + Coral Pink + Tangerine mesh with subtle grain.
 * Animation respects prefers-reduced-motion (handled in globals.css).
 */
export function MeshBackdrop({ className = "" }: { className?: string }) {
    return <div aria-hidden className={`mesh-backdrop ${className}`} />;
}

/**
 * The signature of the site: the hard edge where paper becomes void. Carries a
 * single acid hairline and the marker the header measures to invert itself.
 * No gradient, no fade, no transition band.
 */
export function WorldCut({ label }: { label?: string }) {
    return (
        <div data-world-cut className="world-void">
            <hr className="world-cut" />
            {label && (
                <div className="shell">
                    <p className="t-meta py-4 text-[var(--on-surface-3)]">{label}</p>
                </div>
            )}
        </div>
    );
}

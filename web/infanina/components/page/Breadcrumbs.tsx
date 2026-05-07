import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { Container } from "../ui/Container";

export interface Crumb {
    name: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <Container className="pt-6">
            <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--color-text-muted)]">
                    {items.map((item, i) => {
                        const last = i === items.length - 1;
                        return (
                            <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
                                {item.href && !last ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-[var(--color-brand)] transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ) : (
                                    <span aria-current={last ? "page" : undefined} className={last ? "text-[var(--color-text-secondary)]" : ""}>
                                        {item.name}
                                    </span>
                                )}
                                {!last && <ChevronRight className="h-3 w-3 opacity-60" />}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </Container>
    );
}

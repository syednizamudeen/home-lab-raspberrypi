import { ReactNode } from "react";

export function Container({
    children,
    className = "",
    as: Tag = "div",
}: {
    children: ReactNode;
    className?: string;
    as?: keyof React.JSX.IntrinsicElements;
}) {
    const Component = Tag as React.ElementType;
    return (
        <Component className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10 ${className}`}>
            {children}
        </Component>
    );
}

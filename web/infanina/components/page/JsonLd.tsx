type Node = Record<string, unknown>;

/**
 * Emits structured data as one `<script>` per schema node.
 *
 * A single script holding a JSON *array* is legal for crawlers but breaks
 * consumers that expect an object at the root, including the Next.js dev-tools
 * structured-data inspector, which reads `data["@context"]` and throws on an
 * array. Separate scripts are the shape every consumer handles.
 */
export function JsonLd({ data }: { data: Node | Node[] }) {
    const nodes = Array.isArray(data) ? data : [data];

    return (
        <>
            {nodes.filter(Boolean).map((node, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
                />
            ))}
        </>
    );
}

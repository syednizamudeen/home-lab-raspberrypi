/**
 * What we build.
 *
 * These are build definitions, not delivered case studies. Every string that
 * describes an outcome lives in messages/*.json under `Work.projects.*` and is
 * written in the language of scope and method, never of results we cannot
 * evidence. A project only gains numbers or a client name once that client has
 * signed off on them, at which point `status` becomes "published".
 */

export type Discipline = "web" | "mobile" | "automation";

export interface Project {
    slug: string;
    /** Key under `Work.projects` in messages/*.json. */
    i18nKey: string;
    index: string;
    discipline: Discipline;
    /** "published" carries a real client engagement. "template" is a build shape. */
    status: "published" | "template";
    /** Typical delivery window for this shape of work. */
    timeline: string;
    stack: string[];
    /** Number of scope bullets in the messages file, so the page can map over them. */
    scopeCount: number;
}

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
    web: "Web platform",
    mobile: "Mobile app",
    automation: "AI automation",
};

export const projects: Project[] = [
    {
        slug: "operations-platform",
        i18nKey: "operations_platform",
        index: "01",
        discipline: "web",
        status: "template",
        timeline: "8–12 weeks",
        stack: ["Next.js", "TypeScript", "PostgreSQL", "Role-based access", "Audit log"],
        scopeCount: 4,
    },
    {
        slug: "customer-mobile-app",
        i18nKey: "customer_mobile_app",
        index: "02",
        discipline: "mobile",
        status: "template",
        timeline: "10–16 weeks",
        stack: ["React Native", "Offline-first sync", "Push", "App Store + Play release"],
        scopeCount: 4,
    },
    {
        slug: "document-automation",
        i18nKey: "document_automation",
        index: "03",
        discipline: "automation",
        status: "template",
        timeline: "4–8 weeks",
        stack: ["Claude", "OCR", "Confidence thresholds", "Human review queue"],
        scopeCount: 4,
    },
    {
        slug: "messaging-assistant",
        i18nKey: "messaging_assistant",
        index: "04",
        discipline: "automation",
        status: "template",
        timeline: "6–10 weeks",
        stack: ["WhatsApp Business API", "Claude", "Escalation to a human", "CRM sync"],
        scopeCount: 4,
    },
];

/** Reserved rows in the work index, held for real engagements. */
export const RESERVED_SLOTS = 2;

export function getProject(slug: string): Project | undefined {
    return projects.find((p) => p.slug === slug);
}

export function getRelated(slug: string): Project[] {
    const current = getProject(slug);
    if (!current) return [];
    return projects.filter((p) => p.slug !== slug).slice(0, 2);
}

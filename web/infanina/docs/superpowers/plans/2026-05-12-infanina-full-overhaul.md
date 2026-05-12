# Infanina Full Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the full Infanina site overhaul defined in `docs/superpowers/specs/2026-05-12-infanina-full-overhaul-design.md` — engineer-confident Direction A with the A1 (Carbon + Ocean) palette, Geist + Inter + Geist Mono typography, dark-first theming, all 8 routes restyled, new `/work/[slug]` route, new Testimonials and Engagements sections, and per-case-study deep dives.

**Architecture:** Token-first redesign. Step 1 swaps design tokens and fonts so every page inherits the new look without touching component code. Step 2 rebuilds the UI primitives (Button, Card, Section, Eyebrow, Logo) and adds 8 new primitives (StatusBar, MonoMeta, Terminal, TimelineRail, MetricBlock, GridBackdrop, CodeChip, Marquee). Steps 3-6 rebuild chrome, then home sections, then secondary pages, then the new case study route. The site is intentionally never left in a broken half-state — every commit produces a renderable build.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, next-intl, next-themes, lucide-react, Geist + Inter + Geist Mono via `next/font/google`.

---

## Cross-cutting conventions

**No test runner.** This repo has no Jest/Vitest/Playwright configuration (per `CLAUDE.md`). The verification step for every task is:
1. `npm run lint` — must be clean
2. `npm run build` — must succeed
3. Manual visual check via `npm run dev` at `http://localhost:3000` — verify the touched route renders in both dark and light, and (when chrome changes) in `/ar` for RTL.

If a task introduces a non-trivial pure function (e.g. timeline-shape encoder), add an inline `console.assert(...)` in dev or write a tiny `.test.ts` file using Node's built-in `node:test` and run with `node --test path/to/file.test.ts`. Otherwise skip tests.

**i18n discipline (load-bearing — from CLAUDE.md).** Every key added to `messages/en.json` MUST be mirrored in `ms.json`, `zh.json`, `ta.json`, `ar.json` in the same commit. For non-English locales without a real translation, **copy the EN value verbatim** as a placeholder and log the key path in `messages/.review.md`. Never leave a key missing in any locale — `useTranslations` will throw at render.

**Locale-aware navigation (from CLAUDE.md).** Import `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` from `@/i18n/routing` — never from `next/link` or `next/navigation`. Otherwise the locale prefix is lost.

**RTL.** Use Tailwind logical properties (`ps-*`, `pe-*`, `start-*`, `end-*`, `ms-*`, `me-*`) for any spacing/positioning that should flip in Arabic. Decorative directional flourishes (arrows, scanlines) get an explicit RTL override or `aria-hidden` if cosmetic only.

**Path aliases.** `@/*` resolves to repo root (`/Users/syednizamudeen/www/home-lab/web/infanina/`). So `@/components/ui/Button` = `components/ui/Button.tsx`.

**Commit convention** (matches recent log): conventional commits, lowercase, `feat:` / `fix:` / `chore:` / `refactor:` / `docs:` / `style:`. Co-author line per system instructions.

**Working directory** for all commands: `/Users/syednizamudeen/www/home-lab/web/infanina/`.

---

## File structure overview

### Will create (new files)

```
components/ui/StatusBar.tsx            slim status bar with mono metadata
components/ui/MonoMeta.tsx             mono caption block (eyebrow + asides)
components/ui/Terminal.tsx             terminal frame with typewriter lines
components/ui/TimelineRail.tsx         vertical ticked timeline rail
components/ui/MetricBlock.tsx          numeric callout (uses existing CountUp)
components/ui/GridBackdrop.tsx         CSS-grid + scanline backdrop
components/ui/CodeChip.tsx             mono pill for tags
components/ui/Marquee.tsx              extracted scrolling strip
components/home/TrustedBy.tsx          extracted industry-marquee band
components/home/Engagements.tsx        services × packages merger
components/home/Testimonials.tsx       3-quote section
components/work/CaseStudyHero.tsx      slug page hero
components/work/CaseStudyBody.tsx      slug page narrative
components/work/CaseStudyMetrics.tsx   slug page metric row
components/work/CaseFilter.tsx         /work index filter chips
app/[locale]/work/[slug]/page.tsx      dynamic case study route
lib/cases/index.ts                     typed Case[] + helpers
lib/cases/fb-chain.ts                  case data: F&B chain
lib/cases/fintech-kyc.ts               case data: fintech KYC
lib/cases/retail-analytics.ts          case data: retail analytics
messages/.review.md                    translation review log
```

### Will modify (existing files)

```
.gitignore                              add .superpowers/
app/globals.css                         replace tokens; add mono utilities; mesh → grid
app/[locale]/layout.tsx                 swap fonts to Geist + Geist Mono; defaultTheme="dark"
app/[locale]/page.tsx                   new section order (Hero → TrustedBy → ValueProps → Engagements → AIShowcase → SelectedWork → Testimonials → Stats → CTABand)
app/[locale]/services/page.tsx          new system; FAQ + ownership additions
app/[locale]/products/page.tsx          new system; installation timeline addition
app/[locale]/work/page.tsx              new system; filter; links to /work/[slug]
app/[locale]/about/page.tsx             new system; "Where we work" addition
app/[locale]/contact/page.tsx           new system; mono side-panel
app/[locale]/privacy/page.tsx           new system (light touch)
app/[locale]/terms/page.tsx             new system (light touch)
app/sitemap.ts                          extend with case study slugs
components/ThemeProvider.tsx            defaultTheme="dark" via props passthrough (no API change)
components/layout/Header.tsx            minimal restyle, mono nav, scroll behavior kept
components/layout/Footer.tsx            4-col restructure, mono copyright
components/contact/ContactForm.tsx      restyle chrome; success state as Terminal
components/page/PageHero.tsx            adopt GridBackdrop; mono eyebrow
components/page/Breadcrumbs.tsx         mono styling
components/ui/Button.tsx                mint primary in dark; add `kbd` variant
components/ui/Card.tsx                  flatter; mono top-edge accent
components/ui/Section.tsx               left guide ruler with mono numbering
components/ui/Eyebrow.tsx               default mono variant; preserve `display`
components/ui/Logo.tsx                  Geist 700; brand→mint gradient
components/home/Hero.tsx                two-col rebuild with Terminal on lg
components/home/ValueProps.tsx          restyle to flat cards + mono accent rule
components/home/ServicesOverview.tsx    repurpose for /services detail (kept file)
components/home/AIShowcase.tsx          wrap chat in Terminal chrome
components/home/SelectedWork.tsx        link to /work/[slug]; add MetricBlock
components/home/Stats.tsx               MetricBlock row on horizontal rule
components/home/CTABand.tsx             calmer; no brand-color flood
i18n/routing.ts                         add /work/[slug] pathname
lib/seo.ts                              add caseStudyJsonLd helper
messages/en.json                        new keys (canonical)
messages/ms.json                        new keys (EN placeholder + .review.md entry)
messages/zh.json                        new keys (EN placeholder + .review.md entry)
messages/ta.json                        new keys (EN placeholder + .review.md entry)
messages/ar.json                        new keys (EN placeholder + .review.md entry)
```

### Will delete

```
components/ui/MeshBackdrop.tsx          replaced by GridBackdrop (after all callers migrate)
```

---

## Phase 1 — Foundation

### Task 1: Add `.superpowers/` to .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Read current .gitignore to find a sensible insertion point**

Run: `cat .gitignore`
Expected: existing file with `node_modules`, `.next`, etc.

- [ ] **Step 2: Append `.superpowers/` block**

Edit `.gitignore`, append at end (after the `next-env.d.ts` line):

```
# superpowers brainstorming workspace
.superpowers/
```

- [ ] **Step 3: Verify**

Run: `git status`
Expected: `.superpowers/` no longer listed as untracked.

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "$(cat <<'EOF'
chore: ignore .superpowers/ brainstorming workspace

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Replace design tokens in globals.css

**Files:**
- Modify: `app/globals.css`

This is the single biggest visual change. Replaces the Ocean tokens with the A1 (Carbon + Ocean) palette: keeps Ocean Blue as brand, adds mint as the engineering accent, tightens radius and shadow. Light mode is preserved with current paper-toned surfaces but gains a darker mint variant for AA contrast. Keeps `MeshBackdrop` CSS for now — it will be removed in Task 9 after callers migrate.

- [ ] **Step 1: Replace the `:root` block**

In `app/globals.css`, replace the entire `:root { ... }` block (lines ~11-57 in the current file) with:

```css
:root {
    /* Brand */
    --color-brand: #007CBE;
    --color-brand-hover: #0069A1;
    --color-brand-active: #005B8C;
    --color-brand-subtle-bg: rgba(0, 124, 190, 0.10);
    --color-brand-on: #FFFFFF;

    /* New engineering accent */
    --color-mint: #0E9F86;
    --color-mint-soft: rgba(14, 159, 134, 0.12);

    /* Semantic */
    --color-success: #16A34A;
    --color-warning: #FBAF00;
    --color-attention: #C2410C;
    --color-coral: #FFA3AF;
    --color-danger: #E5484D;

    /* Surfaces (light) */
    --color-surface-0: #F8F8F6;
    --color-surface-1: #FFFFFF;
    --color-surface-2: #F2F4F1;
    --color-surface-3: #E7E5E4;

    /* Text (light) */
    --color-text-primary: #0B0B0C;
    --color-text-secondary: #3F3F46;
    --color-text-muted: #71717A;
    --color-text-on-brand: #FFFFFF;

    /* Borders (light) */
    --color-border-subtle: #EDECE8;
    --color-border-default: #D4D4D4;
    --color-border-strong: #A1A1AA;

    /* Shadows — engineering aesthetic = less elevation */
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-md: 0 4px 6px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(15, 23, 42, 0.06);
    --shadow-lg: 0 12px 24px rgba(15, 23, 42, 0.08), 0 24px 40px rgba(15, 23, 42, 0.10);
    --shadow-brand: 0 10px 24px rgba(0, 124, 190, 0.22);

    /* Radius — tighter */
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;

    /* Aliases used by Tailwind utilities */
    --background: var(--color-surface-0);
    --foreground: var(--color-text-primary);
}
```

- [ ] **Step 2: Replace the `.dark` block**

Replace the entire `.dark { ... }` block (lines ~59-85) with:

```css
.dark {
    /* Brand — lifted for dark surfaces */
    --color-brand: #38BDF8;
    --color-brand-hover: #5BC8FB;
    --color-brand-active: #7DD3FC;
    --color-brand-subtle-bg: rgba(56, 189, 248, 0.14);

    /* Mint — brighter accent in dark */
    --color-mint: #71F2DA;
    --color-mint-soft: rgba(113, 242, 218, 0.14);

    /* Semantic in dark */
    --color-success: #22C55E;
    --color-warning: #FBAF00;
    --color-attention: #FB923C;
    --color-coral: #FCA5A5;

    /* Surfaces (dark canonical) */
    --color-surface-0: #0A0D12;
    --color-surface-1: #0E1422;
    --color-surface-2: #16203A;
    --color-surface-3: #1F2A48;

    /* Text (dark) */
    --color-text-primary: #ECEEF2;
    --color-text-secondary: #B4BAC6;
    --color-text-muted: #7E8AA1;

    /* Borders (dark) */
    --color-border-subtle: #1B2436;
    --color-border-default: #243049;
    --color-border-strong: #2E3B58;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.45);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(0, 0, 0, 0.45);
    --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.55), 0 24px 60px rgba(0, 0, 0, 0.60);
    --shadow-brand: 0 12px 30px rgba(56, 189, 248, 0.30);

    --background: var(--color-surface-0);
    --foreground: var(--color-text-primary);
}
```

- [ ] **Step 3: Extend the `@theme inline` block with mint**

Inside the existing `@theme inline { ... }` block, add these lines just after `--color-brand-subtle: var(--color-brand-subtle-bg);`:

```css
    --color-mint: var(--color-mint);
    --color-mint-soft: var(--color-mint-soft);
```

- [ ] **Step 4: Run lint + build**

```bash
npm run lint
npm run build
```

Expected: both clean. Old components will render with the new palette automatically (Tailwind utilities reference the same CSS var names).

- [ ] **Step 5: Visual spot-check**

```bash
npm run dev
```

Open `http://localhost:3000` and click the theme toggle. The site should now feel cooler — darker carbon surfaces in dark, slightly off-white paper in light. Existing components are not redesigned yet; expect them to look "old design, new colors".

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
style: replace design tokens with A1 carbon + ocean palette

Adds mint engineering accent, tightens radius and shadow, swaps dark
surfaces to carbon, light to paper-tone. Pre-existing components keep
working unchanged; their colors shift automatically via CSS vars.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Add CSS utilities for new design language

**Files:**
- Modify: `app/globals.css`

Adds the engineering-aesthetic utilities the new primitives will rely on: grid backdrop, tick cursor, vertical guide ruler, monospace `kbd` cap. Keeps existing utilities (mesh-backdrop, marquee, reveal, hero-stagger, pulse-dot, brand-mark, focus-ring) untouched until callers migrate.

- [ ] **Step 1: Append new utilities at end of globals.css (after the existing `html[dir="rtl"] .marquee` block)**

```css
/* =============================================================
   Engineer-confident utilities
   ============================================================= */

/* Grid + scanline backdrop — replaces mesh-backdrop on hero/page heroes */
.grid-backdrop {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
}
.grid-backdrop::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(var(--color-border-subtle) 1px, transparent 1px),
        linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 60% at 50% 40%, black 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse 90% 60% at 50% 40%, black 0%, transparent 75%);
    opacity: 0.55;
}
.grid-backdrop::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, var(--color-mint-soft) 50%, transparent 100%);
    height: 18%;
    animation: scanline-drift 14s linear infinite;
    opacity: 0.7;
}
@keyframes scanline-drift {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(800%); }
}

/* Blinking block cursor — used after mono captions */
.tick-cursor::after {
    content: "▍";
    display: inline-block;
    margin-inline-start: 2px;
    color: var(--color-mint);
    animation: tick 1.05s steps(1) infinite;
}
@keyframes tick {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}

/* Vertical guide ruler — Section left edge mono numbering */
.guide-ruler {
    position: absolute;
    inset-block: 1.5rem;
    inset-inline-start: 0;
    width: 1px;
    background: var(--color-border-subtle);
}
.guide-ruler::before {
    content: attr(data-num);
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 8px;
    font-family: var(--font-geist-mono), ui-monospace, monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--color-text-muted);
    white-space: nowrap;
}

/* Keyboard cap shadow (used in Button kbd variant) */
.kbd-cap {
    box-shadow:
        inset 0 -1px 0 var(--color-border-strong),
        inset 0 0 0 1px var(--color-border-subtle),
        0 1px 0 var(--color-border-subtle);
}

/* Mono utility — sets font-family without weight/size opinions */
.font-mono {
    font-family: var(--font-geist-mono), ui-monospace, "SF Mono", monospace;
    font-feature-settings: "ss01", "zero";
}

/* Reduced motion for new utilities */
@media (prefers-reduced-motion: reduce) {
    .grid-backdrop::after { animation: none; opacity: 0; }
    .tick-cursor::after { animation: none; opacity: 1; }
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint
npm run build
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
style: add engineering-confident CSS utilities

grid-backdrop, tick-cursor, guide-ruler, kbd-cap, font-mono.
Reduced-motion variants included.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Swap fonts to Geist + Geist Mono and set dark as default

**Files:**
- Modify: `app/[locale]/layout.tsx`

Geist (display) replaces Space Grotesk; Inter is kept for body; Geist Mono is added for system/status text. `defaultTheme` flips to `"dark"`. `themeColor` viewport hint updated to match the new carbon surface.

- [ ] **Step 1: Replace font imports and instantiation**

In `app/[locale]/layout.tsx`, replace the import line `import { Space_Grotesk, Inter } from "next/font/google";` and the two `const spaceGrotesk = ...` / `const inter = ...` blocks (lines 5, 18-30) with:

```ts
import { Geist, Geist_Mono, Inter } from "next/font/google";

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"],
    display: "swap",
    weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
});
```

- [ ] **Step 2: Update the html className to include all three font variables**

In the same file, replace the existing `className={\`${spaceGrotesk.variable} ${inter.variable}\`}` on the `<html>` element with:

```tsx
className={`${geist.variable} ${geistMono.variable} ${inter.variable}`}
```

- [ ] **Step 3: Update the dark-mode `themeColor` to match the new carbon surface**

Replace the `viewport` export's dark entry from `color: "#0A1220"` to `color: "#0A0D12"`.

- [ ] **Step 4: Set ThemeProvider default to dark**

In the same file, change:
```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
```
to:
```tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
```

The user's stored theme preference (if any) still wins; only first-visit users without a `prefers-color-scheme` signal switch to dark.

- [ ] **Step 5: Update globals.css font tokens to reference Geist**

Open `app/globals.css`. In the `@theme inline` block, replace:

```css
    --font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
    --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
```

with:

```css
    --font-display: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
    --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    --font-mono: var(--font-geist-mono), ui-monospace, "SF Mono", monospace;
```

Then in the body `font-family` declaration (around line 130) replace the `var(--font-inter), ui-sans-serif, ...` chain with the same (no change), and in the `.font-display` declaration replace `var(--font-space-grotesk)` with `var(--font-geist)`.

- [ ] **Step 6: Lint + build**

```bash
npm run lint
npm run build
```

Expected: build downloads Geist and Geist Mono on first run.

- [ ] **Step 7: Visual check — fonts + dark default**

```bash
npm run dev
```

Open `http://localhost:3000` in a fresh incognito window (so no stored theme cookie). Expect: dark mode by default, headings render in Geist (tighter, more geometric than Space Grotesk), body unchanged.

- [ ] **Step 8: Commit**

```bash
git add app/[locale]/layout.tsx app/globals.css
git commit -m "$(cat <<'EOF'
feat: swap to geist + geist mono fonts, default theme dark

Geist replaces Space Grotesk as display; Geist Mono added for system
text. Default theme is dark; system preference still honored when set.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — UI primitives (revise + new)

Each task below is independent and committable on its own. They can be executed in any order within Phase 2.

### Task 5: Create `GridBackdrop` and migrate callers off `MeshBackdrop`

**Files:**
- Create: `components/ui/GridBackdrop.tsx`
- Modify: `components/home/Hero.tsx`, `components/page/PageHero.tsx`
- Delete: `components/ui/MeshBackdrop.tsx` (last)

- [ ] **Step 1: Create `GridBackdrop`**

Write `components/ui/GridBackdrop.tsx`:

```tsx
export function GridBackdrop({ className = "" }: { className?: string }) {
    return <div aria-hidden className={`grid-backdrop ${className}`} />;
}
```

- [ ] **Step 2: Update `components/home/Hero.tsx` imports**

Replace `import { MeshBackdrop } from "../ui/MeshBackdrop";` with `import { GridBackdrop } from "../ui/GridBackdrop";` and replace `<MeshBackdrop />` with `<GridBackdrop />`. (Hero is fully rebuilt in Task 22, but keep it renderable in the meantime.)

- [ ] **Step 3: Update `components/page/PageHero.tsx` imports**

Replace `import { MeshBackdrop } from "../ui/MeshBackdrop";` with `import { GridBackdrop } from "../ui/GridBackdrop";` and replace `{withMesh && <MeshBackdrop />}` with `{withMesh && <GridBackdrop />}`. (The prop name is retained for now; PageHero is refactored in Task 31.)

- [ ] **Step 4: Delete `MeshBackdrop.tsx`**

```bash
rm components/ui/MeshBackdrop.tsx
```

- [ ] **Step 5: Lint + build**

```bash
npm run lint && npm run build
```

Expected: clean. The `.mesh-backdrop` CSS in `globals.css` is now unused but harmless — leave it; it will be removed in the final cleanup (Task 47).

- [ ] **Step 6: Commit**

```bash
git add components/ui/GridBackdrop.tsx components/home/Hero.tsx components/page/PageHero.tsx
git rm components/ui/MeshBackdrop.tsx
git commit -m "$(cat <<'EOF'
refactor(ui): replace MeshBackdrop with GridBackdrop

GridBackdrop is the new engineering-aesthetic backdrop: 1px CSS grid
with center fade mask and a slow mint scanline. Replaces the soft
gradient mesh on Hero and PageHero.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Revise `Button` — mint primary in dark, add `kbd` variant

**Files:**
- Modify: `components/ui/Button.tsx`

- [ ] **Step 1: Replace VARIANT, SIZE, and BASE constants**

Replace the existing `VARIANT`, `SIZE`, `BASE` constants and the `Variant`/`Size` types in `components/ui/Button.tsx` with:

```tsx
type Variant = "primary" | "secondary" | "ghost" | "on-brand" | "kbd";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
    primary:
        "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-active)] dark:bg-[var(--color-mint)] dark:text-[var(--color-surface-0)] dark:hover:bg-[var(--color-mint)] dark:hover:brightness-110",
    secondary:
        "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-text-primary)]",
    ghost:
        "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]",
    "on-brand":
        "bg-white text-[var(--color-brand)] hover:bg-white/90",
    kbd:
        "kbd-cap font-mono bg-[var(--color-surface-1)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]",
};

const SIZE: Record<Size, string> = {
    sm: "h-9 px-3.5 text-[13px]",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-[15px]",
};

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold whitespace-nowrap transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-brand-subtle-bg)] disabled:opacity-50 disabled:cursor-not-allowed";
```

(Removed `shadow-[var(--shadow-brand)]` from primary and the `hover:-translate-y-0.5` micro-lift — flatter, sharper engineering feel.)

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Visual check**

Run `npm run dev`. Verify primary buttons render mint-on-carbon in dark and brand-on-white in light. Hover should darken/brighten subtly with no lift.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "$(cat <<'EOF'
refactor(ui): restyle Button for engineering aesthetic

Primary becomes mint-on-carbon in dark. Removes shadow + hover lift
(flatter feel). Adds 'kbd' variant for keyboard-cap inline hints and
'sm' size for tight inline use.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Revise `Card` — flat, sharp border, mono top-edge accent

**Files:**
- Modify: `components/ui/Card.tsx`

- [ ] **Step 1: Replace contents of `components/ui/Card.tsx`**

```tsx
import { ReactNode } from "react";

type Accent = "none" | "brand" | "mint" | "warn" | "coral";

interface CardProps {
    children: ReactNode;
    className?: string;
    interactive?: boolean;
    accent?: Accent;
}

const ACCENT_RULE: Record<Accent, string> = {
    none: "",
    brand: "before:bg-[var(--color-brand)]",
    mint: "before:bg-[var(--color-mint)]",
    warn: "before:bg-[var(--color-warning)]",
    coral: "before:bg-[var(--color-coral)]",
};

export function Card({
    children,
    className = "",
    interactive = false,
    accent = "none",
}: CardProps) {
    const interactiveCls = interactive
        ? "transition-colors duration-150 hover:border-[var(--color-text-primary)] dark:hover:border-[var(--color-mint)]"
        : "";

    const accentCls =
        accent !== "none"
            ? `relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:scale-x-0 before:origin-start hover:before:scale-x-100 before:transition-transform before:duration-300 ${ACCENT_RULE[accent]}`
            : "";

    return (
        <div
            className={`group relative rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 sm:p-7 ${interactiveCls} ${accentCls} ${className}`}
        >
            {children}
        </div>
    );
}
```

Notes:
- Default shadow removed; cards rely on the border for separation.
- Accent is now a hairline top rule that draws in on hover (engineering documentation feel) instead of a side-bar fill.
- New `mint` and `warn` variants; `attention` renamed to `warn`.

- [ ] **Step 2: Search for callers using the old `attention` accent and rename**

```bash
grep -rn 'accent="attention"' app/ components/
```

Expected callers: `components/home/ServicesOverview.tsx`, `app/[locale]/services/page.tsx`, `app/[locale]/products/page.tsx`.

For each match, change `accent="attention"` to `accent="warn"`.

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/Card.tsx components/home/ServicesOverview.tsx app/[locale]/services/page.tsx app/[locale]/products/page.tsx
git commit -m "$(cat <<'EOF'
refactor(ui): flatten Card; replace shadow with hairline accent

Removes default shadow; uses 1px border for separation. Accent becomes
a hairline top rule that draws in on hover. Renames 'attention' accent
to 'warn'; adds 'mint' variant.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Revise `Section` — left guide ruler with mono numbering

**Files:**
- Modify: `components/ui/Section.tsx`

- [ ] **Step 1: Replace `components/ui/Section.tsx`**

```tsx
import { ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps {
    children: ReactNode;
    id?: string;
    className?: string;
    innerClassName?: string;
    tone?: "default" | "muted" | "brand";
    bare?: boolean;
    /** Two-character section number rendered on the left guide ruler (e.g. "01", "02"). Omit to hide ruler. */
    num?: string;
}

const TONE_BG: Record<NonNullable<SectionProps["tone"]>, string> = {
    default: "bg-[var(--color-surface-0)]",
    muted: "bg-[var(--color-surface-2)]",
    brand: "bg-[var(--color-brand)] text-[var(--color-text-on-brand)]",
};

export function Section({
    children,
    id,
    className = "",
    innerClassName = "",
    tone = "default",
    bare = false,
    num,
}: SectionProps) {
    return (
        <section
            id={id}
            className={`relative isolate ${TONE_BG[tone]} ${bare ? "" : "py-20 sm:py-24 lg:py-28"} ${className}`}
        >
            {num && (
                <div
                    aria-hidden
                    className="guide-ruler hidden lg:block"
                    data-num={`// ${num}`}
                />
            )}
            <Container className={innerClassName}>{children}</Container>
        </section>
    );
}
```

The `num` prop is optional and additive — existing callers continue to render correctly without it.

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/Section.tsx
git commit -m "$(cat <<'EOF'
refactor(ui): add optional left guide ruler to Section

Sections can now opt-in to mono numbering on the left edge via the new
'num' prop, giving the engineering-documentation feel. Existing callers
are unaffected.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Revise `Eyebrow` — mono default, preserve display variant

**Files:**
- Modify: `components/ui/Eyebrow.tsx`

- [ ] **Step 1: Replace `components/ui/Eyebrow.tsx`**

```tsx
import { ReactNode } from "react";

type Variant = "mono" | "display";
type Tone = "brand" | "mint" | "muted" | "on-brand";

const TONE_CLS: Record<Tone, string> = {
    brand: "text-[var(--color-brand)]",
    mint: "text-[var(--color-mint)]",
    muted: "text-[var(--color-text-muted)]",
    "on-brand": "text-white/85",
};

export function Eyebrow({
    children,
    className = "",
    variant = "mono",
    tone = "mint",
    prefix = "//",
}: {
    children: ReactNode;
    className?: string;
    variant?: Variant;
    tone?: Tone;
    /** Mono variant prefix (default '//'). Set empty to omit. */
    prefix?: string;
}) {
    if (variant === "display") {
        return (
            <span
                className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${TONE_CLS[tone]} ${className}`}
            >
                <span className="h-px w-6 bg-current opacity-60" aria-hidden />
                {children}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-2 font-mono text-[11px] lowercase tracking-[0.04em] ${TONE_CLS[tone]} ${className}`}
        >
            {prefix && <span aria-hidden className="opacity-70">{prefix}</span>}
            {children}
        </span>
    );
}
```

Default variant becomes `"mono"` with default tone `"mint"`. Existing callers default to mono.

- [ ] **Step 2: Audit eyebrow tone choices**

Run `grep -rn "<Eyebrow" components/ app/` and verify the choices read reasonably with the new defaults. Most calls pass children and rely on defaults — those now show mono with a `//` prefix in mint. The CTABand call uses `tone="on-brand"` which is preserved.

If any specific call would look better with the old serif underline-and-uppercase look, set `variant="display"` explicitly. Default decision: do NOT change call sites — let them inherit mono. The home page Hero gets its own custom eyebrow inside the Hero rebuild.

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/Eyebrow.tsx
git commit -m "$(cat <<'EOF'
refactor(ui): default Eyebrow to mono variant with mint tone

Mono with '//' prefix becomes the section eyebrow across the site.
'display' variant preserved for the rare case where the underline-
and-uppercase treatment still fits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Revise `Logo` — Geist 700, brand→mint gradient

**Files:**
- Modify: `components/ui/Logo.tsx`

- [ ] **Step 1: Replace `components/ui/Logo.tsx`**

```tsx
import { Link } from "@/i18n/routing";

export function Logo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
    return (
        <Link
            href="/"
            onClick={onClick}
            className={`inline-flex items-center gap-2 group ${className}`}
            aria-label="Infanina home"
        >
            <span aria-hidden className="relative">
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none" className="block">
                    <rect x="3" y="3" width="22" height="22" rx="5" fill="var(--color-brand)" />
                    <path
                        d="M9 19V11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5V13.5C14 14.8807 15.1193 16 16.5 16C17.8807 16 19 14.8807 19 13.5"
                        stroke="white"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                    />
                </svg>
            </span>
            <span className="font-display text-[19px] font-bold tracking-tight bg-[linear-gradient(110deg,var(--color-brand)_0%,var(--color-brand)_55%,var(--color-mint)_100%)] bg-clip-text text-transparent">
                infanina
            </span>
        </Link>
    );
}
```

Removes the coral-blur hover halo. Wordmark uses a brand→mint gradient (replaces the old brand-mark utility that mixed in coral).

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/Logo.tsx
git commit -m "$(cat <<'EOF'
refactor(ui): logo wordmark uses brand→mint gradient

Drops coral-blur hover. Mark icon corner radius tightened to 5px to
match the new system radii.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Create `StatusBar`

**Files:**
- Create: `components/ui/StatusBar.tsx`

A slim, mono status bar mounted at the top of the layout. Renders an animated SGT clock (client-only after mount to avoid hydration drift), a green live dot, and a small build-version label.

- [ ] **Step 1: Write `components/ui/StatusBar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

interface StatusBarProps {
    /** Build version label (e.g. "v2026.05"). */
    version?: string;
    className?: string;
}

function useSgtTime() {
    const [time, setTime] = useState<string | null>(null);
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const sgt = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Asia/Singapore",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }).format(now);
            setTime(`${sgt} SGT`);
        };
        tick();
        const id = window.setInterval(tick, 30_000);
        return () => window.clearInterval(id);
    }, []);
    return time;
}

export function StatusBar({ version = "v2026.05", className = "" }: StatusBarProps) {
    const time = useSgtTime();
    return (
        <div
            className={`hidden md:flex items-center gap-3 font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)] ${className}`}
            aria-label="System status"
            dir="ltr"
        >
            <span className="inline-flex items-center gap-1.5">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                <span className="text-[var(--color-success)]">online</span>
            </span>
            <span aria-hidden className="opacity-40">·</span>
            <span>infanina.studio / sg</span>
            {time && (
                <>
                    <span aria-hidden className="opacity-40">·</span>
                    <span suppressHydrationWarning>{time}</span>
                </>
            )}
            <span aria-hidden className="opacity-40">·</span>
            <span>{version}</span>
        </div>
    );
}
```

`dir="ltr"` is intentional — the system metadata is technical text that reads better LTR even in Arabic context. The clock only renders client-side so SSR/CSR don't disagree.

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/StatusBar.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add StatusBar primitive

Slim mono status bar with SGT clock, live dot, and build version label.
Used inside the Hero and Header. Client-only clock to avoid hydration
drift; LTR-locked for technical metadata.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Create `MonoMeta`

**Files:**
- Create: `components/ui/MonoMeta.tsx`

A reusable mono caption block used for "last updated", breadcrumbs, side metadata, etc. Different shape from `Eyebrow` — multi-line, can include `<dt>/<dd>` pairs.

- [ ] **Step 1: Write `components/ui/MonoMeta.tsx`**

```tsx
import type { ReactNode } from "react";

export interface MonoMetaItem {
    label: string;
    value: ReactNode;
}

export function MonoMeta({
    items,
    className = "",
}: {
    items: MonoMetaItem[];
    className?: string;
}) {
    return (
        <dl className={`grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 font-mono text-[12px] ${className}`} dir="ltr">
            {items.map(({ label, value }) => (
                <div key={label} className="contents">
                    <dt className="text-[var(--color-text-muted)] lowercase tracking-[0.04em]">{label}</dt>
                    <dd className="text-[var(--color-text-secondary)]">{value}</dd>
                </div>
            ))}
        </dl>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/MonoMeta.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add MonoMeta primitive

Mono dt/dd grid for technical metadata blocks (last-updated, contact
side panel, case-study aside).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Create `Terminal`

**Files:**
- Create: `components/ui/Terminal.tsx`

A terminal-style chrome with a 3-dot header. Used twice on the home page (hero right column, AIShowcase wrapping). Supports a typewriter mode that auto-types an array of lines on mount.

- [ ] **Step 1: Write `components/ui/Terminal.tsx`**

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";

interface TerminalProps {
    /** Label rendered in the chrome header (e.g. "infanina-assistant"). */
    label?: string;
    /** Lines auto-typed in sequence. Omit to render `children` instead. */
    typewriterLines?: string[];
    /** When true (default), the cursor blinks after typing completes. */
    cursor?: boolean;
    /** Optional static body — used when typewriterLines is omitted. */
    children?: ReactNode;
    className?: string;
}

export function Terminal({
    label = "infanina:~",
    typewriterLines,
    cursor = true,
    children,
    className = "",
}: TerminalProps) {
    return (
        <div
            className={`rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] overflow-hidden font-mono text-[13px] ${className}`}
            dir="ltr"
        >
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-2.5">
                <span aria-hidden className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </span>
                <span className="ms-2 text-[11px] tracking-[0.04em] text-[var(--color-text-muted)]">
                    {label}
                </span>
            </div>
            <div className="px-5 py-4 leading-[1.6] text-[var(--color-text-secondary)] min-h-[120px]">
                {typewriterLines ? (
                    <Typewriter lines={typewriterLines} cursor={cursor} />
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

function Typewriter({ lines, cursor }: { lines: string[]; cursor: boolean }) {
    const [shown, setShown] = useState<string[]>([]);
    const [lineIdx, setLineIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(lines);
            setLineIdx(lines.length);
            return;
        }
        if (lineIdx >= lines.length) return;

        const current = lines[lineIdx];
        if (charIdx <= current.length) {
            const id = window.setTimeout(
                () => {
                    setShown((prev) => {
                        const next = [...prev];
                        next[lineIdx] = current.slice(0, charIdx);
                        return next;
                    });
                    setCharIdx((c) => c + 1);
                },
                charIdx === 0 ? 350 : 22 + Math.random() * 28,
            );
            return () => window.clearTimeout(id);
        }

        const id = window.setTimeout(() => {
            setLineIdx((i) => i + 1);
            setCharIdx(0);
        }, 480);
        return () => window.clearTimeout(id);
    }, [lineIdx, charIdx, lines]);

    return (
        <pre className="whitespace-pre-wrap break-words m-0 font-mono">
            {shown.map((line, i) => (
                <div key={i}>
                    <span className="text-[var(--color-mint)]">→ </span>
                    {line}
                    {i === lineIdx - 1 && i === lines.length - 1 && cursor && (
                        <span className="tick-cursor" aria-hidden />
                    )}
                </div>
            ))}
            {lineIdx < lines.length && shown[lineIdx] !== undefined && (
                <span className="tick-cursor" aria-hidden />
            )}
        </pre>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/Terminal.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add Terminal primitive with typewriter mode

Used by the new Hero right column and by AIShowcase chrome. Respects
prefers-reduced-motion (renders lines immediately).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Create `TimelineRail`

**Files:**
- Create: `components/ui/TimelineRail.tsx`

Vertical timeline with mono week markers. Used on Services process and case study Approach sections.

- [ ] **Step 1: Write `components/ui/TimelineRail.tsx`**

```tsx
import type { ReactNode } from "react";

export interface TimelineStep {
    label: string;
    /** Range label rendered in mono (e.g. "W0–W1"). */
    range?: string;
    body: ReactNode;
}

export function TimelineRail({
    steps,
    className = "",
}: {
    steps: TimelineStep[];
    className?: string;
}) {
    return (
        <ol className={`relative ${className}`}>
            <span
                aria-hidden
                className="absolute inset-y-2 start-[7px] w-px bg-[var(--color-border-default)]"
            />
            {steps.map((step, i) => (
                <li key={i} className="relative ps-8 pb-10 last:pb-0">
                    <span
                        aria-hidden
                        className="absolute start-0 top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-0)]"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]" />
                    </span>
                    <div className="flex items-baseline gap-3">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
                            {step.label}
                        </h3>
                        {step.range && (
                            <span className="font-mono text-[11px] lowercase text-[var(--color-text-muted)]">
                                {step.range}
                            </span>
                        )}
                    </div>
                    <div className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                        {step.body}
                    </div>
                </li>
            ))}
        </ol>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/TimelineRail.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add TimelineRail primitive

Vertical timeline with mono week markers. RTL-safe via logical
properties; mint dot at each step.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Create `MetricBlock`

**Files:**
- Create: `components/ui/MetricBlock.tsx`

- [ ] **Step 1: Write `components/ui/MetricBlock.tsx`**

```tsx
import { CountUp } from "./CountUp";

export interface MetricBlockProps {
    value: string;
    label: string;
    /** Optional mono delta (e.g. "↓ 68%", "+14%"). Renders below the label. */
    delta?: string;
    /** "lg" enlarges the value for hero use. */
    size?: "md" | "lg";
    /** Disable CountUp tween (e.g. when value is non-numeric like "Q3 2026"). */
    static?: boolean;
    className?: string;
}

export function MetricBlock({
    value,
    label,
    delta,
    size = "md",
    static: isStatic = false,
    className = "",
}: MetricBlockProps) {
    const valueCls =
        size === "lg"
            ? "font-display text-[48px] sm:text-[64px] lg:text-[80px] font-bold tracking-[-0.035em] leading-[0.95]"
            : "font-display text-[36px] sm:text-[40px] font-bold tracking-[-0.02em] leading-[1]";
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className={`${valueCls} text-[var(--color-text-primary)]`}>
                {isStatic ? value : <CountUp value={value} />}
            </div>
            <div className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                {label}
            </div>
            {delta && (
                <div className="font-mono text-[12px] text-[var(--color-mint)]">{delta}</div>
            )}
        </div>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/MetricBlock.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add MetricBlock primitive

Numeric callout with mono label and optional mint delta. Reuses
existing CountUp for the tween.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Create `CodeChip`

**Files:**
- Create: `components/ui/CodeChip.tsx`

- [ ] **Step 1: Write `components/ui/CodeChip.tsx`**

```tsx
import type { ReactNode } from "react";

export function CodeChip({
    children,
    tone = "default",
    className = "",
}: {
    children: ReactNode;
    tone?: "default" | "mint" | "muted";
    className?: string;
}) {
    const toneCls = {
        default:
            "border-[var(--color-border-default)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]",
        mint:
            "border-transparent bg-[var(--color-mint-soft)] text-[var(--color-mint)]",
        muted:
            "border-[var(--color-border-subtle)] bg-transparent text-[var(--color-text-muted)]",
    }[tone];

    return (
        <span
            dir="ltr"
            className={`inline-flex items-center rounded-[6px] border px-2 py-0.5 font-mono text-[11px] tracking-[0.02em] ${toneCls} ${className}`}
        >
            {children}
        </span>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/CodeChip.tsx
git commit -m "$(cat <<'EOF'
feat(ui): add CodeChip primitive

Mono pill for tag groups (work case tags, stack lists, product
highlights). LTR-locked so chips like 'gpt-4o' read correctly in RTL.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 17: Create `Marquee`

**Files:**
- Create: `components/ui/Marquee.tsx`

Extracts the marquee logic currently inlined in `Hero.tsx` into a reusable component.

- [ ] **Step 1: Write `components/ui/Marquee.tsx`**

```tsx
import type { ReactNode } from "react";

export function Marquee({
    items,
    className = "",
    renderItem,
}: {
    items: string[];
    className?: string;
    renderItem?: (item: string, idx: number) => ReactNode;
}) {
    const doubled = [...items, ...items];
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 start-0 z-10 w-20"
                style={{ background: "linear-gradient(to right, var(--color-surface-0), transparent)" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 end-0 z-10 w-20"
                style={{ background: "linear-gradient(to left, var(--color-surface-0), transparent)" }}
            />
            <div className="marquee">
                {doubled.map((item, i) => (
                    <span
                        key={`${item}-${i}`}
                        className="font-mono text-[12px] lowercase tracking-[0.18em] text-[var(--color-text-muted)]"
                    >
                        {renderItem ? renderItem(item, i) : item}
                    </span>
                ))}
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/Marquee.tsx
git commit -m "$(cat <<'EOF'
feat(ui): extract Marquee primitive from Hero

Same scroll animation, now reusable for TrustedBy strip and other
ribbons.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

Phase 2 primitives complete. Phase 3 (chrome) and onward follow in the same document. Continue to the next section.

---

## Phase 3 — Chrome (Header + Footer)

Header and Footer changes are visible site-wide, so we land them after the new primitives but before page rebuilds — that way every subsequent page-rebuild PR can be reviewed without chrome noise.

### Task 18: Restyle `Header` — mono nav, minimal ornament, scroll behavior kept

**Files:**
- Modify: `components/layout/Header.tsx`

- [ ] **Step 1: Replace nav className styling**

In `components/layout/Header.tsx`, find the desktop nav `<Link>` className (around line 63-67) and replace the entire className with:

```tsx
className={`relative inline-flex h-9 items-center px-3.5 font-mono text-[12px] lowercase tracking-[0.04em] transition-colors ${
    active
        ? "text-[var(--color-text-primary)]"
        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
}`}
```

- [ ] **Step 2: Replace the active-state underline indicator**

Replace the `{active && (<span aria-hidden ... />)}` block with:

```tsx
{active && (
    <span
        aria-hidden
        className="absolute -bottom-0.5 start-3.5 end-3.5 h-px bg-[var(--color-mint)]"
    />
)}
```

- [ ] **Step 3: Add the `kbd` hint next to the primary CTA**

Just before the desktop "Start a project" button block (the `<div className="hidden sm:block ps-1">` wrapping the `<Button>`), insert:

```tsx
<span className="hidden xl:inline-flex h-8 items-center rounded-[6px] kbd-cap bg-[var(--color-surface-1)] px-2 font-mono text-[11px] text-[var(--color-text-muted)]">
    press / to search
</span>
```

(Search itself isn't implemented in this overhaul — the hint is a visual cue. It is wrapped in `hidden xl:inline-flex` so it only appears at very wide widths and won't crowd nav.)

- [ ] **Step 4: Tighten the scroll-state classes**

Replace the `<header className=...>` opening (line 45-50) with:

```tsx
<header
    className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
            ? "border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
    }`}
>
```

- [ ] **Step 5: Update the mobile menu links to use mono styling**

In the mobile menu `<Link>` (around line 113), replace `className="rounded-[10px] px-3 py-3 text-base font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"` with:

```tsx
className="rounded-[8px] px-3 py-3 font-mono text-[14px] lowercase tracking-[0.04em] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
```

- [ ] **Step 6: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 7: Visual check**

```bash
npm run dev
```

Scroll a page — header should pick up its blur background and bottom rule. Active route should show a mint underline under its nav item.

- [ ] **Step 8: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "$(cat <<'EOF'
refactor(layout): restyle Header for engineering aesthetic

Nav becomes mono lowercase with mint underline indicator. Adds a kbd
hint chip at xl widths. Scroll state uses surface-0 with backdrop blur
instead of surface-1.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 19: Restructure `Footer` — 4 columns, mono copyright

**Files:**
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Replace contents of `components/layout/Footer.tsx`**

```tsx
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";
import { SITE } from "@/lib/site";

export default function Footer() {
    const t = useTranslations("Footer");
    const tNav = useTranslations("Navigation");
    const year = new Date().getFullYear().toString();

    return (
        <footer className="relative mt-20 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]">
            <Container className="py-14">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Logo />
                        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {t("company_desc")}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                            // {t("explore_title").toLowerCase()}
                        </h4>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li><Link href="/services" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{tNav("services")}</Link></li>
                            <li><Link href="/products" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{tNav("products")}</Link></li>
                            <li><Link href="/work" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{tNav("work")}</Link></li>
                            <li><Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{tNav("about")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                            // {t("contact_title").toLowerCase()}
                        </h4>
                        <ul className="mt-5 space-y-3 text-sm text-[var(--color-text-secondary)]">
                            <li className="flex items-start gap-3">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                                <a href={`mailto:${SITE.email}`} className="hover:text-[var(--color-text-primary)]" dir="ltr">{SITE.email}</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                                <span>{t("address")}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                            // social
                        </h4>
                        <div className="mt-5 flex items-center gap-3">
                            <a
                                href={SITE.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                data-focus-ring
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-mint)] hover:border-[var(--color-mint)] transition-colors"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href={SITE.socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                data-focus-ring
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-mint)] hover:border-[var(--color-mint)] transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-6 font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                    <p dir="ltr">
                        {t("copyright", { year })} · {t("reg_no")}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-[var(--color-text-primary)]">{t("privacy_link")}</Link>
                        <Link href="/terms" className="hover:text-[var(--color-text-primary)]">{t("terms_link")}</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "$(cat <<'EOF'
refactor(layout): restructure Footer into 4 columns with mono captions

Each column headed by a '// label' mono caption. Copyright line uses
mono lowercase. Social icons get a tight 8px corner and mint hover.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Home page

Phase 4 rebuilds the home page section by section. Each task adds the new i18n keys for that section in all five message files (canonical EN; copy EN value to MS/ZH/TA/AR and log in `messages/.review.md`). The home composition (`app/[locale]/page.tsx`) is updated last (Task 29) so each section can be built and visually checked in isolation against the current page.

### Task 20: Create `messages/.review.md` translation log

**Files:**
- Create: `messages/.review.md`

- [ ] **Step 1: Write `messages/.review.md`**

```markdown
# Translation review log

This file lists message keys whose non-English values are currently
copied verbatim from `en.json` as placeholders. They must be translated
by a human reviewer before they ship in front of non-English users.

Format: `<locale> · <namespace.path>` — one line per key per locale.

## Pending review

(Add entries here as the 2026 overhaul lands. Remove entries once a key
has been reviewed and either translated or confirmed-acceptable as-is.)
```

- [ ] **Step 2: Commit**

```bash
git add messages/.review.md
git commit -m "$(cat <<'EOF'
docs: add translation review log

Tracks i18n keys whose non-English values are currently placeholders.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 21: Add Hero, StatusBar, and Engagements i18n keys (all 5 locales)

**Files:**
- Modify: `messages/en.json`, `ms.json`, `zh.json`, `ta.json`, `ar.json`
- Modify: `messages/.review.md`

The home rebuild needs new keys for the hero terminal lines, status bar version label, and the merged Engagements section. Add all at once so subsequent component tasks can reference them.

- [ ] **Step 1: Add new keys to `messages/en.json`**

Locate the existing `"Home"` object. **Inside `Home.hero`**, add these new keys (alongside the existing `eyebrow`, `title_1`, `title_2`, `title_3`, `subtitle`, `cta_primary`, `cta_secondary`, `trusted_by`):

```json
            "kbd_hint": "press / to search",
            "terminal_label": "infanina:~",
            "terminal_lines": [
                "deployed fb-chain/assistant v1.4 — 12 stores live",
                "kyc-pipeline shipped · time-to-approve 4d → 6h",
                "retail-analytics rolled out · 200+ store managers self-serve",
                "currently scoping · 2 engagements · Q3 2026"
            ]
```

**Add a new sibling object `Home.engagements`** (between `Home.values` and `Home.services`):

```json
        "engagements": {
            "eyebrow": "engagements",
            "title": "Four shapes. Four scopes. Four exits.",
            "subtitle": "Each engagement carries a fixed scope, a clear deliverable, and a defined exit point — no retainers you can't leave.",
            "starts_from": "starts from",
            "items": {
                "strategy": {
                    "title": "Strategy sprint",
                    "summary": "Two-week sprint to find the highest-value AI bets and de-risk them before any code is written.",
                    "shape_weeks": 2,
                    "shape": "sprint",
                    "starts": "S$ on request",
                    "deliverables": [
                        "Opportunity map across operations, customer-facing and data",
                        "Prioritized roadmap with ROI estimates",
                        "Architecture and vendor recommendations"
                    ]
                },
                "build": {
                    "title": "Custom build",
                    "summary": "Design and engineer a production AI product — assistant, agent, document intelligence, analytics.",
                    "shape_weeks": 8,
                    "shape": "build",
                    "starts": "from 8 weeks",
                    "deliverables": [
                        "Product design and UX flows",
                        "Engineered, deployed application",
                        "Evaluation harness and guardrails"
                    ]
                },
                "integrate": {
                    "title": "Integrations",
                    "summary": "Wire LLMs and AI services into the tools your team already lives in.",
                    "shape_weeks": 4,
                    "shape": "build",
                    "starts": "from 4 weeks",
                    "deliverables": [
                        "CRM, ERP, support and e-commerce hooks",
                        "Auth, rate-limiting, observability",
                        "Cost controls and model routing"
                    ]
                },
                "support": {
                    "title": "Ongoing support",
                    "summary": "Stay sharp after launch — monitoring, model upkeep, iteration.",
                    "shape_weeks": 0,
                    "shape": "ongoing",
                    "starts": "monthly · no lock-in",
                    "deliverables": [
                        "SLA-backed monitoring and incident response",
                        "Quarterly model and prompt review",
                        "Iterative feature shipping"
                    ]
                }
            }
        },
```

**Add a new top-level sibling `StatusBar`** (anywhere after `Footer`, sibling to it):

```json
    "StatusBar": {
        "version": "v2026.05",
        "online": "online"
    },
```

- [ ] **Step 2: Mirror to `messages/ms.json`, `zh.json`, `ta.json`, `ar.json`**

In each non-English file, paste the *same English values* into the same key paths. The translator will revise later. (Translating "press / to search" to Arabic literally would actually be inappropriate UI-wise — the slash key is universal. Leave as `"press / to search"` everywhere for now.)

For each locale, after pasting, append to `messages/.review.md`:

```markdown
- ms · Home.hero.kbd_hint
- ms · Home.hero.terminal_label
- ms · Home.hero.terminal_lines
- ms · Home.engagements.eyebrow
- ms · Home.engagements.title
- ms · Home.engagements.subtitle
- ms · Home.engagements.starts_from
- ms · Home.engagements.items.strategy.title
- ms · Home.engagements.items.strategy.summary
- ms · Home.engagements.items.strategy.starts
- ms · Home.engagements.items.strategy.deliverables
- ms · Home.engagements.items.build.title
- ms · Home.engagements.items.build.summary
- ms · Home.engagements.items.build.starts
- ms · Home.engagements.items.build.deliverables
- ms · Home.engagements.items.integrate.title
- ms · Home.engagements.items.integrate.summary
- ms · Home.engagements.items.integrate.starts
- ms · Home.engagements.items.integrate.deliverables
- ms · Home.engagements.items.support.title
- ms · Home.engagements.items.support.summary
- ms · Home.engagements.items.support.starts
- ms · Home.engagements.items.support.deliverables
- ms · StatusBar.version
- ms · StatusBar.online
```

(Note: keys whose values are numbers — `shape_weeks` — don't need translation review. Keys whose values are technical labels — `shape`, `version` — also don't.)

Repeat this block four times in `.review.md`, once per non-EN locale (`ms`, `zh`, `ta`, `ar`).

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

If the build complains about a JSON parse error in any locale file, fix the trailing comma or missing quote before continuing. The pages don't use the new keys yet, so build success only proves valid JSON.

- [ ] **Step 4: Commit**

```bash
git add messages/
git commit -m "$(cat <<'EOF'
feat(i18n): add hero kbd hint, terminal lines, engagements, status bar keys

EN canonical; MS/ZH/TA/AR receive EN placeholders pending human review,
tracked in messages/.review.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

(If the `git add` syntax above mis-pastes in a shell, use `git add messages/`.)

---

### Task 22: Rebuild `Hero.tsx` — two-column with Terminal on lg

**Files:**
- Modify: `components/home/Hero.tsx`

- [ ] **Step 1: Replace contents of `components/home/Hero.tsx`**

```tsx
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { GridBackdrop } from "../ui/GridBackdrop";
import { StatusBar } from "../ui/StatusBar";
import { Terminal } from "../ui/Terminal";

export default function Hero() {
    const t = useTranslations("Home.hero");
    const tStatus = useTranslations("StatusBar");
    const terminalLines = t.raw("terminal_lines") as string[];

    return (
        <section className="relative isolate overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28">
            <GridBackdrop />

            <Container className="relative">
                <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
                    <div className="hero-stagger lg:col-span-7">
                        <StatusBar version={tStatus("version")} />

                        <div className="mt-6">
                            <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                        </div>

                        <h1 className="mt-5 font-display text-[44px] font-bold leading-[0.98] tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-[64px] lg:text-[80px]">
                            <span className="block">{t("title_1")}</span>
                            <span className="block bg-[linear-gradient(110deg,var(--color-brand)_0%,var(--color-mint)_100%)] bg-clip-text text-transparent">
                                {t("title_2")}
                            </span>
                        </h1>

                        <p className="mt-3 max-w-xl font-display text-[18px] font-medium leading-snug text-[var(--color-text-secondary)] sm:text-[22px]">
                            {t("title_3")}
                        </p>

                        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                            {t("subtitle")}
                        </p>

                        <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                            <Button href="/contact" size="lg" variant="primary">
                                {t("cta_primary")}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button href="/work" size="lg" variant="secondary">
                                {t("cta_secondary")}
                            </Button>
                            <span className="ms-1 hidden lg:inline-flex h-9 items-center rounded-[6px] kbd-cap bg-[var(--color-surface-1)] px-2.5 font-mono text-[11px] text-[var(--color-text-muted)]">
                                {t("kbd_hint")}
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-5">
                        <Terminal
                            label={t("terminal_label")}
                            typewriterLines={terminalLines}
                            className="lg:translate-y-12"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
```

The old trusted-by marquee is removed from this file — it moves into its own `TrustedBy` band in Task 23.

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Visual check**

`npm run dev` and check `http://localhost:3000` on a wide viewport. Verify: StatusBar shows live + version + time; Terminal typewriter cycles through lines on the right; gradient on `title_2` mixes brand → mint; CTA row shows the `kbd_hint` chip at lg+.

- [ ] **Step 4: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "$(cat <<'EOF'
feat(home): rebuild Hero as two-column with Terminal companion

StatusBar header, mono eyebrow with '// ' prefix, brand→mint gradient
on title_2, Terminal typewriter on lg right column. Removes the
trusted-by marquee — moved to its own band in TrustedBy.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 23: Create `TrustedBy.tsx` — extracted industry-marquee band

**Files:**
- Create: `components/home/TrustedBy.tsx`

- [ ] **Step 1: Write `components/home/TrustedBy.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Container } from "../ui/Container";
import { Marquee } from "../ui/Marquee";

const TRUSTED = ["F&B", "RETAIL", "FINTECH", "GOV", "EDU", "LOGISTICS"];

export default function TrustedBy() {
    const t = useTranslations("Home.hero");
    return (
        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] py-6">
            <Container>
                <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-10">
                    <div className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)] lg:shrink-0">
                        // {t("trusted_by").toLowerCase()}
                    </div>
                    <Marquee
                        items={TRUSTED}
                        className="w-full"
                        renderItem={(item) => (
                            <span dir="ltr" className="text-[var(--color-text-secondary)]">
                                {item.toLowerCase()}
                            </span>
                        )}
                    />
                </div>
            </Container>
        </section>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/TrustedBy.tsx
git commit -m "$(cat <<'EOF'
feat(home): extract TrustedBy band from Hero

Slim mono-labelled marquee with the industries strip. Used between
Hero and ValueProps in the new home composition.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 24: Restyle `ValueProps.tsx` — flat cards, mono accent rule

**Files:**
- Modify: `components/home/ValueProps.tsx`

- [ ] **Step 1: Replace contents of `components/home/ValueProps.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Hammer, Plug, LifeBuoy } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const ITEMS = [
    { key: "build", icon: Hammer, num: "01" },
    { key: "integrate", icon: Plug, num: "02" },
    { key: "support", icon: LifeBuoy, num: "03" },
] as const;

export default function ValueProps() {
    const t = useTranslations("Home.values");

    return (
        <Section id="how" tone="default" num="02">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
                <Reveal className="lg:col-span-5">
                    <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[48px] lg:text-[56px]">
                        {t("title")}
                    </h2>
                    <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                        {t("subtitle")}
                    </p>
                </Reveal>

                <ul className="lg:col-span-7 grid divide-y divide-[var(--color-border-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] overflow-hidden">
                    {ITEMS.map(({ key, icon: Icon, num }, i) => (
                        <Reveal
                            key={key}
                            as="li"
                            delay={i * 100}
                            className="relative flex items-start gap-5 bg-[var(--color-surface-1)] p-7 transition-colors hover:bg-[var(--color-surface-2)]"
                        >
                            <span className="font-mono text-[11px] text-[var(--color-text-muted)] pt-1.5 w-6">{num}</span>
                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                <Icon className="h-4 w-4" />
                            </span>
                            <div>
                                <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                    {t(`items.${key}.title`)}
                                </h3>
                                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                    {t(`items.${key}.desc`)}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </Section>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/ValueProps.tsx
git commit -m "$(cat <<'EOF'
refactor(home): restyle ValueProps as numbered rows

Flat list with mono numbering, mint icon tiles, divider-rule between
rows. Section gets a left guide ruler via Section.num.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 25: Create `Engagements.tsx`

**Files:**
- Create: `components/home/Engagements.tsx`

Merges what was on the home page as `ServicesOverview` with the new "engagement packages" idea: each card shows title, summary, timeline shape, starts-from, and 3 deliverable bullets.

- [ ] **Step 1: Write the full `components/home/Engagements.tsx`**

```tsx
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Compass, Layers, GitBranch, Activity, Check } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";

const ITEMS = [
    { key: "strategy", icon: Compass, accent: "mint" as const },
    { key: "build", icon: Layers, accent: "brand" as const },
    { key: "integrate", icon: GitBranch, accent: "mint" as const },
    { key: "support", icon: Activity, accent: "warn" as const },
] as const;

function shapeBlocks(weeks: number, shape: string): string {
    if (shape === "ongoing") return "▰▰▰▰▰▰▰▰";
    const filled = Math.max(1, Math.min(8, weeks));
    return "▰".repeat(filled) + "▱".repeat(Math.max(0, 8 - filled));
}

export default function Engagements() {
    const t = useTranslations("Home.engagements");
    const tc = useTranslations("Common");

    return (
        <Section id="engagements" tone="muted" num="03">
            <Reveal>
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl">
                        <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                        <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[48px] lg:text-[56px]">
                            {t("title")}
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                            {t("subtitle")}
                        </p>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-1 font-mono text-[12px] lowercase text-[var(--color-text-primary)] hover:text-[var(--color-mint)]"
                    >
                        explore services <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
                {ITEMS.map(({ key, icon: Icon, accent }, i) => {
                    const weeks = Number(t(`items.${key}.shape_weeks`));
                    const shape = t(`items.${key}.shape`);
                    const deliverables = t.raw(`items.${key}.deliverables`) as string[];
                    return (
                        <Reveal key={key} delay={i * 80}>
                            <Card interactive accent={accent} className="flex h-full flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span aria-hidden className="font-mono text-[11px] text-[var(--color-text-muted)]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t(`items.${key}.title`)}
                                    </h3>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                        {t(`items.${key}.summary`)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 font-mono text-[12px] text-[var(--color-text-muted)]" aria-hidden>
                                    <span className="text-[var(--color-mint)] tracking-tight">{shapeBlocks(weeks, shape)}</span>
                                    <span className="text-[var(--color-text-secondary)]">{t(`items.${key}.starts`)}</span>
                                </div>

                                <ul className="space-y-2 text-[14px] text-[var(--color-text-secondary)]">
                                    {deliverables.map((d) => (
                                        <li key={d} className="flex gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                                            <span>{d}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/services"
                                    className="mt-auto inline-flex items-center gap-1 font-mono text-[12px] lowercase text-[var(--color-text-primary)] hover:text-[var(--color-mint)]"
                                >
                                    {tc("learn_more")} <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Card>
                        </Reveal>
                    );
                })}
            </div>
        </Section>
    );
}
```

- [ ] **Step 2: Lint + build (Engagements)**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit (Engagements)**

```bash
git add components/home/Engagements.tsx
git commit -m "$(cat <<'EOF'
feat(home): add Engagements section (merges services overview + packages)

Four cards with mono timeline shape, starts-from, and 3 deliverables.
Pulls keys from new Home.engagements namespace.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 26: Add Testimonials, Showcase, Stats, CTA i18n keys (all 5 locales)

**Files:**
- Modify: `messages/en.json`, `ms.json`, `zh.json`, `ta.json`, `ar.json`
- Modify: `messages/.review.md`

The remaining home sections (AIShowcase tweak, Testimonials new, Stats restyle, CTABand restyle) need new keys.

- [ ] **Step 1: Add to `messages/en.json`**

**Inside `Home.showcase`**, alongside the existing keys, add:

```json
            "terminal_label": "infanina-assistant:~",
            "view_source": "view source"
```

**Add a new sibling `Home.testimonials`** (between `Home.stats` and `Home.work`):

```json
        "testimonials": {
            "eyebrow": "voices",
            "title": "What clients tell us afterwards.",
            "subtitle": "Three quotes from teams who shipped real AI with us.",
            "items": {
                "fb": {
                    "quote": "Took our WhatsApp ordering from chaos to a 24/7 channel that pays for itself. Honest scoping, weekly demos, no jargon.",
                    "name": "Director, Operations",
                    "company": "Regional F&B chain",
                    "initials": "DO"
                },
                "fintech": {
                    "quote": "We expected a chatbot demo. We got a compliance-grade KYC pipeline. Their evals caught two bugs our own QA missed.",
                    "name": "Head of Risk",
                    "company": "Series B fintech",
                    "initials": "HR"
                },
                "retail": {
                    "quote": "Our store managers stopped emailing analysts for numbers. That alone paid for the engagement in the first quarter.",
                    "name": "VP Retail Operations",
                    "company": "Multi-brand retailer",
                    "initials": "VP"
                }
            }
        },
```

**Inside `Home.stats`**, add `deltas` for each item — alongside `value` and `label`:

```json
            "items": {
                "shipped":      { "value": "40+",    "label": "AI products shipped",    "delta": "+8 this year" },
                "integrations": { "value": "120+",   "label": "Systems integrated",     "delta": "+22 ytd" },
                "languages":    { "value": "5",      "label": "Supported languages",    "delta": "en · ms · zh · ta · ar" },
                "uptime":       { "value": "99.95%", "label": "Avg. service uptime",    "delta": "12-month rolling" }
            }
```

(Replace the existing `items` object — preserves `value` and `label`, adds `delta`.)

**Inside `Home.cta`**, add:

```json
            "email_label": "hello@infanina.com"
```

- [ ] **Step 2: Mirror to MS/ZH/TA/AR**

Copy English values verbatim for every new key into the four other locale files. Append to `messages/.review.md` one entry per non-EN locale × non-numeric key:

```markdown
- ms · Home.showcase.terminal_label
- ms · Home.showcase.view_source
- ms · Home.testimonials.eyebrow
- ms · Home.testimonials.title
- ms · Home.testimonials.subtitle
- ms · Home.testimonials.items.fb.quote
- ms · Home.testimonials.items.fb.name
- ms · Home.testimonials.items.fb.company
- ms · Home.testimonials.items.fintech.quote
- ms · Home.testimonials.items.fintech.name
- ms · Home.testimonials.items.fintech.company
- ms · Home.testimonials.items.retail.quote
- ms · Home.testimonials.items.retail.name
- ms · Home.testimonials.items.retail.company
- ms · Home.stats.items.shipped.delta
- ms · Home.stats.items.integrations.delta
- ms · Home.cta.email_label
```

Repeat for `zh`, `ta`, `ar`. (`Home.stats.items.languages.delta` and `Home.stats.items.uptime.delta` use mostly-symbolic values that read the same in any locale — leave out of review.)

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add messages/
git commit -m "$(cat <<'EOF'
feat(i18n): add testimonials, showcase chrome, stats deltas, cta email keys

EN canonical; placeholders mirrored across MS/ZH/TA/AR with review log
entries.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 27: Restyle `AIShowcase.tsx` — wrap chat in Terminal chrome

**Files:**
- Modify: `components/home/AIShowcase.tsx`

The existing chat bubbles structure is kept (it already works well); only the outer chrome and section eyebrow change.

- [ ] **Step 1: Replace contents of `components/home/AIShowcase.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Send, Sparkles, Globe2, Database } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

export default function AIShowcase() {
    const t = useTranslations("Home.showcase");

    const features = [
        { key: "feature_1", icon: Sparkles },
        { key: "feature_2", icon: Database },
        { key: "feature_3", icon: Globe2 },
    ] as const;

    return (
        <Section id="showcase" tone="default" num="05">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
                <Reveal className="lg:col-span-5">
                    <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[48px] lg:text-[56px]">
                        {t("title")}
                    </h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                        {t("subtitle")}
                    </p>

                    <ul className="mt-8 space-y-5">
                        {features.map(({ key, icon: Icon }, i) => (
                            <Reveal key={key} as="li" delay={120 + i * 80} className="flex gap-4">
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                    <Icon className="h-4 w-4" />
                                </span>
                                <div>
                                    <h3 className="font-display font-semibold text-[var(--color-text-primary)]">
                                        {t(`${key}_title`)}
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                        {t(`${key}_desc`)}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </ul>
                </Reveal>

                <Reveal className="lg:col-span-7" delay={120}>
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] overflow-hidden" dir="ltr">
                        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <span aria-hidden className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                                </span>
                                <span className="ms-2 font-mono text-[11px] tracking-[0.04em] text-[var(--color-text-muted)]">
                                    {t("terminal_label")}
                                </span>
                            </div>
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.04em] text-[var(--color-success)]">
                                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
                                {t("status").toLowerCase()}
                            </span>
                        </div>

                        <div className="space-y-4 p-5 sm:p-6">
                            <div className="flex max-w-[85%] gap-3">
                                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-mint-soft)] font-mono text-[10px] font-semibold text-[var(--color-mint)]">
                                    Ai
                                </span>
                                <div className="rounded-[10px] rounded-tl-sm bg-[var(--color-surface-2)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
                                    {t("msg_hello")}
                                </div>
                            </div>

                            <div className="flex max-w-[85%] ml-auto justify-end">
                                <div className="rounded-[10px] rounded-tr-sm bg-[var(--color-brand)] px-4 py-3 text-sm leading-relaxed text-white">
                                    {t("msg_user")}
                                </div>
                            </div>

                            <div className="flex max-w-[85%] gap-3">
                                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-mint-soft)] font-mono text-[10px] font-semibold text-[var(--color-mint)]">
                                    Ai
                                </span>
                                <div className="rounded-[10px] rounded-tl-sm bg-[var(--color-surface-2)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
                                    {t("msg_response")}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] px-3 py-3">
                            <div className="flex items-center gap-2 rounded-[8px] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] ps-4 pe-1.5 py-1.5">
                                <input
                                    type="text"
                                    readOnly
                                    placeholder={t("input_placeholder")}
                                    className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                                    aria-label={t("input_placeholder")}
                                />
                                <button
                                    type="button"
                                    aria-label="Send"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--color-brand)] text-white dark:bg-[var(--color-mint)] dark:text-[var(--color-surface-0)]"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-2 font-mono text-[10px] lowercase text-[var(--color-text-muted)]">
                            <span aria-hidden>tokens · 1,284</span>
                            <span aria-hidden>·</span>
                            <span>{t("view_source")}</span>
                        </div>
                    </div>
                </Reveal>
            </div>
        </Section>
    );
}
```

The decorative gradient glow behind the chat is dropped (flatter aesthetic). Avatar discs use mint-soft tile; send button is mint in dark, brand in light.

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/AIShowcase.tsx
git commit -m "$(cat <<'EOF'
refactor(home): reframe AIShowcase chat in terminal chrome

Three traffic lights, mono label, mint live dot. Drops the decorative
gradient glow. Adds a mono token-count + view-source footer.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 28: Restyle `SelectedWork.tsx` — MetricBlock + link to `/work/[slug]`

**Files:**
- Modify: `components/home/SelectedWork.tsx`

- [ ] **Step 1: Replace contents of `components/home/SelectedWork.tsx`**

```tsx
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { MetricBlock } from "../ui/MetricBlock";
import { CodeChip } from "../ui/CodeChip";
import { cases } from "@/lib/cases";

export default function SelectedWork() {
    const t = useTranslations("Home.work");
    const tw = useTranslations("Work.cases");

    return (
        <Section id="work" tone="default" num="06">
            <Reveal>
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-xl">
                        <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                        <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[48px] lg:text-[56px]">
                            {t("title")}
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                            {t("subtitle")}
                        </p>
                    </div>
                    <Link
                        href="/work"
                        className="inline-flex items-center gap-1 font-mono text-[12px] lowercase text-[var(--color-text-primary)] hover:text-[var(--color-mint)]"
                    >
                        {t("cta").toLowerCase()} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((c, i) => {
                    const tags = tw.raw(`${c.i18nKey}.tags`) as string[];
                    return (
                        <Reveal key={c.slug} delay={i * 90}>
                            <Link
                                href={`/work/${c.slug}` as `/work/${string}`}
                                className="group relative flex h-full flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 transition-colors hover:border-[var(--color-mint)]"
                                data-focus-ring
                            >
                                <MetricBlock
                                    value={c.headlineMetric.value}
                                    label={c.headlineMetric.label}
                                    size="md"
                                />

                                <div>
                                    <p className="font-mono text-[11px] lowercase text-[var(--color-text-muted)]">
                                        {tw(`${c.i18nKey}.client`)}
                                    </p>
                                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {tw(`${c.i18nKey}.title`)}
                                    </h3>
                                    <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                                        {tw(`${c.i18nKey}.summary`)}
                                    </p>
                                </div>

                                <div className="mt-auto flex flex-wrap gap-1.5">
                                    {tags.map((tag) => (
                                        <CodeChip key={tag}>{tag}</CodeChip>
                                    ))}
                                </div>

                                <span className="inline-flex items-center gap-1 font-mono text-[12px] lowercase text-[var(--color-text-primary)] group-hover:text-[var(--color-mint)]">
                                    read case <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </Link>
                        </Reveal>
                    );
                })}
            </div>
        </Section>
    );
}
```

Note: this references `cases` from `@/lib/cases` and `c.i18nKey` — both are created in Tasks 35-36. Lint+build will FAIL after this step until those tasks are complete. To keep the site renderable in the interim, defer this task until after Task 35. **Re-order: execute Tasks 35-36 before Task 28.** The task itself is small once its dependencies exist.

(Plan executors: skip ahead to Tasks 35-36 first if executing strictly in order; or accept the temporary build break and execute Tasks 28, 35, 36, 29 in tight sequence as a single PR.)

- [ ] **Step 2 (after dependencies exist): Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/SelectedWork.tsx
git commit -m "$(cat <<'EOF'
refactor(home): SelectedWork pulls from typed cases + MetricBlock hero

Card hero is the headline metric (e.g. '68% ↓ handling time'); tags
become CodeChips; the entire card links to /work/[slug].

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 29: Create `Testimonials.tsx`

**Files:**
- Create: `components/home/Testimonials.tsx`

- [ ] **Step 1: Write `components/home/Testimonials.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const KEYS = ["fb", "fintech", "retail"] as const;

export default function Testimonials() {
    const t = useTranslations("Home.testimonials");

    return (
        <Section id="voices" tone="muted" num="07">
            <Reveal className="max-w-2xl">
                <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[48px]">
                    {t("title")}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                    {t("subtitle")}
                </p>
            </Reveal>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
                {KEYS.map((key, i) => (
                    <Reveal key={key} as="li" delay={i * 90}>
                        <figure className="flex h-full flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6">
                            <span aria-hidden className="font-mono text-[11px] text-[var(--color-text-muted)]">
                                // 0{i + 1}
                            </span>
                            <blockquote className="flex-1 font-display text-[18px] leading-[1.45] tracking-[-0.01em] text-[var(--color-text-primary)]">
                                &ldquo;{t(`items.${key}.quote`)}&rdquo;
                            </blockquote>
                            <figcaption className="flex items-center gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
                                <span aria-hidden className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-mint-soft)] font-mono text-[12px] font-semibold text-[var(--color-mint)]">
                                    {t(`items.${key}.initials`)}
                                </span>
                                <div className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                                    <span className="text-[var(--color-text-secondary)]">— {t(`items.${key}.name`)}</span>
                                    <span className="ms-2">· {t(`items.${key}.company`)}</span>
                                </div>
                            </figcaption>
                        </figure>
                    </Reveal>
                ))}
            </ul>
        </Section>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/Testimonials.tsx
git commit -m "$(cat <<'EOF'
feat(home): add Testimonials section

Three quote cards styled as system messages: display-weight quote,
mono attribution metadata, mint initials disc.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 30: Restyle `Stats.tsx` — MetricBlock row on horizontal rule

**Files:**
- Modify: `components/home/Stats.tsx`

- [ ] **Step 1: Replace contents of `components/home/Stats.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { Section } from "../ui/Section";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { MetricBlock } from "../ui/MetricBlock";

const KEYS = ["shipped", "integrations", "languages", "uptime"] as const;

export default function Stats() {
    const t = useTranslations("Home.stats");

    return (
        <Section tone="default" num="08">
            <Reveal className="max-w-2xl">
                <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                    {t("title")}
                </h2>
            </Reveal>

            <dl className="mt-12 grid gap-x-8 gap-y-10 border-t border-[var(--color-border-default)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
                {KEYS.map((key, i) => (
                    <Reveal key={key} delay={i * 80} className="min-w-0">
                        <MetricBlock
                            value={t(`items.${key}.value`)}
                            label={t(`items.${key}.label`)}
                            delta={t(`items.${key}.delta`)}
                            static={key === "languages" || key === "uptime"}
                        />
                    </Reveal>
                ))}
            </dl>
        </Section>
    );
}
```

(`static` is true for `languages` because the value is `5` and tweening it is gratuitous, and for `uptime` because the CountUp regex expects a leading digit — `99.95%` works but the delta `12-month rolling` reads better with a static value.)

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/Stats.tsx
git commit -m "$(cat <<'EOF'
refactor(home): Stats as MetricBlock row on horizontal rule

Drops the boxed-grid treatment for a single hairline rule with four
MetricBlocks below. Each carries a mono delta line.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 31: Restyle `CTABand.tsx` — calmer, no brand flood

**Files:**
- Modify: `components/home/CTABand.tsx`

- [ ] **Step 1: Replace contents of `components/home/CTABand.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SITE } from "@/lib/site";

export default function CTABand() {
    const t = useTranslations("Home.cta");

    return (
        <section className="relative isolate overflow-hidden border-t border-[var(--color-border-default)] bg-[var(--color-surface-0)] py-20 sm:py-24">
            <div aria-hidden className="grid-backdrop" />

            <Container className="relative">
                <Reveal>
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-8">
                            <Eyebrow>{t("eyebrow").toLowerCase()}</Eyebrow>
                            <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-[56px] lg:text-[72px]">
                                {t("title")}
                            </h2>
                            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                                {t("subtitle")}
                            </p>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                                <Button href="/contact" size="lg" variant="primary" className="w-full justify-center sm:w-auto lg:w-full">
                                    {t("primary")}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                                <a
                                    href={`mailto:${SITE.email}`}
                                    className="inline-flex h-12 w-full sm:w-auto lg:w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border-default)] px-6 font-mono text-[13px] lowercase text-[var(--color-text-primary)] hover:border-[var(--color-mint)] hover:text-[var(--color-mint)] transition-colors"
                                    data-focus-ring
                                    dir="ltr"
                                >
                                    {t("email_label")}
                                </a>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}
```

The brand-color flood is gone — the band is just surface-0 with the GridBackdrop. Email link is a mono pill instead of the secondary white-ghost button.

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/home/CTABand.tsx
git commit -m "$(cat <<'EOF'
refactor(home): calm CTABand — surface-0 with grid backdrop

Drops the brand-blue flood + decorative gradients. Email becomes a
mono pill. Headline scales to 72px on lg.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 32: Wire new home composition in `app/[locale]/page.tsx`

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Replace contents of `app/[locale]/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Hero from "@/components/home/Hero";
import TrustedBy from "@/components/home/TrustedBy";
import ValueProps from "@/components/home/ValueProps";
import Engagements from "@/components/home/Engagements";
import AIShowcase from "@/components/home/AIShowcase";
import SelectedWork from "@/components/home/SelectedWork";
import Testimonials from "@/components/home/Testimonials";
import Stats from "@/components/home/Stats";
import CTABand from "@/components/home/CTABand";
import { JsonLd } from "@/components/page/JsonLd";
import { routing } from "@/i18n/routing";
import { breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    return (
        <>
            <Hero />
            <TrustedBy />
            <ValueProps />
            <Engagements />
            <AIShowcase />
            <SelectedWork />
            <Testimonials />
            <Stats />
            <CTABand />

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [{ name: "Home", path: "/" }]),
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        url: `https://infanina.com/${safe}`,
                        name: "Infanina",
                        inLanguage: safe,
                    },
                ]}
            />
        </>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Visual check across locales and themes**

```bash
npm run dev
```

Visit:
- `http://localhost:3000/en` (dark, then toggle light)
- `http://localhost:3000/ar` (RTL — verify nav, marquee direction reversal, card spacing)
- `http://localhost:3000/zh`

Confirm: section order is Hero → TrustedBy → ValueProps → Engagements → AIShowcase → SelectedWork → Testimonials → Stats → CTABand. No layout breakage in any locale.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "$(cat <<'EOF'
feat(home): wire new section order for full overhaul

Hero → TrustedBy → ValueProps → Engagements → AIShowcase → SelectedWork
→ Testimonials → Stats → CTABand. Drops the old ServicesOverview from
the home page; it lives on /services only now.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Other pages

### Task 33: Restyle `PageHero` and `Breadcrumbs` for mono aesthetic

**Files:**
- Modify: `components/page/PageHero.tsx`, `components/page/Breadcrumbs.tsx`

- [ ] **Step 1: Replace contents of `components/page/PageHero.tsx`**

```tsx
import { ReactNode } from "react";
import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { GridBackdrop } from "../ui/GridBackdrop";

export function PageHero({
    eyebrow,
    title,
    subtitle,
    children,
    withBackdrop = true,
}: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    children?: ReactNode;
    /** Renders the GridBackdrop. Default true. */
    withBackdrop?: boolean;
}) {
    return (
        <section className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
            {withBackdrop && <GridBackdrop />}
            <Container className="relative">
                <div className="max-w-3xl">
                    <Eyebrow>{eyebrow.toLowerCase()}</Eyebrow>
                    <h1 className="mt-5 font-display text-[44px] font-bold leading-[1.0] tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-[60px] lg:text-[80px]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">
                            {subtitle}
                        </p>
                    )}
                    {children && <div className="mt-8">{children}</div>}
                </div>
            </Container>
        </section>
    );
}
```

The `withMesh` prop is renamed to `withBackdrop`. All callers pass `withMesh`; we update them in the next step.

- [ ] **Step 2: Update all callers of PageHero**

In each of `app/[locale]/services/page.tsx`, `products/page.tsx`, `work/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, find the `<PageHero ... withMesh />` (or `<PageHero ... />` for privacy/terms which don't currently pass `withMesh`) and:
- Remove `withMesh` (the default `withBackdrop=true` covers it)
- Add `withBackdrop={false}` only on `privacy/page.tsx` and `terms/page.tsx` (kept calm — the spec says light pass)

- [ ] **Step 3: Replace contents of `components/page/Breadcrumbs.tsx`**

```tsx
import { Link } from "@/i18n/routing";
import { Container } from "../ui/Container";

export interface Crumb {
    name: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <Container className="pt-6">
            <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]" dir="ltr">
                    <span aria-hidden className="text-[var(--color-text-muted)]">//</span>
                    {items.map((item, i) => {
                        const last = i === items.length - 1;
                        return (
                            <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
                                {item.href && !last ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-[var(--color-mint)] transition-colors"
                                    >
                                        {item.name.toLowerCase()}
                                    </Link>
                                ) : (
                                    <span aria-current={last ? "page" : undefined} className={last ? "text-[var(--color-text-secondary)]" : ""}>
                                        {item.name.toLowerCase()}
                                    </span>
                                )}
                                {!last && <span aria-hidden className="opacity-50">/</span>}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </Container>
    );
}
```

- [ ] **Step 4: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/page/PageHero.tsx components/page/Breadcrumbs.tsx app/[locale]/
git commit -m "$(cat <<'EOF'
refactor(page): mono breadcrumbs and grid-backdrop PageHero

PageHero opts into GridBackdrop by default; callers updated. Breadcrumb
becomes a '/'-separated mono path with mint hover.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 34: Add i18n keys for /services FAQ + ownership and /products install steps

**Files:**
- Modify: `messages/en.json`, `ms.json`, `zh.json`, `ta.json`, `ar.json`
- Modify: `messages/.review.md`

- [ ] **Step 1: Add to `messages/en.json`**

**Inside `Services`**, after the existing `process` object, add two new siblings:

```json
        "ownership": {
            "eyebrow": "what you own at the end",
            "title": "Yours. No exceptions.",
            "items": {
                "repo":    { "title": "Repository",  "desc": "Source, history, branches, CI config — all in your org." },
                "data":    { "title": "Data",        "desc": "Training data, embeddings, indexes — sit in storage you control." },
                "prompts": { "title": "Prompts",     "desc": "Every prompt, every system message, every tool spec — version-controlled." },
                "evals":   { "title": "Evaluations", "desc": "The test sets and harnesses we use to certify a model change." }
            }
        },
        "faq": {
            "eyebrow": "faq",
            "title": "Common questions, plain answers.",
            "items": {
                "ai_fit":    { "q": "How do we know AI is the right answer?",       "a": "We say so honestly. If automation, search, or a UX fix would do the job, we'll tell you that and decline the AI engagement." },
                "timeline":  { "q": "How fast can a build start?",                  "a": "Strategy sprints typically slot in within 2–3 weeks. Builds depend on scope but usually start within 4–6 weeks of the kickoff call." },
                "team":      { "q": "Who actually does the work?",                  "a": "The same engineers and designers who scoped the project. No bait-and-switch to junior staff." },
                "lock_in":   { "q": "What if we want to move off your code later?", "a": "You own everything from day one. We use mainstream stacks (TypeScript, Python, Postgres, OpenAI/Anthropic/local LLMs). Nothing exotic locks you in." },
                "data":      { "q": "Where does our data live?",                    "a": "In your accounts on your chosen cloud. We never co-mingle client data and never train models on your data without explicit permission." }
            }
        }
```

**Inside `Products`**, after `items` and before `cta`, add:

```json
        "install": {
            "eyebrow": "how it's installed",
            "title": "Productized doesn't mean off-the-shelf.",
            "steps": {
                "scope":     { "title": "Scope",      "range": "W0",    "desc": "We walk through your workflow with the product as a baseline. What stays, what flexes, what's out." },
                "adapt":     { "title": "Adapt",      "range": "W1–W2", "desc": "Connectors, prompts, and UI tuned to your data, tone, and integrations." },
                "integrate": { "title": "Integrate",  "range": "W2–W3", "desc": "Wired into your CRM, ERP, or wherever the workflow already lives. Auth, observability, cost caps in place." },
                "handoff":   { "title": "Hand-off",   "range": "W4",    "desc": "Documentation, training, runbook. The product is yours; we stay as little or as long as you need." }
            }
        },
```

**Inside `About`**, after `principles`, add:

```json
        "where": {
            "eyebrow": "where",
            "title": "Based in Singapore. Working across South-East Asia.",
            "body": "We're embedded in the region's tooling, regulatory, and operational reality — F&B, fintech, government, retail, logistics. Calls in your timezone, hand-offs in your language, contracts in SGD."
        }
```

- [ ] **Step 2: Mirror to MS/ZH/TA/AR**

Copy EN values to the four other locale files at the same key paths. Append entries to `messages/.review.md` for each locale × non-symbolic key (the FAQ a/q strings are translation-worthy; `Services.ownership.items.*` titles and descriptions; etc.).

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add messages/
git commit -m "$(cat <<'EOF'
feat(i18n): add services ownership/faq, products install, about where keys

EN canonical; placeholders mirrored across MS/ZH/TA/AR with review log
entries.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 35: Create `lib/cases/` typed content modules

**Files:**
- Create: `lib/cases/index.ts`, `lib/cases/fb-chain.ts`, `lib/cases/fintech-kyc.ts`, `lib/cases/retail-analytics.ts`

Case structural data (slugs, stack, metric numbers) lives in TypeScript. Prose lives in `messages/*.json` under `Work.cases.<slug>.detail` (added in Task 36).

- [ ] **Step 1: Write `lib/cases/fb-chain.ts`**

```ts
import type { Case } from "./index";

export const fbChain: Case = {
    slug: "fb-chain",
    i18nKey: "fb_chain",
    industry: "fb",
    publishedAt: "2026-02-14",
    headlineMetric: { value: "68%", label: "↓ handling time" },
    outcomes: [
        { value: "68%", label: "Reduction in WhatsApp handling time" },
        { value: "+14%", label: "Lift in weekday revenue" },
        { value: "30", label: "Stores live in week 6" },
    ],
    stack: ["gpt-4o", "WhatsApp Business API", "Twilio", "PostgreSQL", "Vercel", "RAG"],
    relatedSlugs: ["retail-analytics", "fintech-kyc"],
};
```

- [ ] **Step 2: Write `lib/cases/fintech-kyc.ts`**

```ts
import type { Case } from "./index";

export const fintechKyc: Case = {
    slug: "fintech-kyc",
    i18nKey: "fintech",
    industry: "fintech",
    publishedAt: "2026-03-22",
    headlineMetric: { value: "4d → 6h", label: "time to approve" },
    outcomes: [
        { value: "6h", label: "Median KYC time-to-approve (from 4 days)" },
        { value: "94%", label: "Auto-approval rate at acceptable risk threshold" },
        { value: "0", label: "Compliance findings in Q1 audit" },
    ],
    stack: ["Claude Sonnet 4.6", "OCR+LLM", "Postgres", "S3", "Temporal", "Datadog"],
    relatedSlugs: ["fb-chain", "retail-analytics"],
};
```

- [ ] **Step 3: Write `lib/cases/retail-analytics.ts`**

```ts
import type { Case } from "./index";

export const retailAnalytics: Case = {
    slug: "retail-analytics",
    i18nKey: "retail",
    industry: "retail",
    publishedAt: "2026-04-10",
    headlineMetric: { value: "200+", label: "managers self-serve" },
    outcomes: [
        { value: "200+", label: "Store managers using conversational analytics" },
        { value: "82%", label: "Of recurring analyst questions now self-served" },
        { value: "3.2h", label: "Time saved per manager per week (median)" },
    ],
    stack: ["gpt-4o", "Snowflake", "dbt", "RBAC", "Next.js", "Vercel"],
    relatedSlugs: ["fb-chain", "fintech-kyc"],
};
```

- [ ] **Step 4: Write `lib/cases/index.ts`**

```ts
export type Industry = "fb" | "retail" | "fintech" | "public" | "logistics";

export interface Metric {
    value: string;
    label: string;
}

export interface Case {
    slug: string;
    /** Existing key under Work.cases in messages/*.json (e.g. "fb_chain"). */
    i18nKey: string;
    industry: Industry;
    publishedAt: string;
    headlineMetric: Metric;
    outcomes: Metric[];
    stack: string[];
    relatedSlugs: string[];
}

import { fbChain } from "./fb-chain";
import { fintechKyc } from "./fintech-kyc";
import { retailAnalytics } from "./retail-analytics";

export const cases: Case[] = [fbChain, fintechKyc, retailAnalytics];

export function getCase(slug: string): Case | undefined {
    return cases.find((c) => c.slug === slug);
}

export function getRelated(slug: string): Case[] {
    const c = getCase(slug);
    if (!c) return [];
    return c.relatedSlugs
        .map((s) => getCase(s))
        .filter((x): x is Case => Boolean(x));
}

export const INDUSTRY_LABEL: Record<Industry, string> = {
    fb: "F&B",
    retail: "Retail",
    fintech: "Fintech",
    public: "Public",
    logistics: "Logistics",
};
```

- [ ] **Step 5: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add lib/cases/
git commit -m "$(cat <<'EOF'
feat(cases): add typed case study content modules

Three seeded cases (fb-chain, fintech-kyc, retail-analytics) with
typed structural data (slug, industry, metrics, stack). Prose lives in
messages/*.json under Work.cases.<i18nKey>.detail (added next).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 36: Add `Work.cases.*.detail` and `Work.filters` i18n keys

**Files:**
- Modify: `messages/en.json`, `ms.json`, `zh.json`, `ta.json`, `ar.json`
- Modify: `messages/.review.md`

- [ ] **Step 1: Add to `messages/en.json`**

**Inside each existing `Work.cases.{fb_chain,fintech,retail}` object**, add a `detail` sibling. Replace `Work.cases.fb_chain` entirely with:

```json
            "fb_chain": {
                "client": "Regional F&B chain",
                "title": "WhatsApp ordering assistant for 30 stores",
                "summary": "Voice + text ordering on WhatsApp, validated against POS stock. Cut handling time by 68% and lifted weekday revenue 14%.",
                "tags": ["Customer assistant", "WhatsApp", "POS"],
                "detail": {
                    "context": "A regional F&B chain with 30 outlets across two cities. WhatsApp orders were drowning store staff — duplicated tickets, mis-priced items, stock-out surprises. The customer wanted a 24/7 channel without growing the team.",
                    "constraints": [
                        "POS is the source of truth — no double-entry tolerated",
                        "Menu and pricing change weekly; the assistant must always be current",
                        "Mandarin and English at minimum; staff handoff in either language"
                    ],
                    "approach_heading": "Approach",
                    "approach_steps": [
                        { "title": "Scoped to one pilot store first", "body": "Wired the assistant to the existing POS API, ran for 14 days with a single store to calibrate." },
                        { "title": "Tightened the menu retrieval", "body": "RAG over the live menu CSV; pricing pulled at request time, never cached." },
                        { "title": "Designed the human handoff", "body": "Edge cases (allergies, refunds, complaints) escalate to a human within 30 seconds via WhatsApp Business handover protocol." },
                        { "title": "Rolled out store-by-store", "body": "Two stores per week, with a same-day rollback path if a region's payment rail changed." }
                    ],
                    "outcome_heading": "Outcome",
                    "outcome_body": "Six weeks from kickoff to all 30 stores live. WhatsApp handling time dropped 68%, weekday revenue lifted 14% as orders that previously dropped during peak hours started landing.",
                    "stack_heading": "Stack",
                    "quote": "Took our WhatsApp ordering from chaos to a 24/7 channel that pays for itself.",
                    "quote_attribution": "— Director, Operations · Regional F&B chain"
                }
            },
```

Repeat for `fintech` and `retail` with detail bodies that match the case data in Task 35. Use the existing `client`/`title`/`summary`/`tags` values as anchors. Sample for `fintech`:

```json
            "fintech": {
                "client": "Series B fintech",
                "title": "Document intelligence for KYC review",
                "summary": "Replaced six-stage manual KYC review with an LLM-assisted pipeline. Time-to-approve dropped from 4 days to 6 hours.",
                "tags": ["Document intelligence", "Compliance", "OCR"],
                "detail": {
                    "context": "A Series B fintech expanding into three new markets. The compliance team's six-stage manual KYC review was the rate-limiting step on new customer onboarding. Audit findings demanded the process tighten, not loosen.",
                    "constraints": [
                        "Zero tolerance for missed risk signals — auditor-defensible",
                        "Outputs must be explainable for every approval decision",
                        "Models, prompts, and evals run in the client's cloud accounts only"
                    ],
                    "approach_heading": "Approach",
                    "approach_steps": [
                        { "title": "Mapped the existing six stages",      "body": "Stage-by-stage trace of the manual process; identified the four stages safe to automate and the two requiring human sign-off." },
                        { "title": "Built the extraction layer",          "body": "OCR + LLM extraction with confidence scoring on every field. Low-confidence items routed to a human queue." },
                        { "title": "Wrote the eval harness first",        "body": "Replayed 800 historical files against the pipeline; tuned until precision exceeded the human baseline on every risk-flag field." },
                        { "title": "Rolled to shadow mode for 30 days",   "body": "Pipeline decisions logged but not enforced. Operators reviewed disagreements daily, fed corrections back into evals." }
                    ],
                    "outcome_heading": "Outcome",
                    "outcome_body": "Median KYC time-to-approve dropped from 4 days to 6 hours. Auto-approval rate of 94% at the agreed risk threshold; zero compliance findings in the Q1 audit.",
                    "stack_heading": "Stack",
                    "quote": "We expected a chatbot demo. We got a compliance-grade KYC pipeline.",
                    "quote_attribution": "— Head of Risk · Series B fintech"
                }
            },
```

Sample for `retail`:

```json
            "retail": {
                "client": "Multi-brand retailer",
                "title": "Conversational analytics for store managers",
                "summary": "Plain-English queries over the warehouse, scoped per role. 200+ store managers self-serve insights they used to email for.",
                "tags": ["Analytics", "RAG", "RBAC"],
                "detail": {
                    "context": "A 200+ store, multi-brand retailer. The analytics team was the bottleneck — every store manager who wanted yesterday's footfall or week-over-week basket size had to email and wait two days for an answer.",
                    "constraints": [
                        "Read-only against the warehouse — never modify data",
                        "Role-based access — store managers see only their stores",
                        "Answers must show the SQL for analyst review"
                    ],
                    "approach_heading": "Approach",
                    "approach_steps": [
                        { "title": "Defined a question taxonomy",         "body": "Worked with three managers to capture the 80 most-asked questions; trained against that set." },
                        { "title": "Modelled access controls upfront",    "body": "Every query rewritten through a role-scoped view layer; managers literally cannot see other stores." },
                        { "title": "Wrapped SQL in conversational UI",    "body": "Plain-English in, plain-English out, with the generated SQL collapsed below for the curious." },
                        { "title": "Onboarded 200 managers in 4 weeks",   "body": "Office-hours rollout, store-by-store, paired with a one-page printable cheat sheet." }
                    ],
                    "outcome_heading": "Outcome",
                    "outcome_body": "200+ store managers self-serve. 82% of recurring analyst questions handled without a human in the loop. Median three hours per manager per week saved.",
                    "stack_heading": "Stack",
                    "quote": "Our store managers stopped emailing analysts for numbers.",
                    "quote_attribution": "— VP Retail Operations · Multi-brand retailer"
                }
            }
```

**Add a new sibling `Work.filters`** to the `Work` namespace:

```json
        "filters": {
            "all": "all",
            "fb": "F&B",
            "retail": "retail",
            "fintech": "fintech",
            "public": "public",
            "logistics": "logistics",
            "count_template": "({count})"
        },
        "related": {
            "heading": "Related cases"
        },
        "page_breadcrumb": "work"
```

(Place inside the `Work` object, alongside `hero`, `cases`, `cta`.)

- [ ] **Step 2: Mirror to MS/ZH/TA/AR**

Copy values verbatim across all four locale files. Append `messages/.review.md` entries for each new translatable key × non-EN locale (`context`, `constraints`, `approach_steps`, `outcome_*`, `quote`, `quote_attribution`, `related.heading`, `filters.all`).

- [ ] **Step 3: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add messages/
git commit -m "$(cat <<'EOF'
feat(i18n): add case study detail bodies and work filter labels

Three full case bodies (context, constraints, approach, outcome,
stack, quote) plus filter chip labels. EN canonical; placeholders
mirrored across MS/ZH/TA/AR with review log entries.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 37: Create case study route components

**Files:**
- Create: `components/work/CaseStudyHero.tsx`, `components/work/CaseStudyBody.tsx`, `components/work/CaseStudyMetrics.tsx`, `components/work/CaseFilter.tsx`

- [ ] **Step 1: Write `components/work/CaseStudyHero.tsx`**

```tsx
import { Container } from "../ui/Container";
import { GridBackdrop } from "../ui/GridBackdrop";
import { MetricBlock } from "../ui/MetricBlock";
import { MonoMeta, type MonoMetaItem } from "../ui/MonoMeta";

interface CaseStudyHeroProps {
    breadcrumb: string;
    client: string;
    title: string;
    metric: { value: string; label: string };
    meta: MonoMetaItem[];
}

export function CaseStudyHero({ breadcrumb, client, title, metric, meta }: CaseStudyHeroProps) {
    return (
        <section className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
            <GridBackdrop />
            <Container className="relative">
                <p className="font-mono text-[11px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]" dir="ltr">
                    // {breadcrumb}
                </p>
                <p className="mt-6 font-mono text-[12px] lowercase tracking-[0.04em] text-[var(--color-mint)]">
                    {client}
                </p>
                <h1 className="mt-3 max-w-3xl font-display text-[40px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-[56px] lg:text-[68px]">
                    {title}
                </h1>

                <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <MetricBlock value={metric.value} label={metric.label} size="lg" static />
                    </div>
                    <div className="lg:col-span-5">
                        <MonoMeta items={meta} />
                    </div>
                </div>
            </Container>
        </section>
    );
}
```

- [ ] **Step 2: Write `components/work/CaseStudyBody.tsx`**

```tsx
import type { ReactNode } from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { TimelineRail, type TimelineStep } from "../ui/TimelineRail";
import { CodeChip } from "../ui/CodeChip";
import { MonoMeta } from "../ui/MonoMeta";

export interface CaseStudyBodyProps {
    contextHeading?: string;
    contextBody: string;
    constraintsHeading?: string;
    constraints: string[];
    approachHeading: string;
    approachSteps: TimelineStep[];
    outcomeHeading: string;
    outcomeBody: string;
    stackHeading: string;
    stack: string[];
    quote: string;
    quoteAttribution: string;
}

export function CaseStudyBody({
    contextHeading = "Context",
    contextBody,
    constraintsHeading = "Constraints",
    constraints,
    approachHeading,
    approachSteps,
    outcomeHeading,
    outcomeBody,
    stackHeading,
    stack,
    quote,
    quoteAttribution,
}: CaseStudyBodyProps) {
    return (
        <>
            <Section tone="default" num="01">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="font-mono text-[12px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                            // {contextHeading.toLowerCase()}
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <p className="text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                            {contextBody}
                        </p>
                    </div>
                </div>
            </Section>

            <Section tone="muted" num="02">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="font-mono text-[12px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                            // {constraintsHeading.toLowerCase()}
                        </h2>
                    </div>
                    <ul className="lg:col-span-8 space-y-3 font-mono text-[14px] text-[var(--color-text-secondary)]">
                        {constraints.map((c) => (
                            <li key={c} className="flex gap-3">
                                <span aria-hidden className="text-[var(--color-mint)]">·</span>
                                <span>{c}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            <Section tone="default" num="03">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="font-display text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
                            {approachHeading}
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <TimelineRail steps={approachSteps} />
                    </div>
                </div>
            </Section>

            <Section tone="muted" num="04">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="font-display text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
                            {outcomeHeading}
                        </h2>
                    </div>
                    <div className="lg:col-span-8">
                        <p className="text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                            {outcomeBody}
                        </p>
                    </div>
                </div>
            </Section>

            <Section tone="default" num="05">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-4">
                        <h2 className="font-mono text-[12px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                            // {stackHeading.toLowerCase()}
                        </h2>
                    </div>
                    <div className="lg:col-span-8 flex flex-wrap gap-2">
                        {stack.map((s) => (
                            <CodeChip key={s} tone="mint">{s}</CodeChip>
                        ))}
                    </div>
                </div>
            </Section>

            <Section tone="muted" num="06">
                <blockquote className="mx-auto max-w-3xl font-display text-[28px] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--color-text-primary)] sm:text-[36px]">
                    &ldquo;{quote}&rdquo;
                </blockquote>
                <p className="mx-auto max-w-3xl mt-6 font-mono text-[12px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                    {quoteAttribution}
                </p>
            </Section>
        </>
    );
}
```

- [ ] **Step 3: Write `components/work/CaseStudyMetrics.tsx`**

```tsx
import { MetricBlock } from "../ui/MetricBlock";
import type { Metric } from "@/lib/cases";

export function CaseStudyMetrics({ metrics }: { metrics: Metric[] }) {
    return (
        <dl className="grid gap-x-8 gap-y-10 border-t border-[var(--color-border-default)] pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((m) => (
                <MetricBlock key={m.label} value={m.value} label={m.label} static />
            ))}
        </dl>
    );
}
```

- [ ] **Step 4: Write `components/work/CaseFilter.tsx`**

Important: Next.js App Router requires props passed from Server → Client components to be serializable. Functions (render props) are not. So `CaseFilter` is a self-contained client component that takes pre-enriched, fully-translated card data as a serializable prop and renders the cards itself.

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { INDUSTRY_LABEL, type Industry, type Metric } from "@/lib/cases";
import { MetricBlock } from "../ui/MetricBlock";
import { CodeChip } from "../ui/CodeChip";

export interface EnrichedCase {
    slug: string;
    industry: Industry;
    client: string;
    title: string;
    summary: string;
    tags: string[];
    headlineMetric: Metric;
}

type FilterKey = "all" | Industry;
const KEYS: FilterKey[] = ["all", "fb", "retail", "fintech", "public", "logistics"];

export function CaseFilter({ cases }: { cases: EnrichedCase[] }) {
    const t = useTranslations("Work.filters");
    const [active, setActive] = useState<FilterKey>("all");

    const counts: Record<FilterKey, number> = {
        all: cases.length,
        fb: cases.filter((c) => c.industry === "fb").length,
        retail: cases.filter((c) => c.industry === "retail").length,
        fintech: cases.filter((c) => c.industry === "fintech").length,
        public: cases.filter((c) => c.industry === "public").length,
        logistics: cases.filter((c) => c.industry === "logistics").length,
    };

    const filtered = active === "all" ? cases : cases.filter((c) => c.industry === active);

    return (
        <>
            <div role="tablist" className="flex flex-wrap gap-1.5">
                {KEYS.filter((k) => counts[k] > 0).map((key) => {
                    const isActive = active === key;
                    const label = key === "all" ? t("all") : INDUSTRY_LABEL[key as Industry];
                    return (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActive(key)}
                            data-focus-ring
                            className={`inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-3 font-mono text-[12px] lowercase tracking-[0.04em] transition-colors ${
                                isActive
                                    ? "border-[var(--color-mint)] bg-[var(--color-mint-soft)] text-[var(--color-mint)]"
                                    : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)]"
                            }`}
                        >
                            {label.toLowerCase()}
                            <span className="opacity-60">({counts[key]})</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => (
                    <Link
                        key={c.slug}
                        href={`/work/${c.slug}` as `/work/${string}`}
                        className="group flex h-full flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 transition-colors hover:border-[var(--color-mint)]"
                        data-focus-ring
                    >
                        <MetricBlock value={c.headlineMetric.value} label={c.headlineMetric.label} />
                        <div>
                            <p className="font-mono text-[11px] lowercase text-[var(--color-text-muted)]">
                                {c.client} · {INDUSTRY_LABEL[c.industry]}
                            </p>
                            <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {c.title}
                            </h2>
                            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
                                {c.summary}
                            </p>
                        </div>
                        <div className="mt-auto flex flex-wrap gap-1.5">
                            {c.tags.map((tag) => (
                                <CodeChip key={tag}>{tag}</CodeChip>
                            ))}
                        </div>
                        <span className="inline-flex items-center gap-1 font-mono text-[12px] lowercase text-[var(--color-text-primary)] group-hover:text-[var(--color-mint)]">
                            read case <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </Link>
                ))}
            </div>
        </>
    );
}
```

- [ ] **Step 5: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add components/work/
git commit -m "$(cat <<'EOF'
feat(work): add case study route components

CaseStudyHero (breadcrumb + headline metric), CaseStudyBody
(context/constraints/approach/outcome/stack/quote), CaseStudyMetrics
(metric row), CaseFilter (industry chip tabs). Wired in next task.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 38: Extend `i18n/routing.ts`, `lib/seo.ts`, and create `/work/[slug]` route

**Files:**
- Modify: `i18n/routing.ts`
- Modify: `lib/seo.ts`
- Create: `app/[locale]/work/[slug]/page.tsx`

- [ ] **Step 1: Update `i18n/routing.ts`**

Replace contents of `i18n/routing.ts` with:

```ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
    locales: ["en", "ms", "zh", "ta", "ar"],
    defaultLocale: "en",
    pathnames: {
        "/": "/",
        "/services": "/services",
        "/products": "/products",
        "/work": "/work",
        "/work/[slug]": "/work/[slug]",
        "/about": "/about",
        "/contact": "/contact",
        "/privacy": "/privacy",
        "/terms": "/terms",
    },
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

- [ ] **Step 2: Extend `lib/seo.ts` with `caseStudyJsonLd`**

Append to `lib/seo.ts`:

```ts
import type { Locale } from "./site";

export interface CaseStudyJsonLdInput {
    locale: Locale;
    slug: string;
    title: string;
    summary: string;
    client: string;
    publishedAt: string;
}

export function caseStudyJsonLd({
    locale,
    slug,
    title,
    summary,
    client,
    publishedAt,
}: CaseStudyJsonLdInput) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        url: `${SITE.url}/${locale}/work/${slug}`,
        name: title,
        headline: title,
        description: summary,
        author: {
            "@type": "Organization",
            name: SITE.legalName,
            url: SITE.url,
        },
        publisher: {
            "@type": "Organization",
            name: SITE.legalName,
            url: SITE.url,
        },
        about: client,
        inLanguage: locale,
        datePublished: publishedAt,
    };
}
```

(Drop the redundant `import type { Locale }` if it already exists at the top of the file; the original file imports `Locale` from `./site` on line 2.)

- [ ] **Step 3: Create `app/[locale]/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { CaseStudyBody } from "@/components/work/CaseStudyBody";
import { CaseStudyMetrics } from "@/components/work/CaseStudyMetrics";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd, caseStudyJsonLd } from "@/lib/seo";
import { SITE, type Locale } from "@/lib/site";
import { cases, getCase, getRelated, INDUSTRY_LABEL } from "@/lib/cases";

export async function generateStaticParams() {
    const out: { locale: string; slug: string }[] = [];
    for (const locale of routing.locales) {
        for (const c of cases) out.push({ locale, slug: c.slug });
    }
    return out;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const c = getCase(slug);
    if (!c) return {};
    const t = await getTranslations({ locale: safe, namespace: `Work.cases.${c.i18nKey}` });
    return buildMetadata({
        locale: safe,
        path: `/work/${slug}`,
        title: t("title"),
        description: t("summary"),
        keywords: [t("client"), ...c.stack.slice(0, 4)],
        type: "article",
    });
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const c = getCase(slug);
    if (!c) notFound();

    const t = await getTranslations(`Work.cases.${c.i18nKey}`);
    const tWork = await getTranslations("Work");
    const tNav = await getTranslations("Navigation");
    const approachSteps = (t.raw("detail.approach_steps") as Array<{ title: string; body: string }>).map((s) => ({
        label: s.title,
        body: s.body,
    }));
    const related = getRelated(slug);

    return (
        <>
            <Breadcrumbs
                items={[
                    { name: tNav("home"), href: "/" },
                    { name: tNav("work"), href: "/work" },
                    { name: t("title") },
                ]}
            />

            <CaseStudyHero
                breadcrumb={`work / ${slug}`}
                client={t("client")}
                title={t("title")}
                metric={c.headlineMetric}
                meta={[
                    { label: "industry", value: INDUSTRY_LABEL[c.industry] },
                    { label: "published", value: c.publishedAt },
                    { label: "stack", value: c.stack.slice(0, 3).join(", ") },
                ]}
            />

            <CaseStudyBody
                contextBody={t("detail.context")}
                constraints={t.raw("detail.constraints") as string[]}
                approachHeading={t("detail.approach_heading")}
                approachSteps={approachSteps.map((step) => ({
                    label: step.label,
                    body: step.body,
                }))}
                outcomeHeading={t("detail.outcome_heading")}
                outcomeBody={t("detail.outcome_body")}
                stackHeading={t("detail.stack_heading")}
                stack={c.stack}
                quote={t("detail.quote")}
                quoteAttribution={t("detail.quote_attribution")}
            />

            <Section tone="default" num="07">
                <h2 className="font-mono text-[12px] lowercase tracking-[0.04em] text-[var(--color-text-muted)]">
                    // outcomes
                </h2>
                <div className="mt-8">
                    <CaseStudyMetrics metrics={c.outcomes} />
                </div>
            </Section>

            {related.length > 0 && (
                <Section tone="muted" num="08">
                    <h2 className="font-display text-[28px] font-bold tracking-tight text-[var(--color-text-primary)]">
                        {tWork("related.heading")}
                    </h2>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        {related.map((r) => (
                            <Link
                                key={r.slug}
                                href={`/work/${r.slug}` as `/work/${string}`}
                                className="group rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 transition-colors hover:border-[var(--color-mint)]"
                                data-focus-ring
                            >
                                <p className="font-mono text-[11px] lowercase text-[var(--color-text-muted)]">
                                    {INDUSTRY_LABEL[r.industry]}
                                </p>
                                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                    {r.headlineMetric.value} · {r.headlineMetric.label}
                                </h3>
                                <span className="mt-4 inline-flex items-center gap-1 font-mono text-[12px] lowercase text-[var(--color-text-primary)] group-hover:text-[var(--color-mint)]">
                                    read case →
                                </span>
                            </Link>
                        ))}
                    </div>
                </Section>
            )}

            <Section tone="default" num="09">
                <Container className="px-0">
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-10 text-center sm:p-14">
                        <h2 className="font-display text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]">
                            Want a similar lift?
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-secondary)]">
                            We&rsquo;ll come back within one working day with a shape and a rough budget.
                        </p>
                        <div className="mt-7 flex justify-center">
                            <Button href="/contact" size="lg">
                                Start a project <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Container>
            </Section>

            <JsonLd
                data={[
                    breadcrumbJsonLd(safe, [
                        { name: tNav("home"), path: "/" },
                        { name: tNav("work"), path: "/work" },
                        { name: t("title"), path: `/work/${slug}` },
                    ]),
                    caseStudyJsonLd({
                        locale: safe,
                        slug,
                        title: t("title"),
                        summary: t("summary"),
                        client: t("client"),
                        publishedAt: c.publishedAt,
                    }),
                ]}
            />
        </>
    );
}
```

- [ ] **Step 4: Lint + build**

```bash
npm run lint && npm run build
```

Expected: build statically generates 5 locales × 3 cases = 15 case study pages.

- [ ] **Step 5: Visual check**

Open `http://localhost:3000/en/work/fb-chain`, `/en/work/fintech-kyc`, `/en/work/retail-analytics`, and the Arabic equivalents. Confirm hero metric, constraints list, timeline rail (mint dots), quote section all render.

- [ ] **Step 6: Commit**

```bash
git add i18n/routing.ts lib/seo.ts app/[locale]/work/[slug]/
git commit -m "$(cat <<'EOF'
feat(work): add /work/[slug] case study route

Statically generates 5 locales × 3 cases. CaseStudyHero + Body +
Metrics + related cards. caseStudyJsonLd emitted as CreativeWork in
JSON-LD. Pathname registered in i18n/routing for locale-aware links.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 39: Restyle `/work` index with `CaseFilter`

**Files:**
- Modify: `app/[locale]/work/page.tsx`

- [ ] **Step 1: Replace contents of `app/[locale]/work/page.tsx`**

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CaseFilter, type EnrichedCase } from "@/components/work/CaseFilter";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";
import { cases } from "@/lib/cases";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Work" });
    return buildMetadata({
        locale: safe,
        path: "/work",
        title: t("title"),
        description: t("description"),
        keywords: ["AI case studies Singapore", "AI projects", "AI implementation"],
    });
}

export default async function WorkPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Work");
    const tNav = await getTranslations("Navigation");

    // Enrich the typed case list with locale-resolved copy. The result is plain
    // serializable JSON — safe to hand to the CaseFilter client component.
    const enriched: EnrichedCase[] = cases.map((c) => ({
        slug: c.slug,
        industry: c.industry,
        headlineMetric: c.headlineMetric,
        client: t(`cases.${c.i18nKey}.client`),
        title: t(`cases.${c.i18nKey}.title`),
        summary: t(`cases.${c.i18nKey}.summary`),
        tags: t.raw(`cases.${c.i18nKey}.tags`) as string[],
    }));

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("work") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
            />

            <Section tone="default" className="pt-0" num="01">
                <CaseFilter cases={enriched} />
            </Section>

            <Section tone="muted" num="02">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-[32px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[40px]">
                        {t("cta.title")}
                    </h2>
                    <p className="mt-4 text-[var(--color-text-secondary)]">{t("cta.subtitle")}</p>
                    <div className="mt-7 flex justify-center">
                        <Button href="/contact" size="lg">
                            {t("cta.primary")} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("work"), path: "/work" },
                ])}
            />
        </>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/work/page.tsx
git commit -m "$(cat <<'EOF'
refactor(work): /work index with CaseFilter chips + MetricBlock cards

Each card leads with the headline metric. Industry chip filter is
client-side; counts read from the typed cases list. Each card links
to /work/[slug].

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 40: Restyle `/services` page — Engagement cards, TimelineRail process, Ownership, FAQ

**Files:**
- Modify: `app/[locale]/services/page.tsx`

- [ ] **Step 1: Replace contents of `app/[locale]/services/page.tsx`**

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { Compass, Layers, GitBranch, Activity, Check, Search, PenTool, Hammer, Rocket, FolderGit2, Database, Quote, FileCheck2 } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TimelineRail } from "@/components/ui/TimelineRail";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const SERVICES = [
    { key: "strategy",  icon: Compass,    accent: "mint" as const },
    { key: "build",     icon: Layers,     accent: "brand" as const },
    { key: "integrate", icon: GitBranch,  accent: "mint" as const },
    { key: "support",   icon: Activity,   accent: "warn" as const },
];

const PROCESS = [
    { key: "discover", icon: Search,  range: "W0–W1" },
    { key: "design",   icon: PenTool, range: "W1–W2" },
    { key: "build",    icon: Hammer,  range: "W2+"   },
    { key: "ship",     icon: Rocket,  range: "—"     },
] as const;

const OWNERSHIP = [
    { key: "repo",    icon: FolderGit2 },
    { key: "data",    icon: Database   },
    { key: "prompts", icon: Quote      },
    { key: "evals",   icon: FileCheck2 },
] as const;

const FAQ = ["ai_fit", "timeline", "team", "lock_in", "data"] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Services" });
    return buildMetadata({
        locale: safe,
        path: "/services",
        title: t("title"),
        description: t("description"),
        keywords: ["AI development services Singapore", "AI strategy", "custom AI products", "AI integrations"],
    });
}

export default async function ServicesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Services");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("services") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
            />

            <Section tone="default" className="pt-0" num="01">
                <div className="grid gap-5 md:grid-cols-2">
                    {SERVICES.map(({ key, icon: Icon, accent }, i) => {
                        const deliverables = t.raw(`items.${key}.deliverables`) as string[];
                        return (
                            <Card key={key} accent={accent} interactive className="flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t(`items.${key}.title`)}
                                    </h2>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                        {t(`items.${key}.summary`)}
                                    </p>
                                </div>
                                <ul className="space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                                    {deliverables.map((d) => (
                                        <li key={d} className="flex gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                                            <span>{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            <Section tone="muted" num="02">
                <div className="max-w-2xl">
                    <Eyebrow>{t("process.eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px] lg:text-[48px]">
                        {t("process.title")}
                    </h2>
                </div>

                <div className="mt-12">
                    <TimelineRail
                        steps={PROCESS.map(({ key, range }) => ({
                            label: t(`process.steps.${key}.title`),
                            range,
                            body: t(`process.steps.${key}.desc`),
                        }))}
                    />
                </div>
            </Section>

            <Section tone="default" num="03">
                <div className="max-w-2xl">
                    <Eyebrow>{t("ownership.eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                        {t("ownership.title")}
                    </h2>
                </div>

                <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
                    {OWNERSHIP.map(({ key, icon: Icon }) => (
                        <li key={key} className="bg-[var(--color-surface-1)] p-6">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                <Icon className="h-4 w-4" />
                            </span>
                            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {t(`ownership.items.${key}.title`)}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                {t(`ownership.items.${key}.desc`)}
                            </p>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section tone="muted" num="04">
                <div className="max-w-2xl">
                    <Eyebrow>{t("faq.eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                        {t("faq.title")}
                    </h2>
                </div>

                <ul className="mt-12 divide-y divide-[var(--color-border-subtle)] border-y border-[var(--color-border-subtle)]">
                    {FAQ.map((key) => (
                        <li key={key} className="grid gap-2 py-6 lg:grid-cols-12 lg:gap-10">
                            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)] lg:col-span-5">
                                {t(`faq.items.${key}.q`)}
                            </h3>
                            <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] lg:col-span-7">
                                {t(`faq.items.${key}.a`)}
                            </p>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section tone="default" num="05">
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-10 text-center sm:p-14">
                    <h2 className="font-display text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[36px]">
                        Ready to scope a project?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-[var(--color-text-secondary)]">
                        Tell us about the workflow you&rsquo;d like AI to take on. We&rsquo;ll come back within one working day.
                    </p>
                    <div className="mt-7 flex justify-center">
                        <Button href="/contact" size="lg">
                            Start a project <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("services"), path: "/services" },
                ])}
            />
        </>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/services/page.tsx
git commit -m "$(cat <<'EOF'
refactor(services): adopt new system; TimelineRail process; ownership + faq

Process becomes a TimelineRail with mono W-range markers. New
'ownership' grid (Repo/Data/Prompts/Evals) and a five-question FAQ.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 41: Restyle `/products` page — installation timeline + new system

**Files:**
- Modify: `app/[locale]/products/page.tsx`

- [ ] **Step 1: Replace contents of `app/[locale]/products/page.tsx`**

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Bot, Workflow, FileSearch, MessageSquareCode, ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CodeChip } from "@/components/ui/CodeChip";
import { TimelineRail } from "@/components/ui/TimelineRail";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const PRODUCTS = [
    { key: "assistant",  icon: Bot,               accent: "mint" as const },
    { key: "automation", icon: Workflow,          accent: "brand" as const },
    { key: "documents",  icon: FileSearch,        accent: "warn" as const },
    { key: "analytics",  icon: MessageSquareCode, accent: "mint" as const },
];

const INSTALL = ["scope", "adapt", "integrate", "handoff"] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Products" });
    return buildMetadata({
        locale: safe,
        path: "/products",
        title: t("title"),
        description: t("description"),
        keywords: ["AI products for SMEs", "AI assistant", "document intelligence", "conversational analytics"],
    });
}

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Products");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("products") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
            />

            <Section tone="default" className="pt-0" num="01">
                <div className="grid gap-5 md:grid-cols-2">
                    {PRODUCTS.map(({ key, icon: Icon, accent }) => {
                        const highlights = t.raw(`items.${key}.highlights`) as string[];
                        return (
                            <Card key={key} accent={accent} interactive className="flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-[6px] bg-[var(--color-mint-soft)] px-2 py-0.5 font-mono text-[10px] lowercase text-[var(--color-mint)]">
                                        <Sparkles className="h-3 w-3" /> productized
                                    </span>
                                </div>
                                <div>
                                    <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                        {t(`items.${key}.title`)}
                                    </h2>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                        {t(`items.${key}.summary`)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {highlights.map((h) => (
                                        <CodeChip key={h}>{h}</CodeChip>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            <Section tone="muted" num="02">
                <div className="max-w-2xl">
                    <Eyebrow>{t("install.eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                        {t("install.title")}
                    </h2>
                </div>
                <div className="mt-12">
                    <TimelineRail
                        steps={INSTALL.map((key) => ({
                            label: t(`install.steps.${key}.title`),
                            range: t(`install.steps.${key}.range`),
                            body: t(`install.steps.${key}.desc`),
                        }))}
                    />
                </div>
            </Section>

            <Section tone="default" num="03">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-display text-[32px] font-bold tracking-tight text-[var(--color-text-primary)] sm:text-[40px]">
                        {t("cta.title")}
                    </h2>
                    <p className="mt-4 text-[var(--color-text-secondary)]">{t("cta.subtitle")}</p>
                    <div className="mt-7 flex justify-center">
                        <Button href="/contact" size="lg">
                            {t("cta.primary")} <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("products"), path: "/products" },
                ])}
            />
        </>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/products/page.tsx
git commit -m "$(cat <<'EOF'
refactor(products): adopt new system; install timeline

Product highlights become CodeChips; new installation TimelineRail
(Scope → Adapt → Integrate → Hand-off) with mono week markers.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 42: Restyle `/about` page — editorial story + "Where we work"

**Files:**
- Modify: `app/[locale]/about/page.tsx`

- [ ] **Step 1: Replace contents of `app/[locale]/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { ShieldCheck, KeyRound, ServerCog } from "lucide-react";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const PRINCIPLES = [
    { key: "honest",     icon: ShieldCheck },
    { key: "owned",      icon: KeyRound    },
    { key: "production", icon: ServerCog   },
] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.About" });
    return buildMetadata({
        locale: safe,
        path: "/about",
        title: t("title"),
        description: t("description"),
        keywords: ["Infanina team", "AI studio Singapore", "AI agency about"],
    });
}

export default async function AboutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("About");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("about") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
            />

            <Section tone="default" className="pt-0" num="01">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <Eyebrow>{t("story.eyebrow").toLowerCase()}</Eyebrow>
                        <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                            {t("story.title")}
                        </h2>
                    </div>
                    <div className="lg:col-span-7 space-y-5 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                        <p>{t("story.body_1")}</p>
                        <p>{t("story.body_2")}</p>
                    </div>
                </div>
            </Section>

            <Section tone="muted" num="02">
                <div className="max-w-2xl">
                    <Eyebrow>{t("principles.eyebrow").toLowerCase()}</Eyebrow>
                    <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                        {t("principles.title")}
                    </h2>
                </div>

                <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-border-subtle)] sm:grid-cols-3">
                    {PRINCIPLES.map(({ key, icon: Icon }) => (
                        <li key={key} className="bg-[var(--color-surface-1)] p-7">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--color-mint-soft)] text-[var(--color-mint)]">
                                <Icon className="h-4 w-4" />
                            </span>
                            <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                {t(`principles.items.${key}.title`)}
                            </h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                                {t(`principles.items.${key}.desc`)}
                            </p>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section tone="default" num="03">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-center">
                    <div className="lg:col-span-7">
                        <Eyebrow>{t("where.eyebrow").toLowerCase()}</Eyebrow>
                        <h2 className="mt-4 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[44px]">
                            {t("where.title")}
                        </h2>
                        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
                            {t("where.body")}
                        </p>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 font-mono text-[12px] text-[var(--color-text-secondary)]" dir="ltr">
                            <p className="text-[var(--color-text-muted)]">// based</p>
                            <p className="mt-1 text-[var(--color-text-primary)]">singapore (sg)</p>
                            <p className="mt-4 text-[var(--color-text-muted)]">// working across</p>
                            <p className="mt-1 text-[var(--color-text-primary)]">malaysia · indonesia · vietnam · thailand · philippines</p>
                            <p className="mt-4 text-[var(--color-text-muted)]">// contracts</p>
                            <p className="mt-1 text-[var(--color-text-primary)]">SGD · USD on request</p>
                        </div>
                    </div>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("about"), path: "/about" },
                ])}
            />
        </>
    );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/about/page.tsx
git commit -m "$(cat <<'EOF'
refactor(about): new system + 'Where we work' block

Adds the new Where section with a mono based/working-across/contracts
callout panel. Story section keeps its grid; principles refreshed.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 43: Restyle `/contact` page + ContactForm chrome

**Files:**
- Modify: `app/[locale]/contact/page.tsx`, `components/contact/ContactForm.tsx`

- [ ] **Step 1: Replace contents of `app/[locale]/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { JsonLd } from "@/components/page/JsonLd";
import { Section } from "@/components/ui/Section";
import { MonoMeta } from "@/components/ui/MonoMeta";
import { ContactForm } from "@/components/contact/ContactForm";
import { routing } from "@/i18n/routing";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE, type Locale } from "@/lib/site";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Contact" });
    return buildMetadata({
        locale: safe,
        path: "/contact",
        title: t("title"),
        description: t("description"),
        keywords: ["contact AI agency Singapore", "AI consultation", "Infanina contact"],
    });
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Contact");
    const tNav = await getTranslations("Navigation");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tNav("contact") }]} />
            <PageHero
                eyebrow={t("hero.eyebrow")}
                title={t("hero.title")}
                subtitle={t("hero.subtitle")}
            />

            <Section tone="default" className="pt-0" num="01">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-7 sm:p-9">
                            <ContactForm fallbackEmail={SITE.email} />
                        </div>
                    </div>

                    <aside className="lg:col-span-5 space-y-8">
                        <MonoMeta
                            items={[
                                { label: "email",     value: <a className="hover:text-[var(--color-mint)]" href={`mailto:${SITE.email}`}>{SITE.email}</a> },
                                { label: "office",    value: t("side.address_value") },
                                { label: "response",  value: t("side.hours_value") },
                            ]}
                        />
                        <div className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-6 font-mono text-[12px] text-[var(--color-text-secondary)]" dir="ltr">
                            <p className="text-[var(--color-text-muted)]">// what to include</p>
                            <ul className="mt-3 space-y-2 list-none">
                                <li>· the workflow you want AI to take on</li>
                                <li>· your team shape and tools</li>
                                <li>· a rough timeline if you have one</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </Section>

            <JsonLd
                data={breadcrumbJsonLd(safe, [
                    { name: tNav("home"), path: "/" },
                    { name: tNav("contact"), path: "/contact" },
                ])}
            />
        </>
    );
}
```

- [ ] **Step 2: Update the ContactForm success state in `components/contact/ContactForm.tsx`**

Replace ONLY the success-state JSX (the `if (state.status === "success") { return (...) }` block, lines 36-51) with:

```tsx
    if (state.status === "success") {
        return (
            <div
                role="status"
                className="rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-surface-1)] overflow-hidden font-mono text-[13px]"
                dir="ltr"
            >
                <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-2.5">
                    <span aria-hidden className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                    </span>
                    <span className="ms-2 text-[11px] tracking-[0.04em] text-[var(--color-text-muted)]">infanina:~</span>
                </div>
                <div className="px-5 py-4 leading-[1.6] text-[var(--color-text-secondary)]">
                    <div>
                        <span className="text-[var(--color-mint)]">→ </span>
                        <span className="text-[var(--color-text-primary)] font-semibold">{t("success_title")}</span>
                    </div>
                    <div className="mt-1">
                        <span className="text-[var(--color-mint)]">→ </span>
                        {t("success_body")}
                    </div>
                </div>
            </div>
        );
    }
```

(The rest of the form body stays unchanged for now — it already styles cleanly against the new tokens.)

- [ ] **Step 3: Update the submit button styling**

Replace the `<button>` inside `SubmitButton` (top of `ContactForm.tsx`) with the new flatter styling:

```tsx
        <button
            type="submit"
            disabled={pending}
            data-focus-ring
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--color-brand)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] disabled:opacity-60 disabled:cursor-not-allowed dark:bg-[var(--color-mint)] dark:text-[var(--color-surface-0)] dark:hover:brightness-110"
        >
            <Send className="h-4 w-4" />
            {pending ? busy : idle}
        </button>
```

Removes the brand-shadow + lift; mint primary in dark to match Button.

- [ ] **Step 4: Lint + build**

```bash
npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/contact/page.tsx components/contact/ContactForm.tsx
git commit -m "$(cat <<'EOF'
refactor(contact): MonoMeta side panel + terminal success state

Sidebar becomes a mono dl + 'what to include' panel. Form success
state renders as a terminal output. Submit button mirrors Button
primary (mint in dark).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 44: Light pass on `/privacy` and `/terms`

**Files:**
- Modify: `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`

The visual change is minimal: PageHero already inherits the new look, so we just adjust the body container and update the `withBackdrop={false}` for these calmer pages.

- [ ] **Step 1: Replace contents of `app/[locale]/privacy/page.tsx`**

```tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { PageHero } from "@/components/page/PageHero";
import { Breadcrumbs } from "@/components/page/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { MonoMeta } from "@/components/ui/MonoMeta";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/site";

const SECTIONS = ["collection", "use", "retention", "rights", "contact"] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    const t = await getTranslations({ locale: safe, namespace: "Meta.Privacy" });
    return buildMetadata({
        locale: safe,
        path: "/privacy",
        title: t("title"),
        description: t("description"),
    });
}

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const safe = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
    setRequestLocale(safe);

    const t = await getTranslations("Legal.Privacy");
    const tNav = await getTranslations("Navigation");
    const tFooter = await getTranslations("Footer");

    return (
        <>
            <Breadcrumbs items={[{ name: tNav("home"), href: "/" }, { name: tFooter("privacy_link") }]} />
            <PageHero eyebrow={t("updated")} title={t("title")} subtitle={t("intro")} withBackdrop={false} />

            <Section tone="default" className="pt-0">
                <div className="mx-auto max-w-3xl">
                    <MonoMeta
                        items={[
                            { label: "last updated", value: t("updated").replace(/^Last updated:\s*/, "") },
                        ]}
                        className="mb-10"
                    />
                    <div className="space-y-10">
                        {SECTIONS.map((key) => (
                            <section key={key}>
                                <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                                    {t(`sections.${key}_title`)}
                                </h2>
                                <p className="mt-3 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
                                    {t(`sections.${key}_body`)}
                                </p>
                            </section>
                        ))}
                    </div>
                </div>
            </Section>
        </>
    );
}
```

- [ ] **Step 2: Replace contents of `app/[locale]/terms/page.tsx` with the same structure**

Same as Privacy, with `SECTIONS = ["use", "ip", "liability", "law"] as const;` and namespace `Legal.Terms`. Adjust the imports and namespace accordingly.

- [ ] **Step 3: Lint + build + commit**

```bash
npm run lint && npm run build
git add app/[locale]/privacy/page.tsx app/[locale]/terms/page.tsx
git commit -m "$(cat <<'EOF'
style(legal): light pass on privacy and terms

MonoMeta 'last updated', PageHero with backdrop disabled, body shape
preserved. Calm pages stay calm.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 45: Extend `app/sitemap.ts` with case study slugs

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Replace contents of `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { cases } from "@/lib/cases";

const ROUTES = ["", "/services", "/products", "/work", "/about", "/contact", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const pageRoutes: MetadataRoute.Sitemap = ROUTES.flatMap((route) =>
        SITE.locales.map((locale) => ({
            url: `${SITE.url}/${locale}${route}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: route === "" ? 1.0 : route === "/contact" ? 0.9 : 0.7,
            alternates: {
                languages: Object.fromEntries(
                    SITE.locales.map((l) => [l, `${SITE.url}/${l}${route}`]),
                ),
            },
        })),
    );

    const caseRoutes: MetadataRoute.Sitemap = cases.flatMap((c) =>
        SITE.locales.map((locale) => ({
            url: `${SITE.url}/${locale}/work/${c.slug}`,
            lastModified: new Date(c.publishedAt),
            changeFrequency: "yearly" as const,
            priority: 0.6,
            alternates: {
                languages: Object.fromEntries(
                    SITE.locales.map((l) => [l, `${SITE.url}/${l}/work/${c.slug}`]),
                ),
            },
        })),
    );

    return [...pageRoutes, ...caseRoutes];
}
```

- [ ] **Step 2: Lint + build + commit**

```bash
npm run lint && npm run build
git add app/sitemap.ts
git commit -m "$(cat <<'EOF'
feat(seo): include case study slugs in sitemap

Adds 5 locales × 3 case slugs = 15 URLs to the sitemap with each
case's publishedAt as lastModified.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Cleanup & Verification

### Task 46: Remove unused CSS (mesh-backdrop) and decorative utilities

**Files:**
- Modify: `app/globals.css`

The `MeshBackdrop` component is gone (Task 5); the `.mesh-backdrop` CSS is dead weight. Remove it now.

- [ ] **Step 1: Delete the mesh-backdrop CSS block**

In `app/globals.css`, delete the entire block from the comment `/* =============================================================
   Mesh + grain backdrop — the signature flourish.` through the closing `}` of `@keyframes mesh-drift` (about 45 lines), and the `.dark .mesh-backdrop::before { ... }` block. Also remove the `.mesh-backdrop::before { animation: none; }` line inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 2: Drop the now-unused `brand-mark` utility**

Search for `.brand-mark` usage: `grep -rn "brand-mark" components/ app/`. After Task 10, no component should use it. Delete the `.brand-mark { ... }` block from `globals.css`.

- [ ] **Step 3: Lint + build + commit**

```bash
npm run lint && npm run build
git add app/globals.css
git commit -m "$(cat <<'EOF'
chore(css): remove unused mesh-backdrop and brand-mark utilities

Cleaned up after MeshBackdrop deletion and Logo gradient inlining.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 47: Final verification matrix

**Files:** none modified — this is verification only.

- [ ] **Step 1: Lint clean across the full repo**

```bash
npm run lint
```

Expected: exit 0, no warnings.

- [ ] **Step 2: Production build succeeds**

```bash
npm run build
```

Expected: clean; 5 locales × 8 routes + 5 locales × 3 case studies = ~55 static pages generated. Read the output and confirm `/[locale]/work/[slug]` shows up with all 15 slug × locale variants.

- [ ] **Step 3: Spot-check render matrix**

```bash
npm run start
```

Open in a browser and walk through this matrix (8 entries — not all 80 combos):

```
http://localhost:3000/en           (dark, then toggle light)
http://localhost:3000/en/services
http://localhost:3000/en/products
http://localhost:3000/en/work
http://localhost:3000/en/work/fb-chain
http://localhost:3000/en/contact
http://localhost:3000/ar           (RTL — header, marquee, footer, breadcrumb mirror correctly)
http://localhost:3000/zh           (verify Chinese keys still render, no broken keys)
```

For each, check:
- No console errors
- No console warnings about missing translations
- Layout intact at 360px width (DevTools mobile preset)
- Theme toggle works and persists

- [ ] **Step 4: Reduced-motion verification**

In macOS DevTools (Sources → "Render" tab → Emulate CSS media feature `prefers-reduced-motion: reduce`), reload `/en` and confirm:
- Mesh scanline does not animate
- Marquee does not scroll
- Tick cursor does not blink
- Reveal animations appear immediately (no transition)

- [ ] **Step 5: Lighthouse pass (optional but recommended)**

In Chrome DevTools → Lighthouse → Performance + SEO + Accessibility on mobile preset for `http://localhost:3000/en`.

Target: ≥ 95 Performance, 100 SEO, 100 Accessibility. If any score is below target, capture the suggestions for a follow-up — do not block the overhaul on these.

- [ ] **Step 6: Final commit (changelog only)**

If you've kept a CHANGELOG.md, append the overhaul entry now. Otherwise this step is a no-op.

```bash
git log --oneline -50  # confirm the trail of commits looks clean
```

- [ ] **Step 7: Stop the brainstorming server and clean up local workspace**

```bash
/Users/syednizamudeen/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/scripts/stop-server.sh /Users/syednizamudeen/www/home-lab/web/infanina/.superpowers/brainstorm/29089-1778593177/state || true
```

(The `.superpowers/` directory is gitignored as of Task 1.)

---

## Done

The overhaul is complete when Task 47 ends green. All 47 tasks committed individually means the entire overhaul lives in ~47 commits on top of `main` — review and revert in granular chunks if any single phase needs rework.


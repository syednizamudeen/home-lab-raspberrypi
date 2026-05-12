# Infanina — Full Site Overhaul (2026)

**Status:** Approved design, awaiting written-spec review before implementation planning.
**Date:** 2026-05-12
**Scope:** Full visual + structural redesign across all 8 routes, new `/work/[slug]` route, new content sections.

---

## 1. Context & goal

Infanina is a Singapore AI product studio marketing site (Next.js 16, React 19, Tailwind v4, next-intl across en/ms/zh/ta/ar). The current site is already polished — Ocean Blue design system, dark mode, animations, SEO, RTL — but reads as "well-built generic SaaS marketing." The goal is to upgrade it into an **engineering-confident** identity that matches Infanina's positioning ("less hype, more shipping", "production-first", "you own everything"). The site should feel built by the kind of team a buyer would want to hire.

The overhaul is a single sweep: tokens, components, all 8 pages, plus a new per-case-study route and three new content sections (testimonials, engagement packages, case study deep dives).

## 2. Foundational decisions (locked)

| Decision | Choice | Notes |
|---|---|---|
| Design direction | **A · Engineer-confident** | Dark-first, mono accents, terminal/console aesthetic, subtle motion |
| Palette | **A1 · Carbon + Ocean** | Keeps Ocean Blue brand equity; mint is the new "engineering" accent |
| Default theme | **Dark** | Light mode remains fully supported; system preference still honoured |
| Typography | **Geist + Inter + Geist Mono** | Geist (display), Inter (body, kept), Geist Mono (system/status) |
| Page scope | **All 8 pages in one sweep** | Avoids the awkward middle-period split |
| New content | **Testimonials, Engagement packages, Per-case-study pages** | Blog/notes explicitly out of scope |

## 3. Design tokens

Replaces the current Ocean palette in `app/globals.css`. Dark is canonical. Light mode retains the current paper-toned surfaces from today's `globals.css` (`#F7FAFC` / `#FFFFFF` / `#F2F6FA` / `#E6EEF6`) and gains the new mint accent at a darker tone (`#0E9F86`) for AA contrast on paper.

**Surfaces (dark canonical):**
- `--surface-0: #0A0D12` (carbon — page bg)
- `--surface-1: #0E1422` (slate — section bg)
- `--surface-2: #16203A`
- `--surface-3: #1F2A48`

**Brand & accents:**
- `--brand: #007CBE` (light), `#38BDF8` (dark lifted)
- `--mint: #71F2DA` (new engineering accent — status, code chips, in-app accents)
- `--live: #22C55E`, `--warn: #FBAF00`, `--danger: #E5484D`

**Text:**
- `--text-primary: #ECEEF2`
- `--text-secondary: #B4BAC6`
- `--text-muted: #7E8AA1`

**Borders:**
- `--border-subtle: #1B2436`
- `--border-default: #243049`
- `--border-strong: #2E3B58`

**Radius:** `--radius-sm: 6px`, `--radius-md: 10px`, `--radius-lg: 14px`. Tighter than today's 8/12/16; the engineering aesthetic reads in sharper corners.

**Shadow:** reduced. Cards rely on borders for separation; only buttons/modals carry shadow.

**Typography scale:**
- Hero: `clamp(48px, 8vw, 96px)`, tracking `-0.035em`
- H2: `clamp(36px, 5vw, 60px)`, tracking `-0.03em`
- H3: 24px, tracking `-0.02em`
- Body: 16/15px, line-height 1.5
- Mono accents: 11–13px, tracking `0.04em–0.12em`

**Motion:** keeps `Reveal` (IntersectionObserver) and `hero-stagger`. `MeshBackdrop` is replaced by `GridBackdrop` (1px CSS grid + center fade mask + one slow-moving highlight bar). New `tick-cursor` (blinking block cursor) for mono accents. `prefers-reduced-motion` already respected.

## 4. Component primitives

### 4.1 New (`components/ui/`)

| Component | Purpose |
|---|---|
| `StatusBar` | Slim top bar: `infanina.studio · sg · 03:24 SGT · v2026.05` in mono, live dot, language + theme controls. |
| `MonoMeta` | Mono caption block — used as eyebrow on every section (`// 003 · Custom AI products`, `$ infanina ship --to=prod`). |
| `Terminal` | Boxed terminal frame with traffic-light header and typewriter lines. Used in Hero (lg right column) and AIShowcase. |
| `TimelineRail` | Vertical ticked rail with mono week markers. Used on Services and case study pages. |
| `MetricBlock` | Large numeric callout with mono delta label (e.g. `68% ↓ handling time`). Used on Stats, Work cards, case hero. |
| `GridBackdrop` | Replaces `MeshBackdrop`. 1px grid with center fade and a slow-moving highlight bar. |
| `CodeChip` | Inline mono pill (`RAG`, `OCR+LLM`, `gpt-4o`). Used in tag groups. |
| `Marquee` | Extracted from Hero — reusable for trusted-by and capability strips. |

### 4.2 Revised

| Component | Change |
|---|---|
| `Button` | Primary becomes mint-on-carbon in dark, ink-on-paper in light. Secondary becomes 1px border. New `kbd` variant (mono with keyboard-cap shadow). |
| `Card` | Flatter; sharp 1px border; no default shadow; hover lifts via border-color shift to mint. Accent variants become a single mono top-edge rule, not a coloured fill. |
| `Section` | Adds optional `mono` eyebrow slot and a faint vertical guide ruler on the left edge with mono section numbering. |
| `Eyebrow` | Default switches to mono Geist Mono uppercase. `display` variant preserved. |
| `Logo` | Wordmark uses Geist 700. `brand-mark` gradient flips from coral-tinged to mint-tinged. |

### 4.3 Deprecated

- `MeshBackdrop` — deleted, replaced by `GridBackdrop`.

## 5. Home page composition

Nine sections (was seven). Order is conversion-optimized: positioning → capability → proof → ask.

| # | Section | Notes |
|---|---|---|
| 1 | Hero | Two-column on lg. Left: StatusBar → mono eyebrow → display headline ("AI products / **that ship.**" — mint gradient on `ship.`) → subtitle → primary + secondary CTA → `kbd` hint. Right (lg only): Terminal cycling typewriter lines of shipped events. |
| 2 | Trusted-by | Extracted from Hero into a slim band. Mono label + Marquee with industry labels. Edge gradients. |
| 3 | ValueProps | Build / Integrate / Support — kept structure, flat cards with mono top-edge accent. |
| 4 | Engagements (NEW) | Merges services overview + packages. Four cards: Strategy sprint, Build, Integrate, Support. Each shows title, summary, timeline shape (`▰▰▱▱`), starts-from line, 3 deliverable bullets. Links to /services. |
| 5 | AIShowcase | Same chat demo, reframed in Terminal chrome. Adds "View source" mono link revealing a fake JSON request panel. |
| 6 | SelectedWork | Three featured cases. Each card: hero MetricBlock on top, client, title, summary, tag CodeChips, "Read case →" linking to `/work/[slug]`. |
| 7 | Testimonials (NEW) | Three quotes rendered as system messages: quote in display weight, attribution in mono metadata. Optional initial-disc avatar. Light client-logos strip below. |
| 8 | Stats | Same four numbers (`40+`, `120+`, `5`, `99.95%`) as MetricBlock row on a single horizontal rule. Existing `CountUp` wired in. |
| 9 | CTABand | Calmer, single-line. Display headline + primary CTA + mono email secondary. |

## 6. Per-page treatments

**`/services`** — Hero with mono eyebrow + headline. Four detailed engagement cards (full deliverables). `TimelineRail` for process (Discover → Design → Build → Ship) with mono week markers. New "What you own at the end" callout (Repo / Data / Prompts / Evals). FAQ accordion (5 questions). CTABand.

**`/products`** — Hero. Four expanded product cards: title, summary, capability CodeChips, small wireframe preview (Assistant: chat bubble; Automation: workflow; Documents: doc-with-overlay; Analytics: chart). "How a product is installed" — Scope · Adapt · Integrate · Hand-off with mono week markers. CTABand.

**`/work` (index)** — Hero. Filter tabs (`All / F&B / Retail / Fintech / Public`) with mono counts. Grid of case cards linking to `/work/[slug]`. CTABand.

**`/work/[slug]` (NEW)** — dynamic route, statically generated per case from `lib/cases/`. Page shape:
1. Hero — mono breadcrumb, client, title, headline MetricBlock
2. Context — what the business does, why this mattered
3. Constraints — bullet list as mono items
4. Approach — 3-4 numbered subsections with optional inline diagrams
5. Outcome — 2-3 MetricBlocks side-by-side
6. Stack — CodeChip grid
7. Quote from client (Testimonials chrome)
8. Related cases (2)
9. CTABand

Three case studies seeded at launch: `fb-chain`, `fintech-kyc`, `retail-analytics`.

**`/about`** — Hero. Editorial story ("Why we started", larger and longer-form). Principles (3 cards, kept). New "Where we work" — Singapore + SEA context with mono callout. CTABand.

**`/contact`** — Hero. Form (left, 2/3) + side panel (right, 1/3) on lg. Side panel keeps email/office/hours as MonoMeta blocks. Form restyled flat with mono labels. Success state renders as Terminal (`→ message received · we'll reply within 1 working day`).

**`/privacy`** and **`/terms`** — light pass: mono breadcrumb, MonoMeta for "last updated", typographic refresh, rest unchanged.

**`Header`** — minimal: logo (start) · nav (center, mono caps) · LanguageSwitcher · ThemeToggle · `Start a project` primary. On scroll: shrinks, gains 1px bottom border.

**`Footer`** — 4 columns (Company / Explore / Contact / Legal). Bottom rule with mono copyright. No marketing fluff.

## 7. Content & i18n strategy

### 7.1 New message namespaces (mirrored across all 5 locales)

```
Home.engagements.*           — merged services-overview + packages
Home.testimonials.*          — 3 client quotes + attribution
Work.cases.<slug>.detail.*   — full case body per slug
Work.filters.*               — filter tab labels
Services.faq.*               — 5 Q&A pairs
Services.ownership.*         — "What you own at the end"
Products.install.*           — installation timeline 4 steps
About.where.*                — Singapore/SEA context
Common.kbd.*                 — keyboard hint labels
StatusBar.*                  — time/version/status labels
```

### 7.2 Typed content modules

`lib/cases/` carries the structural data (slugs, stack tags, metric numbers) where type-safety matters; prose lives in `messages/*.json` under `Work.cases.<slug>.detail` so translators work in one place.

```ts
// lib/cases/index.ts
export interface Case {
  slug: string;
  client: string;
  industry: 'fb' | 'retail' | 'fintech' | 'public' | 'logistics';
  headlineMetric: { value: string; label: string };
  outcomes: Metric[];
  stack: string[];
  relatedSlugs: string[];
}
```

### 7.3 i18n discipline

Every new key added to `en.json` is mirrored across `ms.json`, `zh.json`, `ta.json`, `ar.json` in the same change (per CLAUDE.md). English is canonical for launch; non-English locales get machine-translated drafts with TODO markers logged separately in `messages/.review.md` so nothing renders blank.

### 7.4 Engagement timeline shapes

Encoded as data, not text. Each engagement carries `{ weeks: number, shape: 'sprint' | 'build' | 'ongoing' }`. The `▰▰▱▱` rendering is computed client-side. No translation required.

### 7.5 Testimonials

Three quotes at launch, one per seeded case. If real client quotes are not available pre-launch, design ships with realistic-but-marked placeholders and a code comment flagging where to swap.

### 7.6 Routing

`i18n/routing.ts` gains `/work/[slug]` in the locale-aware pathnames map. No other route changes.

### 7.7 SEO

- `breadcrumbJsonLd` in `lib/seo.ts` extended for case study breadcrumbs.
- `/work/[slug]` emits `CreativeWork` / `Article` JSON-LD with author=Infanina, datePublished, inLanguage.
- New `app/sitemap.ts` enumerating all locales × all routes including case slugs.
- New `app/robots.ts` if not already present.

### 7.8 Accessibility & RTL

- All new components use logical properties (`ps-*` / `pe-*` / `start-*` / `end-*`).
- Directional mono accents (timeline rails) flip in RTL.
- `Terminal` and `MonoMeta` carry `aria-label`s; decorative typewriter animation is `aria-hidden`.
- Mint (#71F2DA) on carbon (#0A0D12) verified AA-large for accents; never used for body text.

## 8. Implementation phasing

Single-sweep but ordered so the site never sits in a broken intermediate state:

1. **Tokens + fonts** — `globals.css`, `layout.tsx`, ThemeProvider default. (Site will look odd against old components; that's fine.)
2. **UI primitives** — revise existing 5; add new 8. Standalone; no page touches.
3. **Header + Footer** — restyle so chrome feels new while pages are still mid-transition.
4. **Home page sections** — rebuild in display order: Hero, TrustedBy, ValueProps, Engagements, AIShowcase, SelectedWork, Testimonials, Stats, CTABand. One commit per section.
5. **Services / Products / About / Contact** — apply new system.
6. **Work index + `/work/[slug]`** — content modules, new route, SEO additions, sitemap.
7. **i18n sweep** — add missing keys in EN, mirror across MS/ZH/TA/AR with `.review.md` log.
8. **Verification** — lint, build, manual passes (light/dark, RTL, mobile, all locales).

## 9. File-level change map

```
app/[locale]/layout.tsx                  swap fonts → Geist + Geist Mono; defaultTheme="dark"
app/globals.css                          replace tokens (A1); tighten radius/shadow; new mono utilities; mesh → grid
app/[locale]/page.tsx                    new section order
app/[locale]/work/[slug]/page.tsx        NEW (generateStaticParams over locales × cases)
app/sitemap.ts                           NEW
app/robots.ts                            NEW (if absent)

components/ui/
  Button.tsx, Card.tsx, Section.tsx, Eyebrow.tsx, Logo.tsx   restyle
  MeshBackdrop.tsx                                            DELETE
  GridBackdrop.tsx, StatusBar.tsx, MonoMeta.tsx, Terminal.tsx,
  TimelineRail.tsx, MetricBlock.tsx, CodeChip.tsx, Marquee.tsx  NEW

components/home/
  Hero.tsx (rebuild), ValueProps.tsx, AIShowcase.tsx, SelectedWork.tsx,
  Stats.tsx, CTABand.tsx                                       restyle
  TrustedBy.tsx, Engagements.tsx, Testimonials.tsx             NEW
  ServicesOverview.tsx                                          kept, repurposed for /services detail

components/work/
  CaseStudyHero.tsx, CaseStudyBody.tsx, CaseStudyMetrics.tsx,
  CaseFilter.tsx                                                NEW

components/layout/
  Header.tsx, Footer.tsx                                        restyle
  ThemeProvider.tsx                                             defaultTheme="dark"

lib/cases/
  index.ts, fb-chain.ts, fintech-kyc.ts, retail-analytics.ts   NEW

lib/seo.ts                                                      extend with caseStudyJsonLd

messages/{en,ms,zh,ta,ar}.json                                 new namespaces in lockstep

i18n/routing.ts                                                add /work/[slug] pathname
```

## 10. Out of scope

- Blog / notes / writing page
- Real client quotes (placeholders ship; swap when available)
- New illustrations or photography (system is type-first)
- Animation library beyond CSS + IntersectionObserver (no Framer Motion)
- Pricing in S$ (timeline shapes only)
- Backend / form-wiring changes beyond what `ContactForm.tsx` already does
- CMS migration (cases stay in TypeScript + JSON)

## 11. Verification gates

Before declaring done:

- `npm run lint` clean
- `npm run build` succeeds
- Each route × each locale × dark/light renders correctly (spot-checked, not exhaustive — 80 view combinations)
- RTL pass on Arabic locale
- Reduced-motion pass
- Lighthouse on home/mobile: ≥ 95 performance, 100 SEO, 100 a11y

## 12. Risks

| Risk | Mitigation |
|---|---|
| Translation drift across 5 locales | `.review.md` log; later, a CI lint that checks key parity. |
| Geist font load cost | `next/font/google` with `display: 'swap'`, `subsets: ['latin']`; fallback stack in CSS. |
| Case study content quality | Seed three from existing summaries; mark generated body with a code comment for pre-launch human review. |
| Dark-as-default regression for current visitors | System preference still honoured; only changes the default for users without preference. |
| Single-sweep scope creep | Phasing in §8 keeps each step independently shippable; if work stretches, the site is still in a coherent state after step 4. |

## 13. Open questions

None at the time of writing. All choices in §2 are locked. The next step is to write an implementation plan against this spec.

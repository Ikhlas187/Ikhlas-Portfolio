---
name: clone-website
description: Reverse-engineer and rebuild any website as a pixel-perfect Next.js 16 + shadcn/ui + Tailwind v4 clone. Uses Chrome MCP for visual inspection, extracts real design tokens and assets, writes exhaustive component specs, then dispatches parallel builder agents in isolated git worktrees. Use when the user wants to clone, replicate, reverse-engineer, copy, rebuild, or reproduce an existing website, even if they just say "I want a site like X", paste a URL asking to recreate it, or use French phrases like "refais-moi ce site", "copie ce site", "clone ce site", "reproduis ce site", or "je veux un site comme celui-ci". Also use when any URL is sent with intent to replicate visual layout, design, or components.
---

## Entrée

- Une ou plusieurs **URL cibles** de sites publics que l'utilisateur a le droit de reproduire.
- Le **périmètre** (`TARGET.md`) : niveau de fidélité, pages, viewports ; par défaut pixel-perfect, home seule.
- Un **MCP navigateur connecté** (Chrome MCP de préférence).

## Sortie

- Un **projet Next.js 16 + shadcn/ui + Tailwind v4** qui reproduit la cible au niveau de fidélité demandé.
- Les **artefacts d'extraction** : screenshots de référence, `BEHAVIORS.md`, `PAGE_TOPOLOGY.md`, specs de composants, assets téléchargés.
- Un **QA visuel** côte à côte validé (1440px et 390px) avec les comportements interactifs testés.

---

Reverse-engineer any target website and rebuild it as a faithful clone using Chrome MCP browser inspection, design token extraction, and parallel builder agents. The output is a Next.js 16 + shadcn/ui + Tailwind v4 project that matches the target 1:1 at the requested fidelity level.

You are not running a two-phase process (inspect, then build). You are a foreman walking the job site: as you inspect each section, you write a detailed specification to a file, then hand that file to a specialist builder agent with everything it needs. Extraction is meticulous and produces auditable artifacts; construction runs in parallel behind it.

## When to trust this skill

The workflow below is designed for real, live public websites you have the right to replicate (portfolio work, learning exercises, demos, internal reference builds, prototype templates). Before starting, confirm the user's legitimate use case if it's not stated. Do not use the skill to build phishing pages, impersonate brands, or copy content for redistribution: those uses are prohibited regardless of technical feasibility. If a request looks like impersonation, stop and ask.

## Scope defaults

The target is whatever page the user's URL(s) resolve to. Clone exactly what's visible at that URL. Unless the user says otherwise:

- **Fidelity level:** Pixel-perfect: exact match on colors, spacing, typography, animations
- **In scope:** Visual layout and styling, component structure and interactions, responsive design, mock data for demo purposes
- **Out of scope:** Real backend/database, authentication, real-time features, SEO optimization, accessibility audit
- **Customization:** None: pure emulation

If the user provides additional instructions (specific fidelity level, customizations, extra context), honor those over the defaults.

**Multiple URLs:** process them independently and in parallel where resources allow, keeping each site's extraction artifacts isolated in dedicated folders: `docs/research/<hostname>/` and `docs/design-references/<hostname>/`. Optionally confirm with the user whether to run them in parallel (recommended) or sequentially to avoid overload.

## Prerequisites: check before phase 1

- **Chrome MCP is connected.** Without it, the reconnaissance phase can't extract real computed styles. If none is detected, ask which browser MCP the user has (Playwright, Browserbase, Puppeteer…) and how to connect it. Prefer Chrome MCP if several exist. This skill cannot work without browser automation.
- **Node.js 20+ available.** Needed to scaffold and run the Next.js target.
- **Base project builds.** Verify `npm run build` on the Next.js 16 + shadcn/ui + Tailwind v4 scaffold. If it isn't in place, tell the user to set it up first.
- **Working directory is empty or dedicated to this clone.** The pipeline writes a lot of files (screenshots, spec docs, downloaded assets). If the directory has existing work, ask before proceeding.
- **Output directories exist:** create `docs/research/`, `docs/research/components/`, `docs/design-references/`, `scripts/` if missing.

## Guiding principles

These are the truths that separate a successful clone from a "close enough" mess. Internalize them: they inform every decision below.

1. **Completeness beats speed.** Every builder must receive everything it needs: screenshot, exact CSS values, downloaded assets with local paths, real text, component structure. If a builder has to guess a color, a font size, a padding: extraction failed. Take the extra minute.
2. **Small tasks, perfect results.** "Build the entire features section" produces approximations. A single focused component with exact CSS values gets nailed every time. **Complexity budget rule:** if a builder prompt exceeds ~150 lines of spec content, the section is too complex for one agent: split it. Mechanical check; don't override with "but it's all related."
3. **Real content, real assets.** Extract actual text, images, videos, SVGs from the live site: this is a clone, not a mockup. Layered assets matter: a section that looks like one image is often a background + a foreground UI PNG + an overlay icon. Enumerate ALL `<img>` and background images in each container, including absolutely-positioned overlays. Missing an overlay makes the clone look empty.
4. **Foundation first.** Nothing gets built until global CSS tokens, TypeScript types, and global assets (fonts, favicons, icons) exist. Sequential and non-negotiable. Everything after is parallel.
5. **Extract how it looks AND how it behaves.** A website is a living thing. For every element extract its appearance (exact `getComputedStyle()`) AND its behavior (what changes, what triggers it, how it transitions). Not "the nav changes on scroll": the exact trigger (scroll px / IntersectionObserver threshold), the before/after CSS, and the transition (duration, easing, CSS vs JS vs animation-timeline).
6. **Identify the interaction model BEFORE building.** The single most expensive mistake is building a click-based UI when the original is scroll-driven, or vice versa. Don't click first: scroll slowly and watch whether things change on their own. If they do → scroll-driven (find the mechanism). If nothing moves on scroll → then test click/hover. Document it explicitly in every interactive spec.
7. **Extract every state, not just the default.** Tabs show different cards per tab; a header differs at scroll 0 vs 100; cards have hover states. Capture ALL of them, not just what's visible on load.
8. **Spec files are the source of truth.** Every component gets a spec in `docs/research/components/` BEFORE any builder is dispatched. The builder receives the spec inline; the file persists as an auditable artifact. Not optional.
9. **Build must always compile.** Every builder verifies `npx tsc --noEmit` before finishing. After merges, you verify `npm run build`. A broken build is never acceptable, even temporarily.

## The pipeline

The clone runs in five phases. Each phase produces artifacts the next reads: do not skip forward. Inspect → tokenize → spec → dispatch → merge → diff.

### Phase 1: Reconnaissance

Goal: capture everything the target actually renders, at every breakpoint and interaction state, and write it to disk before writing a line of code.

Via Chrome MCP:

1. Navigate to the target URL. Wait for the page to be idle (images loaded, fonts swapped in).
2. **Screenshots**: full-page at three viewports: 1440px (desktop), 768px (tablet), 375–390px (mobile). Save to `docs/design-references/{page}-{viewport}.png`. These are your master reference.
3. **Extract design tokens** from computed styles on representative elements:
   - Colors: background, text (primary/secondary/muted), accent, border, error/success/warning states
   - Typography: font family, sizes (h1-h6, body, caption, label), weights, line heights, letter spacing
   - Spacing scale: detect the site's rhythm (usually 4/8/12/16/24/32/48/64…)
   - Border radii, shadows, elevations
   - Breakpoints: where does the layout shift?
4. **Detect tech stack** (React/Vue hints, CSS approach, animation library, image strategy, smooth-scroll libs). Informs choices without dictating them.
5. **Download assets**: every image, video, font, favicon into `public/images/`, `public/videos/`, `public/seo/`. Preserve original filenames when readable. See the asset-discovery script below.

Detailed checklist: **[references/inspection-guide.md](references/inspection-guide.md)**: read it before starting Phase 1.

#### Mandatory interaction sweep

A dedicated pass AFTER screenshots and BEFORE anything else. Purpose: discover every behavior: most are invisible in a static screenshot.

- **Scroll sweep**: scroll top to bottom slowly. At each section: does the header change appearance (record the trigger scroll position)? Do elements animate into view (which, what type)? Does a sidebar/tab indicator auto-switch as you scroll (record the mechanism)? Are there scroll-snap points? Is a smooth-scroll library active (check for `.lenis`, `.locomotive-scroll`, custom scroll containers)?
- **Click sweep**: click every button, tab, pill, link, card. Record what happens. For tabs/pills: click EACH ONE and record the content per state.
- **Hover sweep**: hover buttons, cards, links, images, nav items. Record what changes (color, scale, shadow, underline, opacity) and the transition timing.
- **Responsive sweep**: test at 1440 / 768 / 390px. Note which sections change layout and at roughly which breakpoint.

Save all findings to `docs/research/BEHAVIORS.md`. This is your behavior bible: reference it when writing every component spec.

#### Page topology

Map every distinct section top to bottom, give each a working name, and document: visual order; fixed/sticky overlays vs flow content; overall page layout (scroll container, columns, z-index layers); dependencies between sections; the interaction model of each (static / click / scroll / time). Save as `docs/research/PAGE_TOPOLOGY.md`: your assembly blueprint.

Other Phase 1 outputs in `docs/research/`: `DESIGN_TOKENS.md`, `COMPONENT_INVENTORY.md`, `LAYOUT_ARCHITECTURE.md`, `INTERACTION_PATTERNS.md`, `TECH_STACK_ANALYSIS.md`.

#### Asset-discovery script

Run via Chrome MCP to enumerate all assets (note parent info to detect layered compositions):

```js
JSON.stringify({
  images: [...document.querySelectorAll('img')].map(img => ({
    src: img.src || img.currentSrc, alt: img.alt,
    width: img.naturalWidth, height: img.naturalHeight,
    parentClasses: img.parentElement?.className,
    siblings: img.parentElement ? [...img.parentElement.querySelectorAll('img')].length : 0,
    position: getComputedStyle(img).position, zIndex: getComputedStyle(img).zIndex
  })),
  videos: [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src, poster: v.poster,
    autoplay: v.autoplay, loop: v.loop, muted: v.muted
  })),
  backgroundImages: [...document.querySelectorAll('*')].filter(el => {
    const bg = getComputedStyle(el).backgroundImage; return bg && bg !== 'none';
  }).map(el => ({ url: getComputedStyle(el).backgroundImage, element: el.tagName + '.' + el.className?.split(' ')[0] })),
  svgCount: document.querySelectorAll('svg').length,
  fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 200).map(el => getComputedStyle(el).fontFamily))],
  favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes?.toString() }))
});
```

Then write `scripts/download-assets.mjs` that fetches everything to `public/`, batched 4-at-a-time with error handling, preserving meaningful directory structure.

### Phase 2: Foundation

Goal: get the base project speaking the target's visual language before any component work. Sequential: do it yourself, not via an agent, since it touches many files.

1. Scaffold or verify the Next.js 16 + shadcn/ui + Tailwind v4 base. Check `package.json`; scaffold now if missing.
2. Update `src/app/globals.css` with extracted tokens as oklch CSS variables under `:root` and `.dark`. Map to shadcn token names (`--background`, `--foreground`, `--primary`, `--muted`…) where they fit; add custom properties for colors that don't map. Include global keyframes, utility classes, and global scroll behaviors (Lenis, smooth-scroll CSS, scroll-snap on body).
3. Wire up fonts. Google Fonts → `next/font/google`. Self-hosted → download `.woff2` into `public/` and register via `next/font/local`.
4. Extract inline SVG icons into `src/components/icons.tsx` as named React components (name by visual function: `SearchIcon`, `ArrowRightIcon`, `LogoIcon`). Deduplicate. Do this now so builders can import them.
5. Create TypeScript interfaces in `src/types/` for the content structures you observed.
6. Download global assets by running `scripts/download-assets.mjs`.
7. Verify: `npm run build` passes. A broken foundation multiplies every downstream problem.

### Phase 3: Component specification & dispatch

The core loop. For each section in your page topology (top to bottom): **extract → write the spec → dispatch builders → merge**. Don't wait: as soon as a section's builder is dispatched, move to extracting the next one. Builders work in parallel while you keep extracting.

#### Step 1: Extract

- **Screenshot the section in isolation** (scroll to it, capture the viewport). Save to `docs/design-references/`.
- **Extract CSS for every element** with the per-component walker below: don't hand-measure. Run once per container, capture the full output.
- **Extract multi-state styles**: for any scroll-triggered / hover / active-tab element, capture BOTH states and record the diff explicitly: "Property X changes from A to B, triggered by TRIGGER, transition: CSS."
- **Extract real content**: all text (`element.textContent`), alt attributes, aria labels, placeholders. For tabbed content, click each tab and extract per state.
- **Identify assets used**: which downloaded images/videos, which icon components. Check for layered/stacked images in one container.
- **Assess complexity**: count distinct sub-components (each has its own unique styling, structure, behavior).

Per-component extraction script (replace `SELECTOR`):

```js
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return JSON.stringify({ error: 'Element not found: ' + selector });
  const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color','textTransform','textDecoration','backgroundColor','background','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin','marginTop','marginRight','marginBottom','marginLeft','width','height','maxWidth','minWidth','maxHeight','minHeight','display','flexDirection','justifyContent','alignItems','gap','gridTemplateColumns','gridTemplateRows','borderRadius','border','borderTop','borderBottom','borderLeft','borderRight','boxShadow','overflow','overflowX','overflowY','position','top','right','bottom','left','zIndex','opacity','transform','transition','cursor','objectFit','objectPosition','mixBlendMode','filter','backdropFilter','whiteSpace','textOverflow','WebkitLineClamp'];
  function extractStyles(element){const cs=getComputedStyle(element);const styles={};props.forEach(p=>{const v=cs[p];if(v&&v!=='none'&&v!=='normal'&&v!=='auto'&&v!=='0px'&&v!=='rgba(0, 0, 0, 0)')styles[p]=v;});return styles;}
  function walk(element,depth){if(depth>4)return null;const children=[...element.children];return{tag:element.tagName.toLowerCase(),classes:element.className?.toString().split(' ').slice(0,5).join(' '),text:element.childNodes.length===1&&element.childNodes[0].nodeType===3?element.textContent.trim().slice(0,200):null,styles:extractStyles(element),images:element.tagName==='IMG'?{src:element.src,alt:element.alt,naturalWidth:element.naturalWidth,naturalHeight:element.naturalHeight}:null,childCount:children.length,children:children.slice(0,20).map(c=>walk(c,depth+1)).filter(Boolean)};}
  return JSON.stringify(walk(el,0),null,2);
})('SELECTOR');
```

For multi-state: run the script → trigger the change (scroll/click/hover via Chrome MCP) → re-run on the same element. The diff IS the behavior spec.

#### Step 2: Write the component spec file

For each section (or sub-component if you split it), create `docs/research/components/<component-name>.spec.md`. Every builder must have a corresponding spec. Template:

```markdown
# <ComponentName> Specification

## Overview
- Target file: `src/components/<ComponentName>.tsx`
- Screenshot: `docs/design-references/<name>.png`
- Interaction model: <static | click-driven | scroll-driven | time-driven>

## DOM Structure
<element hierarchy: what contains what>

## Computed Styles (exact getComputedStyle values)
### Container
- display / padding / maxWidth / … (every relevant property, exact values)
### <Child element N>
- fontSize / color / … (exact values)

## States & Behaviors
### <behavior name>
- Trigger: <scroll 50px | IntersectionObserver rootMargin "-30% 0px" | click .tab-button | hover>
- State A (before): <exact CSS>
- State B (after): <exact CSS>
- Transition: <transition CSS>
- Implementation approach: <CSS transition + scroll listener | IntersectionObserver | animation-timeline | …>
### Hover states
- <Element>: <prop>: <before> → <after>, transition: <value>

## Per-State Content (if applicable)
### State: "<Name>"
- Title / Subtitle / Cards: [{ title, description, image, link }, …]

## Assets
- Background: `public/images/<file>.webp`
- Overlay: `public/images/<file>.png`
- Icons: <ArrowIcon>, <SearchIcon> from icons.tsx

## Text Content (verbatim)
<all text, copy-pasted from the live site>

## Responsive Behavior
- Desktop (1440px): <layout>
- Tablet (768px): <what changes>
- Mobile (390px): <what changes>
- Breakpoint: layout switches at ~<N>px
```

Fill every section. Mark "N/A" only when it truly doesn't apply, but think twice before marking States & Behaviors N/A (even a footer has link hover states).

#### Step 3: Dispatch builders

- **Simple section (1-2 sub-components):** one builder gets the whole section.
- **Complex section (3+ distinct sub-components):** break it up: one agent per sub-component, plus one for the section wrapper that imports them. Sub-component builders go first.

Each builder receives: the full spec file contents **inline** in the prompt (never "go read the spec file"); the section screenshot path; which shared components to import (`icons.tsx`, `cn()`, shadcn primitives); the target file path; the responsive breakpoint values and what changes; instruction to verify `npx tsc --noEmit` before finishing.

Work in isolated git worktrees so agents can't collide: `git worktree add ../worktrees/{ComponentName} -b clone/{ComponentName}`. You are the orchestrator, not a builder: don't implement inline while agents run, or you lose the ability to reconcile conflicts. Detailed protocol: **[references/parallel-build.md](references/parallel-build.md)**.

#### Step 4: Merge

As builders complete: merge their worktree branches into main (you have full context; resolve conflicts intelligently). After each merge, verify `npm run build`. Fix type errors immediately. The extract → spec → dispatch → merge cycle continues until all sections are built.

### Phase 4: Page assembly

Wire everything in `src/app/page.tsx`: import all section components; implement the page-level layout from `PAGE_TOPOLOGY.md` (scroll containers, columns, sticky positioning, z-index layering); connect real content to props; implement page-level behaviors (scroll snap, scroll-driven animations, dark-to-light transitions, IntersectionObservers, Lenis/smooth scroll). Verify `npm run build` passes clean.

### Phase 5: Visual QA diff

Do NOT declare the clone complete after assembly. Take side-by-side comparison screenshots at 1440px and 390px, compare section by section top to bottom. For each discrepancy: check the spec: was the value extracted correctly? If the spec was wrong, re-extract, update the spec, fix the component. If the spec was right but the builder drifted, fix the component to match the spec. Then test all interactive behaviors: scroll the page, click every button/tab, hover interactive elements. Verify smooth scroll feels right, header transitions work, tabs switch, animations play. Only after this pass is the clone complete.

## Configuration file: TARGET.md

Before Phase 1, place `TARGET.md` at the project root specifying scope. If the user gave only a URL, generate a sensible default (pixel-perfect, home page only) and confirm. Template: **[assets/TARGET.md](assets/TARGET.md)**. Also copy **[assets/CLAUDE.md](assets/CLAUDE.md)** to the project root: it encodes the code-style and orchestration conventions builders rely on.

## Code style & conventions the builders must follow

- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utilities
- Tailwind utility classes; no inline styles, no CSS modules
- 2-space indentation
- Mobile-first responsive
- No decorative aesthetic changes during emulation: match 1:1 first, customize later if the user asks
- Use the actual text and assets from the target, not placeholders

Full conventions: **[references/agents-conventions.md](references/agents-conventions.md)**.

## Fidelity levels

The user picks one in `TARGET.md`. Default to **pixel-perfect**.

- **Pixel-perfect**: exact match on colors, spacing, typography, animations. Every deviation is a bug.
- **High fidelity**: visually similar, same layout and feel, minor deviations OK. For tight time budgets.
- **Structural**: same layout and components, custom styling acceptable. When the user plans to re-skin heavily.

## Pre-dispatch checklist

Before dispatching ANY builder, verify every box. If you can't, go extract more.

- [ ] Spec file written to `docs/research/components/<name>.spec.md` with ALL sections filled
- [ ] Every CSS value in the spec is from `getComputedStyle()`, not estimated
- [ ] Interaction model identified and documented (static / click / scroll / time)
- [ ] For stateful components: every state's content and styles captured
- [ ] For scroll-driven: trigger threshold, before/after styles, and transition recorded
- [ ] For hover states: before/after values and transition timing recorded
- [ ] All images identified, including overlays and layered compositions
- [ ] Responsive behavior documented for at least desktop and mobile
- [ ] Text content is verbatim, not paraphrased
- [ ] The builder prompt is under ~150 lines of spec; if over, split the section

## What NOT to do

Lessons from failed clones: each cost hours of rework:

- **Don't build click-based tabs when the original is scroll-driven** (or vice versa). Determine the interaction model FIRST by scrolling before clicking. The #1 most expensive mistake: a full rewrite, not a CSS fix.
- **Don't extract only the default state.** Click every tab; capture header styles at scroll 0 AND 100+.
- **Don't miss overlay/layered images.** Background watercolor + foreground UI mockup = 2 images. Check every container's DOM tree.
- **Don't build mockup components for content that's actually video/animation.** Check for `<video>`, Lottie, canvas before building HTML mockups.
- **Don't approximate CSS classes.** "Looks like text-lg" is wrong if the computed line-height differs. Extract exact values.
- **Don't build one monolithic commit.** Incremental progress with verified builds at each step.
- **Don't reference docs from builder prompts.** Each builder gets the CSS spec inline, never "see DESIGN_TOKENS.md".
- **Don't skip asset extraction.** Without real images/videos/fonts the clone looks fake regardless of CSS.
- **Don't give a builder too much scope.** A long builder prompt is the signal to split.
- **Don't bundle unrelated sections into one agent.** A CTA and a footer are different components.
- **Don't skip responsive extraction.** Inspect at 1440, 768, and 390 during extraction.
- **Don't forget smooth-scroll libraries.** Check for Lenis / Locomotive: native scroll feels different and users spot it.
- **Don't dispatch builders without a spec file.**

## Failure modes to watch for

- **Chrome MCP returns stale styles**: heavily animated sites: computed styles at t=0 may not match resting state. Wait, then re-read.
- **Fonts flash or don't load**: Phase 2 must resolve fonts before component builds. FOUT/FOIT in the clone = broken foundation.
- **Builder agents drift from the spec**: if output doesn't match, the spec was ambiguous. Fix the spec, then re-spawn. Don't patch output blind.
- **Merge conflicts on shared files**: `globals.css`, `layout.tsx`, `icons.tsx` are the usual suspects. Builders don't edit these; you own them as orchestrator.
- **The target is a SPA that hydrates late**: some content appears only after JS runs. Give Chrome MCP time to hydrate; re-inspect after interactions.

## Completion report

When done, report: total sections built; total components created; total spec files written (should match components); total assets downloaded (images, videos, SVGs, fonts); build status (`npm run build`); visual QA results (remaining discrepancies); any known gaps or limitations.

## One-line summary of the loop

Inspect → tokenize → spec → dispatch → merge → diff. If you're on any step without artifacts from the previous step in front of you, stop and back up.

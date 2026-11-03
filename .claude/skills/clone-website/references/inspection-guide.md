# Website Inspection Guide

Read this before starting Phase 1 (Reconnaissance). It lists what to capture from the target site, and how to lay out the output so later phases can consume it.

## Phase 1a — Visual Audit

### Screenshots to capture

Save under `docs/design-references/`. Naming: `{page-slug}-{viewport}-{state}.png`.

- [ ] Every page in `TARGET.md` — desktop (1440), tablet (768), mobile (375)
- [ ] Dark mode variants (if the site has a toggle or `prefers-color-scheme` handling)
- [ ] Light mode variants
- [ ] Key interaction states — hover, active, focus rings, open menus, open modals
- [ ] Loading / skeleton states (throttle the network in DevTools to catch these)
- [ ] Empty states (feed with zero results, cart with zero items, etc.)
- [ ] Error states (form validation, 404, expired session)

### Design tokens to extract

Read via `getComputedStyle()` on representative elements. Do not eyeball — measurement beats intuition every time.

- [ ] **Colors** — background, text (primary / secondary / muted), accent, border, hover, error, success, warning. Grab hex or oklch; convert to oklch for the Tailwind v4 config.
- [ ] **Typography** — font family stack, sizes (h1–h6, body, caption, label), weights, line heights, letter spacing. Include fallback fonts.
- [ ] **Spacing** — inspect margins/paddings across the page and look for a scale (4, 8, 12, 16, 24, 32, 48, 64…). The scale is usually shared with Tailwind's defaults or a variant of it.
- [ ] **Border radius** — buttons, cards, avatars, inputs, popovers
- [ ] **Shadows / elevation** — card shadows, dropdown shadows, modal overlay
- [ ] **Breakpoints** — resize the viewport slowly and note where the layout shifts. Common: 640 / 768 / 1024 / 1280 / 1536.
- [ ] **Icons** — icon library used (Lucide, Heroicons, custom SVGs?). Sizes and stroke weights.
- [ ] **Avatars** — sizes, shapes (circle vs rounded square), fallback behavior (initials, silhouette)
- [ ] **Buttons** — every variant (primary, secondary, ghost, icon-only, danger, loading state)
- [ ] **Inputs** — text fields, textareas, selects, checkboxes, toggles, radio groups

## Phase 1b — Component Inventory

For each distinct UI component you see, document it in `docs/research/COMPONENT_INVENTORY.md`:

1. **Name** — what you'd call this component. Match shadcn/ui names when the mapping is clear.
2. **Structure** — HTML tree / child components
3. **Variants** — sizes, colors, states
4. **States** — default, hover, active, disabled, loading, error, empty
5. **Responsive behavior** — how it reflows at each breakpoint
6. **Interactions** — click, hover, focus, keyboard navigation
7. **Animations** — transitions, entrance/exit, micro-interactions (record durations and easings)

### Components to look for (checklist)

Navigation (top bar, sidebar, bottom bar) · cards & list items · buttons & links · forms & inputs · modals & dialogs · dropdowns & menus · tabs & segmented controls · avatars & user badges · loading skeletons · toast notifications · tooltips & popovers · footer · cookie banner · hero section · pricing table · testimonial carousel · FAQ accordion · CTA section

## Phase 1c — Layout Architecture

Write to `docs/research/LAYOUT_ARCHITECTURE.md`:

- [ ] Grid system — CSS Grid? Flexbox? Fixed widths?
- [ ] Column layout at each breakpoint
- [ ] Max-width of the main content area
- [ ] Sticky elements — header, sidebar, floating buttons
- [ ] Z-index layers — navigation / dropdowns / tooltips / modals / overlays
- [ ] Scroll behavior — infinite scroll, pagination, virtual scrolling, sticky sections

## Phase 1d — Tech Stack Analysis

Write to `docs/research/TECH_STACK_ANALYSIS.md`. This is for reference only — the clone is always Next.js + shadcn — but knowing the target's stack helps you interpret what you see.

- [ ] **Framework** — check `__NEXT_DATA__`, `__NUXT__`, `ng-version`, Svelte markers, or hydration hints
- [ ] **CSS approach** — Tailwind (utility classes in DOM), CSS Modules (hashed classnames), Styled Components (data-styled attributes), Emotion, vanilla CSS
- [ ] **State management hints** — Redux DevTools available? React Query cache in the console? Zustand?
- [ ] **API patterns** — REST vs GraphQL (look for `/graphql` in network tab)
- [ ] **Font loading** — Google Fonts (`fonts.googleapis.com`), self-hosted, system fonts
- [ ] **Image strategy** — CDN (Cloudinary, Imgix), lazy loading, srcset, WebP/AVIF
- [ ] **Animation library** — Framer Motion (look for `data-projection-id`), GSAP (`gsap` in globals), CSS-only

## Phase 1e — Interaction Patterns

Write to `docs/research/INTERACTION_PATTERNS.md`:

- [ ] Every hover state you observed (button, card, link)
- [ ] Every focus ring (color, offset, width)
- [ ] Every transition — element, property, duration, easing
- [ ] Scroll-triggered animations (fade-in on view, parallax, sticky reveals)
- [ ] Modal entrance/exit animations
- [ ] Loading indicators — spinners, skeletons, progress bars
- [ ] Micro-interactions — button press feedback, form validation feedback, copy-to-clipboard confirmation

## Output summary — what Phase 2 will read

By the end of Phase 1 you must have written:

```
docs/research/
├── DESIGN_TOKENS.md
├── COMPONENT_INVENTORY.md
├── LAYOUT_ARCHITECTURE.md
├── INTERACTION_PATTERNS.md
└── TECH_STACK_ANALYSIS.md

docs/design-references/
└── (screenshots for every page × viewport × state)

public/
├── images/  (every image the target renders)
├── videos/  (every video the target embeds)
└── seo/     (favicons, OG images, webmanifest)
```

If any of these are missing, Phase 2 will guess — and guesses compound. Finish Phase 1 completely before moving on.

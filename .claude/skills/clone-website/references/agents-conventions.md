# Builder Agent Conventions

These are the rules every builder agent must follow. Copy this file's substance into every builder prompt — don't assume the agent will infer them.

## Framework note — this is not the Next.js you know

Next.js 16 has breaking changes from earlier versions. Before writing code, the agent should read the relevant guide in `node_modules/next/dist/docs/` if the exact API is uncertain. Heed deprecation notices — patterns that worked in Next.js 13/14 may fail here.

## Tech stack (fixed for this project)

- **Framework** — Next.js 16 (App Router, React 19, TypeScript strict)
- **UI** — shadcn/ui primitives (Radix under the hood) + Tailwind CSS v4
- **Icons** — Lucide React by default; extracted SVGs from the target live in `src/components/icons.tsx`
- **Styling** — Tailwind utility classes with oklch design tokens
- **Deployment target** — Vercel

Do not swap any of these out. If a component needs something outside this stack, stop and report to the orchestrator.

## Code style

- **TypeScript strict.** No `any`. Prefer `unknown` + narrowing when the type is genuinely open.
- **Named exports only.** No default exports. `export function ComponentName() {}`.
- **PascalCase** for components and their file names. `camelCase` for utilities and hooks.
- **Tailwind utility classes only.** No inline `style={{}}` unless truly dynamic (like a computed `transform`). No CSS modules. No styled-components.
- **2-space indentation.** No tabs.
- **Mobile-first responsive.** Base styles for mobile, then `sm:`, `md:`, `lg:`, `xl:` overrides.
- **`cn()` utility** from `src/lib/utils.ts` for conditional class composition.

## Design fidelity

- Match the target 1:1. Do not add personal aesthetic touches, "improvements", or accessibility rewrites during emulation. Customization comes later, if the user asks.
- Use the actual text and asset paths from the spec. Placeholder content (`Lorem ipsum`, `example@example.com`, stock photos) is a bug.
- Every pixel matters — spacing, border widths, letter spacing, shadow blur radii all come from the spec's `getComputedStyle()` values.

## File layout for a new component

```
src/components/{ComponentName}.tsx           # the component
src/components/{ComponentName}.types.ts      # (optional) if the type surface is nontrivial
```

For a compound component with subcomponents, co-locate:

```
src/components/{ComponentName}/
├── index.ts                # barrel — re-export the main component
├── {ComponentName}.tsx
├── {SubComponent}.tsx
└── use{ComponentName}.ts   # (optional) hook if the component has significant state
```

## Files the builder MUST NOT edit

- `src/app/globals.css` — design tokens, owned by orchestrator
- `src/app/layout.tsx` — root layout, owned by orchestrator
- `src/components/icons.tsx` — extracted SVG icons, owned by orchestrator
- `package.json` — if you need a dependency, stop and report

If you think you need to change any of these, stop and tell the orchestrator what you need. Do not attempt a workaround.

## Definition of done

Before committing, the builder must:

1. `npm run lint` passes in the worktree (no errors, warnings acceptable but preferred to be zero)
2. `npm run build` passes (or at minimum, the file the builder wrote compiles with `tsc --noEmit`)
3. The component renders every state listed in the spec (default, hover, disabled, etc.) — verify by mounting it in a scratch route if needed
4. Every content string and asset path comes from the spec, not invented
5. Commit message follows the pattern: `build: {ComponentName}`

## When the spec is ambiguous

Stop. Do not guess. Do not fill in "reasonable defaults". Report back to the orchestrator with:

- The specific ambiguity (which sentence in the spec, which value is missing)
- Your best-guess interpretation (so the orchestrator can decide quickly)

The orchestrator will either resolve inline or rewrite the spec. Either way, resuming from a resolved spec beats shipping a divergent guess.

## Anti-patterns (do not do these)

- Adding animations the spec didn't call for ("it felt static without them")
- Refactoring the file structure "for cleanliness"
- Introducing a state library, form library, or utility library not already in `package.json`
- Adding comments explaining what the code does (the component names already do that)
- Writing generic components with props the spec didn't ask for ("in case we need it later")
- Substituting a Lucide icon when the spec references an SVG in `icons.tsx`

The clone is not a green-field project. It's a translation. Translations that add flourishes are called "adaptations" — and those come later, if the user asks.

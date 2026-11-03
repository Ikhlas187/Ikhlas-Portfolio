# Parallel Build — Orchestration Protocol

Phase 4 dispatches one builder agent per component, working in isolated git worktrees. This file is the operating manual for the orchestrator (you). Read it before spawning the first agent.

## Why worktrees, not branches-on-the-same-checkout

If every agent works in the same directory, they will overwrite each other's files, race on `package.json` updates, and corrupt each other's imports. Git worktrees give each agent its own physical filesystem checkout while still sharing the underlying `.git` — the isolation is real, and merging back is trivial.

## Setup — one-time per clone project

```bash
# From the project root
mkdir -p ../worktrees
git checkout -b clone/base main
git commit --allow-empty -m "clone/base checkpoint"
```

Every builder agent branches off `clone/base`. This ensures they all inherit the Phase 2 foundation (globals.css, fonts, icons.tsx).

## Per-component workflow

For each spec in `docs/research/components/`:

1. **Create the worktree**
   ```bash
   git worktree add ../worktrees/{ComponentName} -b clone/{ComponentName} clone/base
   ```

2. **Spawn the builder agent** (via the Agent tool) with a self-contained prompt. The prompt must include:
   - The full contents of the spec file (do not just reference it — the agent should not need to read anything else)
   - The worktree path: `../worktrees/{ComponentName}`
   - The component's target file path: `src/components/{ComponentName}.tsx`
   - The code style rules (see [agents-conventions.md](agents-conventions.md))
   - Instructions to commit when done: `git add . && git commit -m "build: {ComponentName}"`

3. **Restrict scope explicitly.** Tell the builder:
   - You may create `src/components/{ComponentName}.tsx` and any co-located files (`{ComponentName}.stories.tsx`, subcomponents).
   - You may NOT edit `src/app/globals.css`, `src/app/layout.tsx`, or `src/components/icons.tsx`. Those are owned by the orchestrator.
   - If you think a shared file needs a change, stop and report it — don't edit it.

4. **Track state.** Keep a mental list (or a `docs/research/build-status.md` file) of which components are in flight, done, or blocked.

## Concurrency

Spawn agents in parallel batches, but respect two limits:

- **The orchestrator's cognitive budget.** More than ~5 agents in flight at once, and you'll lose track of what came back.
- **Dependency order.** Compound components (a `Card` that uses `Avatar`) can't be built until their primitives exist. Build primitives in wave 1, compounds in wave 2, page-level sections in wave 3.

Wave layout example:
- Wave 1 (parallel): `Button`, `Input`, `Avatar`, `Badge`, `Icon`, `Link`
- Wave 2 (parallel, after wave 1): `Card`, `NavItem`, `Menu`, `Dialog`, `FormField`
- Wave 3 (parallel, after wave 2): `Header`, `HeroSection`, `FeatureGrid`, `Footer`
- Assembly (serial, orchestrator only): `page.tsx`

## Merging back — Phase 5 begins here

Merge in the same order as the build waves. Each merge is one command:

```bash
git checkout main
git merge clone/{ComponentName} --no-ff -m "merge: {ComponentName}"
git worktree remove ../worktrees/{ComponentName}
git branch -d clone/{ComponentName}
```

Conflicts almost always surface in three files: `package.json` (a builder added a dep), `src/app/globals.css` (a builder ignored the "don't edit" rule), or `src/components/index.ts` (a barrel export). You are the reconciler — you have full context on what every builder was supposed to do, so resolve with intent, not just line-by-line.

## When a builder returns broken output

Two failure modes, two responses:

- **The output looks right but doesn't match the spec** — the spec was ambiguous. Rewrite the spec to close the gap, then re-spawn the builder against the (still empty) worktree.
- **The output is nonsense (imports wrong, uses `any`, invents content)** — the builder didn't get enough context. Beef up the prompt with concrete examples and re-spawn.

Do not hand-patch a builder's output. If you find yourself editing the file the builder created, the spec is broken and every future builder will hit the same rock. Fix upstream.

## When to stop paralellizing

If a component's spec is under-defined and you'd need to keep clarifying with the agent, it's often faster to build it yourself as orchestrator. Rule of thumb: if the spec would take longer to write than the component would take to code, code it. This mostly applies to one-off page sections that don't repeat.

## Post-merge hygiene

Once every worktree has been merged and removed:

```bash
git worktree prune
git branch --list 'clone/*'  # should show only clone/base (or be empty)
```

Then delete `../worktrees/` if it's empty.

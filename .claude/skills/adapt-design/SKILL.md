---
name: adapt-design
description: Adapt an existing design to a different context - another screen size, device, orientation, platform (web, iOS, Android) or use case - by rethinking the experience rather than just scaling it. Use when the user wants to make a site or app responsive, mobile-friendly, tablet- or desktop-ready, port a web UI to native (or native to web), handle breakpoints, touch vs pointer input, foldables, landscape, or says a layout "breaks on mobile".
license: Apache 2.0 (adapted from pbakaus/impeccable)
---

## Entrée

- Un **design existant** (site, app, composant) à adapter.
- Le **contexte cible** : plateformes, appareils, viewports, usage, stack.

## Sortie

- Le **design adapté** au nouveau contexte, implémenté dans la stack du projet.
- Une **vérification** dans chaque contexte cible, suivie d'une passe de finition.

---

Adaptation is not scaling. The job is to rethink the experience for the new context: what the user is doing there, with which input, on which screen, under which constraints.

## Before you start

Gather the context this depends on. If the user hasn't said, ask briefly or infer from the project:
- target platforms / devices / viewports
- the usage context (on the go, at a desk, one-handed, shared screen...)
- the stack (web framework and styling system, or native toolkit)

## Pick the playbook

- **Web (including mobile web)** -> read [reference/adapt.md](reference/adapt.md) and follow it.
- **Native (ios, android, or adaptive/cross-platform)** -> read [reference/adapt.native.md](reference/adapt.native.md), plus the target platform's conventions in [reference/ios.md](reference/ios.md) and/or [reference/android.md](reference/android.md) before planning.

If the project mixes both (e.g. a web app plus a native shell), apply each playbook to its own surface.

## Finish

Verify the adapted design in every target context (real sizes, real input modes), fix what the check reveals in one batch, then do a final polish pass.
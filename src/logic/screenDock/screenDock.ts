// Écran qui rétrécit et descend au scroll jusqu'au centre d'un autre (réf. maquette Framer IFRI) : linéaire, borné à [0, 1].
export const DOCK_START_SCALE = 1
export const DOCK_END_SCALE = 0.5
// Hauteur de fenêtre (fraction) où le haut de l'écran mobile se trouve au début de la course : 689 / 900 sur la réf.
export const DOCK_START_VIEWPORT_RATIO = 689 / 900

type VerticalBox = { top: number; height: number }

function clampProgress(progress: number) {
  return Math.min(1, Math.max(0, progress))
}

export function dockScale(progress: number) {
  return DOCK_START_SCALE + (DOCK_END_SCALE - DOCK_START_SCALE) * clampProgress(progress)
}

export function dockOffset(progress: number, distance: number) {
  return distance * clampProgress(progress)
}

// Descente qui pose le centre de l'écran mobile sur le centre de l'écran cible (origine du scale au centre).
export function dockDistance(moving: VerticalBox, target: VerticalBox) {
  return target.top + target.height / 2 - (moving.top + moving.height / 2)
}

// Réf. : effet sur le 1er quart d'une page de 5,75 écrans, soit 1,2 écran de défilement.
const EXIT_SCREENS = 1.2
const MAX_BLUR = 15
const MIN_SCALE = 0.6

export function heroExit(scrollY: number, viewportHeight: number) {
  const progress = Math.min(Math.max(scrollY / (viewportHeight * EXIT_SCREENS), 0), 1)
  return { blur: progress * MAX_BLUR, scale: 1 - progress * (1 - MIN_SCALE) }
}

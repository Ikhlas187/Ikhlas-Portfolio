const MAX_BLUR = 15
const MIN_SCALE = 0.6

type Viewport = { width: number; height: number }

// Hauteur de la page de la réf. selon la largeur, relevée à 7 tailles d'écran (1 droite par palier 810 et 1200).
function referencePageHeight(width: number) {
  if (width < 810) return 12.36 * width + 2977
  if (width < 1200) return 2.74 * width + 2465
  return 2.5 * width + 1620
}

// Réf. : l'effet dure le 1er quart de la page, donc sa distance dépend de la taille de l'écran.
export function heroExitDistance({ width, height }: Viewport) {
  return (referencePageHeight(width) - height) / 4
}

export function heroExit(scrollY: number, viewport: Viewport) {
  const progress = Math.min(Math.max(scrollY / heroExitDistance(viewport), 0), 1)
  return { blur: progress * MAX_BLUR, scale: 1 - progress * (1 - MIN_SCALE) }
}

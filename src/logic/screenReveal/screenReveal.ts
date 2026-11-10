// Écran du Mac affiché plein écran puis rétréci au scroll jusqu'à sa place dans l'appareil (réf. cafedelmar.nl).

function clampProgress(progress: number) {
  return Math.min(1, Math.max(0, progress))
}

// Départ et arrivée en douceur (smoothstep).
function easeProgress(progress: number) {
  const t = clampProgress(progress)
  return t * t * (3 - 2 * t)
}

// Échelle où l'écran prend toute la largeur de la fenêtre.
export function revealCoverScale(screenWidth: number, viewportWidth: number) {
  return screenWidth > 0 ? viewportWidth / screenWidth : 1
}

export function revealScale(progress: number, coverScale: number) {
  return coverScale + (1 - coverScale) * easeProgress(progress)
}

// Proportion de l'écran : celle de la fenêtre en plein écran (rien de coupé), celle du MacBook à l'arrivée.
export function revealAspect(progress: number, viewportAspect: number, restAspect: number) {
  return viewportAspect + (restAspect - viewportAspect) * easeProgress(progress)
}

// Fond noir autour de l'écran : opaque au départ, disparu à la moitié de la course.
export function revealBackdropOpacity(progress: number) {
  return 1 - clampProgress(progress * 2)
}

// Bouton des certifications sous l'appareil : invisible, puis en fondu sur les 20 derniers % de la course.
export function revealButtonOpacity(progress: number) {
  return clampProgress((progress - 0.8) / 0.2)
}

// Coins de l'écran : droits en plein écran (0), arrondis à leur valeur normale dans l'appareil (1).
export function revealCornerFactor(progress: number) {
  return clampProgress(progress)
}

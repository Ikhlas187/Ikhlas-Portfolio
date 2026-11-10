// Projets du téléphone côte à côte (1 par écran) : décalage de la bande, en vw, selon l'avancée du scroll.
export function showcaseOffsetVw(progress: number, projectCount: number) {
  const clamped = Math.min(1, Math.max(0, progress))
  return -clamped * Math.max(0, projectCount - 1) * 100
}

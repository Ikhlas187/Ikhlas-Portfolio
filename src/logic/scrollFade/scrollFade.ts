// Opacité qui passe de 1 à 0 entre 2 avancées du scroll (0 à 1), bornée hors de cette plage.
export function fadeOutBetween(progress: number, start: number, end: number) {
  if (progress <= start) return 1
  if (progress >= end) return 0
  return 1 - (progress - start) / (end - start)
}

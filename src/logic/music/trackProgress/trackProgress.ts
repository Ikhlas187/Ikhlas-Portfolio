// Part écoulée du morceau, entre 0 et 1. Durée encore inconnue : 0.
export function trackProgress(currentTime: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(currentTime)) return 0
  return Math.min(1, Math.max(0, currentTime / duration))
}

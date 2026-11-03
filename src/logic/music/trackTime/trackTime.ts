// Temps d'un morceau écrit comme dans Musique de macOS : « 3:07 », « 12:45 ». Temps inconnu : « --:-- ».
export function formatTrackTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const wholeSeconds = Math.floor(seconds)
  const minutes = Math.floor(wholeSeconds / 60)
  const rest = wholeSeconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

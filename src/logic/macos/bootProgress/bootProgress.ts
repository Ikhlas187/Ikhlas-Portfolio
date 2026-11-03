// Courbe de la barre de démarrage de macweb.dev (MIT) : pourcentage de 0 à 100 selon le temps écoulé en ms.
export function bootProgressAt(elapsed: number): number {
  let progress: number
  if (elapsed < 800) progress = Math.min(30, (elapsed / 800) * 30)
  else if (elapsed < 2200) {
    progress = 30 + Math.min(55, ((elapsed - 800) / 1400) * 55)
    // 2 accrocs volontaires de l'original, pour que la barre ne file pas d'un trait.
    if (progress > 45 && progress < 47) progress = 45.5
    if (progress > 70 && progress < 72) progress = 71
  } else if (elapsed < 2800) progress = 85 + Math.min(10, ((elapsed - 2200) / 600) * 10)
  else progress = 95 + Math.min(5, ((elapsed - 2800) / 400) * 5)
  return Math.min(100, Math.floor(progress * 10) / 10)
}

// Mécanique de MacbookScroll (Aceternity) appliquée au modèle 3D : le défilement ouvre le capot, puis plonge dans l'écran.
export type MacBookPose = { lid: number; zoom: number }

// Bornes en progression du défilement de la section (0 : haut de la section, 1 : fin de la partie collante).
export const LID_RANGE: [number, number] = [0.05, 0.35]
// La plongée démarre avant la fin de l'ouverture : sinon les 2 mouvements s'arrêtent l'un après l'autre et la scène marque un temps mort.
export const ZOOM_RANGE: [number, number] = [0.3, 0.62]

function progressBetween(value: number, [start, end]: [number, number]) {
  if (value <= start) return 0
  if (value >= end) return 1
  return (value - start) / (end - start)
}

export function macBookPoseAt(progress: number): MacBookPose {
  return { lid: progressBetween(progress, LID_RANGE), zoom: progressBetween(progress, ZOOM_RANGE) }
}

// Défilement à atteindre pour une progression donnée, en px depuis le haut de la page.
export function scrollTopFor(progress: number, sectionTop: number, scrollableHeight: number) {
  return Math.round(sectionTop + progress * scrollableHeight)
}

// Plongée dans l'écran : départ et arrivée en douceur (ease-in-out sinusoïdal, moins de temps mort aux bornes qu'un cubique).
export function easeDive(zoom: number) {
  return (1 - Math.cos(Math.PI * zoom)) / 2
}

// Distance caméra pendant la plongée : interpolée en échelle logarithmique, l'écran grossit à vitesse régulière.
export function diveDistance(from: number, to: number, dive: number) {
  return from ** (1 - dive) * to ** dive
}

// Le Mac et son studio s'effacent pour que seul l'écran reste en fin de plongée, sauf Mac éteint (retreat 1).
export function stageLightAt(zoom: number, retreat = 0) {
  const fade = progressBetween(zoom, [0.6, 1])
  const smooth = fade * fade * (3 - 2 * fade)
  return 1 - smooth * (1 - retreat)
}

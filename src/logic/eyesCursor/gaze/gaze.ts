type Point = { x: number; y: number }
type Range = { x: number; y: number }

// Regard au repos, en part de la course de la pupille : un peu à droite, un peu en bas.
export const REST_GAZE = { x: 0.35, y: 0.1 }

// Au-delà de cette distance (px) entre le pointeur et la cible, la pupille est en butée.
const FULL_GAZE_DISTANCE = 48

// Balayage de lecture d'un texte survolé : 4 points par ligne sur 3 lignes, x / y en part de la course, durée en ms.
export const READING_PATH = [0, 1, 2].flatMap((line) => {
  const y = -0.1 + line * 0.3
  return [
    { x: -0.85, y, duration: 260 },
    { x: -0.3, y, duration: 240 },
    { x: 0.25, y, duration: 240 },
    { x: 0.8, y, duration: 380 },
  ]
})

// Course de la pupille dans un œil ovale, en px de chaque côté du centre.
export function pupilRange(eyeWidth: number, eyeHeight: number, pupilSize: number, strokeWidth: number): Range {
  return {
    x: Math.max(0, eyeWidth / 2 - pupilSize / 2 - strokeWidth - 0.5),
    y: Math.max(0, eyeHeight / 2 - pupilSize / 2 - strokeWidth - 0.5),
  }
}

// Décalage de la pupille (px) pour regarder la cible depuis le pointeur ; sans cible, regard au repos.
export function gazeOffset(pointer: Point, target: Point | null, range: Range) {
  if (!target) return { x: REST_GAZE.x * range.x, y: REST_GAZE.y * range.y }
  const dx = target.x - pointer.x
  const dy = target.y - pointer.y
  const distance = Math.hypot(dx, dy)
  if (!distance) return { x: 0, y: 0 }
  const reach = Math.min(1, distance / FULL_GAZE_DISTANCE)
  return { x: (dx / distance) * reach * range.x, y: (dy / distance) * reach * range.y }
}

const FLIP_END = 0.3
const ZOOM_END = 0.85
const FADE_END = 0.95
// Marge pour que les bords arrondis de la carte sortent de l'écran avant le fondu.
const COVER_MARGIN = 1.05

type Viewport = { width: number; height: number }
type CardSize = { width: number; height: number }

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

// Défilement de l'intro du hero (0 en haut, 1 à la fin) : la carte se retourne, puis on entre dedans, puis le titre prend le relais.
export function badgeIntro(progress: number) {
  const flipProgress = clamp01(progress / FLIP_END)
  return {
    flip: flipProgress * flipProgress * (3 - 2 * flipProgress),
    zoom: clamp01((progress - FLIP_END) / (ZOOM_END - FLIP_END)),
    canvasOpacity: 1 - clamp01((progress - ZOOM_END) / (FADE_END - ZOOM_END)),
    isTitleVisible: progress >= ZOOM_END,
  }
}

// Distance caméra-carte où la carte couvre tout l'écran, pour une caméra de champ vertical fovDegrees.
export function coverDistance(card: CardSize, viewport: Viewport, fovDegrees: number) {
  const heightPerDistance = 2 * Math.tan((fovDegrees * Math.PI) / 360)
  const aspect = viewport.width / viewport.height
  const byHeight = card.height / (COVER_MARGIN * heightPerDistance)
  const byWidth = card.width / (COVER_MARGIN * heightPerDistance * aspect)
  return Math.min(byHeight, byWidth)
}

// Avancée en progression géométrique : la carte grossit à vitesse perçue constante.
export function cameraDistance(zoom: number, startDistance: number, endDistance: number) {
  return startDistance * (endDistance / startDistance) ** clamp01(zoom)
}

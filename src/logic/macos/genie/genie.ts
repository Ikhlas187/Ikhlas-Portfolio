import type { Rect } from '@/logic/macos/windowBounds/windowBounds'

// Bande horizontale de la fenêtre : translation puis échelle depuis le coin haut gauche (transform-origin 0 0).
export type GenieStrip = { x: number; y: number; scaleX: number; scaleY: number }

// Part de l'animation où la fenêtre se tord en entonnoir avant de glisser dans l'icône, comme macOS.
const BEND_SHARE = 0.35
const FADE_START = 0.86
const STRIP_HEIGHT = 18
const MIN_STRIPS = 12
const MAX_STRIPS = 40

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

export function genieStripCount(windowHeight: number) {
  return Math.min(Math.max(Math.round(windowHeight / STRIP_HEIGHT), MIN_STRIPS), MAX_STRIPS)
}

// progress 0 : fenêtre intacte. 1 : fenêtre logée dans l'icône du Dock.
export function genieStrips(window: Rect, icon: Rect, progress: number, count: number): GenieStrip[] {
  const p = clamp01(progress)
  const bend = easeInOutCubic(clamp01(p / BEND_SHARE))
  const slide = easeInOutCubic(clamp01((p - BEND_SHARE) / (1 - BEND_SHARE)))
  const funnelHeight = Math.max(1, icon.y - window.y)
  const stripHeight = window.height / count

  const rowY = (v: number) => lerp(window.y + v * window.height, icon.y + v * icon.height, slide)
  // Plus une ligne est basse, plus ses bords se rapprochent de ceux de l'icône.
  const edgesAt = (y: number) => {
    const pinch = smoothstep(clamp01((y - window.y) / funnelHeight)) * bend
    return {
      left: lerp(window.x, icon.x, pinch),
      right: lerp(window.x + window.width, icon.x + icon.width, pinch),
    }
  }

  return Array.from({ length: count }, (_, index) => {
    const top = rowY(index / count)
    const bottom = rowY((index + 1) / count)
    const { left, right } = edgesAt((top + bottom) / 2)
    return {
      x: left,
      y: top,
      scaleX: (right - left) / window.width,
      scaleY: (bottom - top) / stripHeight,
    }
  })
}

// Fondu tout à la fin seulement, pour que la fenêtre disparaisse dans l'icône sans saut.
export function genieOpacity(progress: number) {
  return 1 - clamp01((clamp01(progress) - FADE_START) / (1 - FADE_START))
}

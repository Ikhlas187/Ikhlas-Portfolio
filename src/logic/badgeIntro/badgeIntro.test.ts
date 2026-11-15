import { describe, expect, test } from 'vitest'
import { badgeIntro, cameraDistance, coverDistance } from '@/logic/badgeIntro/badgeIntro'

describe('badgeIntro', () => {
  test.each([
    { progress: -0.2, flip: 0, zoom: 0, canvasOpacity: 1, isBackVisible: false, titleBlur: 18 },
    { progress: 0, flip: 0, zoom: 0, canvasOpacity: 1, isBackVisible: false, titleBlur: 18 },
    { progress: 0.1, flip: 0.259, zoom: 0, canvasOpacity: 1, isBackVisible: false, titleBlur: 18 },
    { progress: 0.15, flip: 0.5, zoom: 0, canvasOpacity: 1, isBackVisible: true, titleBlur: 18 },
    { progress: 0.3, flip: 1, zoom: 0, canvasOpacity: 1, isBackVisible: true, titleBlur: 18 },
    { progress: 0.575, flip: 1, zoom: 0.5, canvasOpacity: 1, isBackVisible: true, titleBlur: 9 },
    { progress: 0.85, flip: 1, zoom: 1, canvasOpacity: 1, isBackVisible: true, titleBlur: 0 },
    { progress: 0.9, flip: 1, zoom: 1, canvasOpacity: 0.5, isBackVisible: true, titleBlur: 0 },
    { progress: 1.4, flip: 1, zoom: 1, canvasOpacity: 0, isBackVisible: true, titleBlur: 0 },
  ])('à $progress : retournement $flip, avancée $zoom, flou du titre $titleBlur px', ({ progress, ...expectedStep }) => {
    const step = badgeIntro(progress)

    expect(step.flip).toBeCloseTo(expectedStep.flip, 2)
    expect(step.zoom).toBeCloseTo(expectedStep.zoom)
    expect(step.canvasOpacity).toBeCloseTo(expectedStep.canvasOpacity)
    expect(step.isBackVisible).toBe(expectedStep.isBackVisible)
    expect(step.titleBlur).toBeCloseTo(expectedStep.titleBlur)
  })
})

describe('coverDistance', () => {
  const card = { width: 1.6, height: 2.25 }

  test('écran large : la largeur de la carte décide', () => {
    const viewport = { width: 1600, height: 900 }

    const distance = coverDistance(card, viewport, 23)

    const visibleWidth = 2 * Math.tan((23 * Math.PI) / 360) * distance * (1600 / 900)
    expect(visibleWidth * 1.05).toBeCloseTo(card.width)
  })

  test('écran haut : la hauteur de la carte décide', () => {
    const viewport = { width: 390, height: 844 }

    const distance = coverDistance(card, viewport, 23)

    const visibleHeight = 2 * Math.tan((23 * Math.PI) / 360) * distance
    expect(visibleHeight * 1.05).toBeCloseTo(card.height)
  })
})

describe('cameraDistance', () => {
  test.each([
    { zoom: 0, distance: 13 },
    { zoom: 1, distance: 2 },
    { zoom: 0.5, distance: Math.sqrt(13 * 2) },
    { zoom: 2, distance: 2 },
  ])('avancée $zoom : $distance', ({ zoom, distance }) => {
    expect(cameraDistance(zoom, 13, 2)).toBeCloseTo(distance)
  })
})

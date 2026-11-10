import { describe, expect, it } from 'vitest'
import { revealAspect, revealBackdropOpacity, revealCoverScale, revealScale } from '@/logic/screenReveal/screenReveal'

describe('revealCoverScale', () => {
  it("agrandit l'écran jusqu'à la largeur de la fenêtre", () => {
    const screenWidth = 800
    const viewportWidth = 1440

    const scale = revealCoverScale(screenWidth, viewportWidth)

    expect(scale).toBe(1.8)
  })

  it("garde l'échelle 1 quand l'écran n'est pas encore mesuré", () => {
    const screenWidth = 0
    const viewportWidth = 1440

    const scale = revealCoverScale(screenWidth, viewportWidth)

    expect(scale).toBe(1)
  })
})

describe('revealAspect', () => {
  it('passe de la proportion de la fenêtre à celle du MacBook', () => {
    const viewportAspect = 1.6
    const restAspect = 1.5

    const aspects = [0, 0.5, 1].map((progress) => revealAspect(progress, viewportAspect, restAspect))

    expect(aspects).toEqual([1.6, 1.55, 1.5])
  })
})

describe('revealScale', () => {
  it("part de l'échelle plein écran, finit à 1 et reste bornée hors de la course", () => {
    const coverScale = 2

    const scales = [-1, 0, 0.5, 1, 2].map((progress) => revealScale(progress, coverScale))

    expect(scales).toEqual([2, 2, 1.5, 1, 1])
  })
})

describe('revealBackdropOpacity', () => {
  it('disparaît à la moitié de la course', () => {
    const progresses = [0, 0.25, 0.5, 1]

    const opacities = progresses.map(revealBackdropOpacity)

    expect(opacities).toEqual([1, 0.5, 0, 0])
  })
})

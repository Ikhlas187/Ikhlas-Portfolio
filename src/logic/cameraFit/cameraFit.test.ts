import { describe, expect, it } from 'vitest'
import { coverBox, coverDistance, fitDistance } from '@/logic/cameraFit/cameraFit'

describe('fitDistance', () => {
  it('cadre sur la hauteur quand l’écran est plus large que le rectangle', () => {
    const square = { width: 2, height: 2 }
    const wideLens = { verticalFovDeg: 90, aspect: 2 }

    expect(fitDistance(square, wideLens)).toBeCloseTo(1)
  })

  it('cadre sur la largeur quand l’écran est en portrait', () => {
    const square = { width: 2, height: 2 }
    const portraitLens = { verticalFovDeg: 90, aspect: 0.5 }

    expect(fitDistance(square, portraitLens)).toBeCloseTo(2)
  })

  it('recule proportionnellement à la marge', () => {
    const square = { width: 2, height: 2 }
    const lens = { verticalFovDeg: 90, aspect: 1 }

    expect(fitDistance(square, lens, 1.5)).toBeCloseTo(1.5)
  })
})

describe('coverDistance', () => {
  it('cadre sur la largeur quand le cadre est plus large que le rectangle', () => {
    const square = { width: 2, height: 2 }
    const wideLens = { verticalFovDeg: 90, aspect: 2 }

    expect(coverDistance(square, wideLens)).toBeCloseTo(0.5)
  })

  it('cadre sur la hauteur quand le cadre est en portrait', () => {
    const square = { width: 2, height: 2 }
    const portraitLens = { verticalFovDeg: 90, aspect: 0.5 }

    expect(coverDistance(square, portraitLens)).toBeCloseTo(1)
  })
})

describe('coverBox', () => {
  it('garde toute la largeur et rogne la hauteur sur un cadre plus large', () => {
    const macScreen = { width: 1512, height: 982 }
    const desktopAspect = 1.6

    expect(coverBox(macScreen, desktopAspect, 1024)).toEqual({ width: 1512, height: 945, scale: 1 })
  })

  it('agrandit la zone logique et la réduit quand la partie visible est trop étroite', () => {
    const macScreen = { width: 1000, height: 1000 }
    const portraitAspect = 0.5

    expect(coverBox(macScreen, portraitAspect, 1000)).toEqual({ width: 1000, height: 2000, scale: 0.5 })
  })
})

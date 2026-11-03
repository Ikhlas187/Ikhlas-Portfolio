import { describe, expect, it } from 'vitest'
import { diveDistance, easeDive, macBookPoseAt, scrollTopFor, stageLightAt } from '@/logic/macBookScroll/macBookScroll'

describe('macBookPoseAt', () => {
  it('garde le capot fermé en haut de la section', () => {
    const topOfSection = 0

    expect(macBookPoseAt(topOfSection)).toEqual({ lid: 0, zoom: 0 })
  })

  it('ouvre le capot à moitié au milieu de sa plage', () => {
    const middleOfLidRange = 0.2

    expect(macBookPoseAt(middleOfLidRange).lid).toBeCloseTo(0.5)
    expect(macBookPoseAt(middleOfLidRange).zoom).toBe(0)
  })

  it('plonge dans l’écran une fois le capot ouvert', () => {
    const middleOfZoomRange = 0.46

    expect(macBookPoseAt(middleOfZoomRange).lid).toBe(1)
    expect(macBookPoseAt(middleOfZoomRange).zoom).toBeCloseTo(0.5)
  })

  it('commence la plongée avant la fin de l’ouverture du capot', () => {
    const endOfLidOpening = 0.33

    expect(macBookPoseAt(endOfLidOpening).lid).toBeLessThan(1)
    expect(macBookPoseAt(endOfLidOpening).zoom).toBeGreaterThan(0)
  })

  it('reste plein écran jusqu’à la fin de la section', () => {
    const endOfSection = 1

    expect(macBookPoseAt(endOfSection)).toEqual({ lid: 1, zoom: 1 })
  })
})

describe('scrollTopFor', () => {
  it('convertit une progression en défilement de page', () => {
    const sectionTop = 6000
    const scrollableHeight = 2000

    expect(scrollTopFor(0.7, sectionTop, scrollableHeight)).toBe(7400)
  })
})

describe('easeDive', () => {
  it('part et arrive aux bornes de la plongée', () => {
    const start = 0
    const end = 1

    expect(easeDive(start)).toBe(0)
    expect(easeDive(end)).toBe(1)
  })

  it('passe par le milieu à mi-course', () => {
    const half = 0.5

    expect(easeDive(half)).toBeCloseTo(0.5)
  })
})

describe('diveDistance', () => {
  it('part de la distance de la vue d’ensemble et arrive sur celle de l’écran', () => {
    const overviewDistance = 400
    const screenDistance = 25

    expect(diveDistance(overviewDistance, screenDistance, 0)).toBe(400)
    expect(diveDistance(overviewDistance, screenDistance, 1)).toBe(25)
  })

  it('passe par la moyenne géométrique à mi-plongée', () => {
    const overviewDistance = 400
    const screenDistance = 25

    expect(diveDistance(overviewDistance, screenDistance, 0.5)).toBeCloseTo(100)
  })
})

describe('stageLightAt', () => {
  it('garde le studio allumé tant que la plongée n’est pas avancée', () => {
    const earlyZoom = 0.5

    expect(stageLightAt(earlyZoom)).toBe(1)
  })

  it('éteint le studio quand l’écran remplit la vue', () => {
    const fullScreen = 1

    expect(stageLightAt(fullScreen)).toBe(0)
  })

  it('rallume le studio quand la caméra recule sur le Mac éteint', () => {
    const fullScreen = 1
    const retreated = 1

    expect(stageLightAt(fullScreen, retreated)).toBe(1)
  })
})

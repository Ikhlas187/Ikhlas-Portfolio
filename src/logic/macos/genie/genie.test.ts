import { describe, expect, it } from 'vitest'
import { genieOpacity, genieStripCount, genieStrips } from '@/logic/macos/genie/genie'

const window = { x: 200, y: 100, width: 600, height: 400 }
const icon = { x: 700, y: 900, width: 60, height: 60 }

describe('genieStripCount', () => {
  it('découpe une fenêtre moyenne en bandes de 18 px environ', () => {
    const windowHeight = 360

    expect(genieStripCount(windowHeight)).toBe(20)
  })

  it('garde au moins 12 bandes pour une petite fenêtre', () => {
    const smallWindowHeight = 100

    expect(genieStripCount(smallWindowHeight)).toBe(12)
  })

  it('plafonne à 40 bandes pour une très grande fenêtre', () => {
    const tallWindowHeight = 2000

    expect(genieStripCount(tallWindowHeight)).toBe(40)
  })
})

describe('genieStrips', () => {
  it('laisse la fenêtre intacte au départ', () => {
    const count = 4

    const stripsAtStart = genieStrips(window, icon, 0, count)

    expect(stripsAtStart).toEqual([
      { x: 200, y: 100, scaleX: 1, scaleY: 1 },
      { x: 200, y: 200, scaleX: 1, scaleY: 1 },
      { x: 200, y: 300, scaleX: 1, scaleY: 1 },
      { x: 200, y: 400, scaleX: 1, scaleY: 1 },
    ])
  })

  it("loge toutes les bandes dans le rectangle de l'icône à la fin", () => {
    const count = 4

    const stripsAtEnd = genieStrips(window, icon, 1, count)

    expect(stripsAtEnd.map((strip) => strip.x)).toEqual([700, 700, 700, 700])
    expect(stripsAtEnd.map((strip) => strip.scaleX * window.width)).toEqual([60, 60, 60, 60])
    expect(stripsAtEnd[0].y).toBe(900)
    expect(stripsAtEnd[3].y + stripsAtEnd[3].scaleY * (window.height / count)).toBe(960)
  })

  it('resserre le bas de la fenêtre plus que le haut pendant la torsion', () => {
    const count = 10
    const duringBend = 0.3

    const bentStrips = genieStrips(window, icon, duringBend, count)

    const widths = bentStrips.map((strip) => strip.scaleX)
    expect(widths[9]).toBeLessThan(widths[0])
    expect(widths).toEqual([...widths].sort((left, right) => right - left))
  })

  it('garde le haut de la fenêtre en place tant que la glissade n’a pas commencé', () => {
    const count = 10
    const endOfBend = 0.35

    const stripsAfterBend = genieStrips(window, icon, endOfBend, count)

    expect(stripsAfterBend[0].y).toBe(100)
    expect(stripsAfterBend[9].x).toBeGreaterThan(200)
  })

  it('borne la progression entre 0 et 1', () => {
    const count = 3

    const stripsBeyondEnd = genieStrips(window, icon, 1.5, count)

    expect(stripsBeyondEnd).toEqual(genieStrips(window, icon, 1, count))
  })
})

describe('genieOpacity', () => {
  it('reste opaque pendant presque toute l’animation', () => {
    const progress = 0.8

    expect(genieOpacity(progress)).toBe(1)
  })

  it('devient transparente à la toute fin', () => {
    const progress = 1

    expect(genieOpacity(progress)).toBe(0)
  })
})

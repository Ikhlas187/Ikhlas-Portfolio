import { describe, expect, it } from 'vitest'
import { easeInOutCubic, easeOutQuint } from '@/logic/easing/easing'

describe('easeInOutCubic', () => {
  it('part de 0, passe par la moitié au milieu et finit à 1', () => {
    const times = [0, 0.5, 1]

    const values = times.map(easeInOutCubic)

    expect(values).toEqual([0, 0.5, 1])
  })

  it('démarre lentement', () => {
    const earlyTime = 0.1

    const value = easeInOutCubic(earlyTime)

    expect(value).toBeLessThan(0.01)
  })
})

describe('easeOutQuint', () => {
  it('part de 0 et finit à 1', () => {
    const times = [0, 1]

    const values = times.map(easeOutQuint)

    expect(values).toEqual([0, 1])
  })

  it('a déjà fait presque tout le chemin à mi-parcours', () => {
    const halfTime = 0.5

    const value = easeOutQuint(halfTime)

    expect(value).toBeCloseTo(0.96875)
  })
})

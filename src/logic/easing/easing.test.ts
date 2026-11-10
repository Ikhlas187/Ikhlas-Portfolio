import { describe, expect, it } from 'vitest'
import { easeInOutCubic } from '@/logic/easing/easing'

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

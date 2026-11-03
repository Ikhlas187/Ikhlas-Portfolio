import { describe, expect, it } from 'vitest'
import { bootProgressAt } from '@/logic/macos/bootProgress/bootProgress'

describe('bootProgressAt', () => {
  it.each([
    [0, 0],
    [400, 15],
    [800, 30],
    [1500, 57.5],
    [2500, 90],
    [3000, 97.5],
  ])('à %i ms, la barre est à %f %%', (elapsedMs, progress) => {
    const elapsed = elapsedMs

    expect(bootProgressAt(elapsed)).toBe(progress)
  })

  it('marque un palier à 45,5 % autour de 1,2 s', () => {
    const elapsedInFirstStall = 1210

    expect(bootProgressAt(elapsedInFirstStall)).toBe(45.5)
  })

  it('marque un palier à 71 % autour de 1,8 s', () => {
    const elapsedInSecondStall = 1820

    expect(bootProgressAt(elapsedInSecondStall)).toBe(71)
  })

  it('plafonne à 100 % à partir de 3,2 s', () => {
    const elapsedAfterEnd = 4000

    expect(bootProgressAt(elapsedAfterEnd)).toBe(100)
  })
})

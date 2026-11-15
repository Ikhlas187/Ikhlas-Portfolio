import { describe, expect, test } from 'vitest'
import { landingKick } from '@/logic/nameStretch/landingKick/landingKick'

describe('landingKick', () => {
  test('pousse les lettres en sens alternés, la 1re de toute la force', () => {
    const chars = ['A', 'B', 'C']

    const [first, second, third] = landingKick(chars, 2)

    expect(first).toBeCloseTo(2)
    expect(second).toBeLessThan(0)
    expect(third).toBeGreaterThan(0)
  })

  test('ne pousse pas l’espace', () => {
    const chars = ['A', ' ', 'B']

    expect(landingKick(chars, 2)[1]).toBe(0)
  })
})

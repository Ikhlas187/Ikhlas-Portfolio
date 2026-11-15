import { describe, expect, test } from 'vitest'
import { pointerTargets } from '@/logic/nameStretch/pointerTargets/pointerTargets'

const settings = { spread: 1.4, strength: 0.6 }

describe('pointerTargets', () => {
  test('la lettre sous le pointeur reçoit le pic ln(1 + 2.4 × strength)', () => {
    const widths = [1, 1, 1]
    const chars = ['A', 'B', 'C']

    const targets = pointerTargets(widths, chars, 1.5, settings)

    expect(targets[1]).toBeCloseTo(Math.log(1 + 2.4 * 0.6))
  })

  test('les cibles décroissent en s’éloignant du pointeur', () => {
    const widths = [1, 1, 1, 1]
    const chars = ['A', 'B', 'C', 'D']

    const [first, second, third, fourth] = pointerTargets(widths, chars, 0.5, settings)

    expect(first).toBeGreaterThan(second)
    expect(second).toBeGreaterThan(third)
    expect(third).toBeGreaterThan(fourth)
  })

  test('pointeur sorti : toutes les cibles à 0', () => {
    const widths = [1, 1]
    const chars = ['A', 'B']

    expect(pointerTargets(widths, chars, null, settings)).toEqual([0, 0])
  })

  test('l’espace garde 0 même sous le pointeur', () => {
    const widths = [1, 0.3, 1]
    const chars = ['A', ' ', 'B']

    const targets = pointerTargets(widths, chars, 1.15, settings)

    expect(targets[1]).toBe(0)
  })
})

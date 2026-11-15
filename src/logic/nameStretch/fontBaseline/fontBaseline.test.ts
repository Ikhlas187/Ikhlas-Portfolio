import { describe, expect, test } from 'vitest'
import { fontBaseline } from '@/logic/nameStretch/fontBaseline/fontBaseline'

describe('fontBaseline', () => {
  test('police qui déborde de sa boîte : la ligne de base se recentre', () => {
    const ascent = 96.875
    const descent = 24.1455

    expect(fontBaseline(ascent, descent, 100)).toBeCloseTo(0.864, 3)
  })

  test('police sans débord : ligne de base à la hauteur de l’ascent', () => {
    const ascent = 80
    const descent = 20

    expect(fontBaseline(ascent, descent, 100)).toBeCloseTo(0.8)
  })
})

import { describe, expect, test } from 'vitest'
import { fadeOutBetween } from '@/logic/scrollFade/scrollFade'

describe('fadeOutBetween', () => {
  test.each([
    [0, 1],
    [0.74, 1],
    [0.83, 0.5],
    [0.92, 0],
    [1, 0],
  ])('avancée %s → opacité %s', (progress, opacity) => {
    expect(fadeOutBetween(progress, 0.74, 0.92)).toBeCloseTo(opacity)
  })
})

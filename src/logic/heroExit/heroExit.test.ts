import { describe, expect, test } from 'vitest'
import { heroExit } from '@/logic/heroExit/heroExit'

describe('heroExit', () => {
  test.each([
    { scrollY: 0, blur: 0, scale: 1 },
    { scrollY: 540, blur: 7.5, scale: 0.8 },
    { scrollY: 1080, blur: 15, scale: 0.6 },
    { scrollY: 5000, blur: 15, scale: 0.6 },
    { scrollY: -100, blur: 0, scale: 1 },
  ])('à $scrollY px sur un écran de 900 px : flou $blur px, échelle $scale', ({ scrollY, blur, scale }) => {
    const viewportHeight = 900

    const exitStyle = heroExit(scrollY, viewportHeight)

    expect(exitStyle.blur).toBeCloseTo(blur)
    expect(exitStyle.scale).toBeCloseTo(scale)
  })
})

import { describe, expect, it } from 'vitest'
import { brightnessShade } from '@/logic/macos/brightness/brightness'

describe('brightnessShade', () => {
  it('ne voile pas l’écran à pleine luminosité', () => {
    const fullBrightness = 1

    expect(brightnessShade(fullBrightness)).toBe(0)
  })

  it('voile l’écran à 85 % au minimum de luminosité', () => {
    const lowestBrightness = 0

    expect(brightnessShade(lowestBrightness)).toBe(0.85)
  })

  it('assombrit proportionnellement entre les 2 bornes', () => {
    const halfBrightness = 0.5

    expect(brightnessShade(halfBrightness)).toBe(0.425)
  })

  it('borne une luminosité hors plage', () => {
    const tooBright = 1.4

    expect(brightnessShade(tooBright)).toBe(0)
  })
})

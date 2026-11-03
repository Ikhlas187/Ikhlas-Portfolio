import { describe, expect, it } from 'vitest'
import { trackProgress } from '@/logic/music/trackProgress/trackProgress'

describe('trackProgress', () => {
  it('rend la part écoulée du morceau', () => {
    const currentTime = 30
    const duration = 120

    expect(trackProgress(currentTime, duration)).toBe(0.25)
  })

  it('rend 0 tant que la durée est inconnue', () => {
    const currentTime = 12
    const unknownDuration = Number.NaN

    expect(trackProgress(currentTime, unknownDuration)).toBe(0)
  })

  it('rend 0 pour une durée nulle', () => {
    const currentTime = 3
    const emptyDuration = 0

    expect(trackProgress(currentTime, emptyDuration)).toBe(0)
  })

  it('borne un temps qui dépasse la durée', () => {
    const pastTheEnd = 130
    const duration = 120

    expect(trackProgress(pastTheEnd, duration)).toBe(1)
  })
})

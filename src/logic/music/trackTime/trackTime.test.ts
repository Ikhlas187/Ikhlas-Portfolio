import { describe, expect, it } from 'vitest'
import { formatTrackTime } from '@/logic/music/trackTime/trackTime'

describe('formatTrackTime', () => {
  it('écrit les secondes sur 2 chiffres', () => {
    const threeMinutesSeven = 187

    expect(formatTrackTime(threeMinutesSeven)).toBe('3:07')
  })

  it('écrit 0:00 au début du morceau', () => {
    const start = 0

    expect(formatTrackTime(start)).toBe('0:00')
  })

  it('arrondit à la seconde inférieure', () => {
    const almostOneMinute = 59.9

    expect(formatTrackTime(almostOneMinute)).toBe('0:59')
  })

  it('garde les minutes au-delà de 10', () => {
    const twelveMinutes = 765

    expect(formatTrackTime(twelveMinutes)).toBe('12:45')
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -4])('affiche --:-- pour un temps inconnu (%s)', (unknownTime) => {
    expect(formatTrackTime(unknownTime)).toBe('--:--')
  })
})

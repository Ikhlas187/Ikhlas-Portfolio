import { describe, expect, it } from 'vitest'
import { formatMenuBarClock, msUntilNextMinute } from '@/logic/macos/clock/clock'

const mondayEvening = new Date('2026-11-02T20:12:30.250Z')

describe('formatMenuBarClock', () => {
  it('écrit le jour, le mois puis l’heure sur 12 h en anglais', () => {
    const englishLocale = 'en-US'

    expect(formatMenuBarClock(mondayEvening, englishLocale, 'UTC')).toBe('Mon Nov 2 8:12 PM')
  })

  it('écrit le jour avant le mois et l’heure sur 24 h en français', () => {
    const frenchLocale = 'fr-FR'

    expect(formatMenuBarClock(mondayEvening, frenchLocale, 'UTC')).toBe('lun. 2 nov. 20:12')
  })

  it('garde 2 chiffres pour les heures du matin en français', () => {
    const mondayMorning = new Date('2026-11-02T09:05:00Z')

    expect(formatMenuBarClock(mondayMorning, 'fr-FR', 'UTC')).toBe('lun. 2 nov. 09:05')
  })
})

describe('msUntilNextMinute', () => {
  it('compte le temps restant jusqu’à la minute suivante', () => {
    const halfwayThroughMinute = new Date(2026, 10, 2, 20, 12, 30, 250)

    expect(msUntilNextMinute(halfwayThroughMinute)).toBe(29_750)
  })
})

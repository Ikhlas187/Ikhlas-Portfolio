import { describe, expect, test } from 'vitest'
import { formatExperiencePeriod } from '@/logic/experiencePeriod/experiencePeriod'

describe('formatExperiencePeriod', () => {
  test.each([
    { locale: 'en', formattedPeriod: 'Dec 2025 — Mar 2026' },
    { locale: 'fr', formattedPeriod: 'déc. 2025 — mars 2026' },
  ])('écrit une période à cheval sur 2 années en $locale', ({ locale, formattedPeriod }) => {
    const period = { start: { year: 2025, month: 12 }, end: { year: 2026, month: 3 } }

    expect(formatExperiencePeriod(period, locale)).toBe(formattedPeriod)
  })

  test('garde janvier et décembre sur le bon mois', () => {
    const fullYear = { start: { year: 2026, month: 1 }, end: { year: 2026, month: 12 } }

    expect(formatExperiencePeriod(fullYear, 'en')).toBe('Jan 2026 — Dec 2026')
  })
})

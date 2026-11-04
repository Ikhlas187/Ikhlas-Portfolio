import { describe, expect, it, test } from 'vitest'
import { firstBookableDay, isBookableDay } from '@/logic/booking/bookableDay/bookableDay'

describe('isBookableDay', () => {
  const todayKey = '2026-11-04'

  test.each([
    ['2026-11-05', true],
    ['2026-11-06', true],
    ['2026-11-07', false],
    ['2026-11-08', false],
    ['2026-11-04', false],
    ['2026-11-03', false],
  ])('%s → %s', (key, isBookable) => {
    expect(isBookableDay(key, todayKey)).toBe(isBookable)
  })
})

describe('firstBookableDay', () => {
  it('saute le week-end', () => {
    const fridayKey = '2026-11-06'
    const keys = ['2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09']

    const nextBookableKey = firstBookableDay(keys, fridayKey)

    expect(nextBookableKey).toBe('2026-11-09')
  })

  it('rend null sans jour réservable', () => {
    const weekendKeys = ['2026-11-07', '2026-11-08']

    expect(firstBookableDay(weekendKeys, '2026-11-04')).toBeNull()
  })
})

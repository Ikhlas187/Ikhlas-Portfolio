import { describe, expect, it } from 'vitest'
import {
  composeMeetingMessage,
  dateKey,
  eventTimeRange,
  formatClock,
  isUpcoming,
  meetingSlots,
  monthCells,
  resolveEventDate,
  shiftMonth,
  type MeetingRequest,
} from '@/logic/macos/calendar/calendar'

describe('dateKey', () => {
  it('écrit la date au format AAAA-MM-JJ', () => {
    const march5 = new Date(2026, 2, 5)

    expect(dateKey(march5)).toBe('2026-03-05')
  })
})

describe('monthCells', () => {
  it('rend toujours 42 cases', () => {
    const february2026 = { year: 2026, month: 1 }

    const cells = monthCells(february2026.year, february2026.month, 0)

    expect(cells).toHaveLength(42)
  })

  it('commence un dimanche avec les jours du mois précédent quand weekStart vaut 0', () => {
    const december2026 = { year: 2026, month: 11 }

    const firstCells = monthCells(december2026.year, december2026.month, 0).slice(0, 3)

    expect(firstCells).toEqual([
      { key: '2026-11-29', day: 29, isInMonth: false },
      { key: '2026-11-30', day: 30, isInMonth: false },
      { key: '2026-12-01', day: 1, isInMonth: true },
    ])
  })

  it('commence le lundi quand weekStart vaut 1', () => {
    const november2026 = { year: 2026, month: 10 }

    const firstCell = monthCells(november2026.year, november2026.month, 1)[0]

    expect(firstCell).toEqual({ key: '2026-10-26', day: 26, isInMonth: false })
  })
})

describe('shiftMonth', () => {
  it('passe à janvier de l’année suivante après décembre', () => {
    const december2026 = { year: 2026, month: 11 }

    expect(shiftMonth(december2026.year, december2026.month, 1)).toEqual({ year: 2027, month: 0 })
  })
})

describe('resolveEventDate', () => {
  it('place un événement dans le mois décalé par rapport à aujourd’hui', () => {
    const today = new Date(2026, 10, 3)

    expect(resolveEventDate(today, 1, 14)).toBe('2026-12-14')
  })
})

describe('isUpcoming', () => {
  it.each([
    ['2026-11-03', true],
    ['2026-11-20', true],
    ['2026-10-31', false],
  ])('%s est à venir : %s', (key, isEventUpcoming) => {
    const todayKey = '2026-11-03'

    expect(isUpcoming(key, todayKey)).toBe(isEventUpcoming)
  })
})

describe('formatClock', () => {
  it.each([
    ['22:00', true, '10:00 PM'],
    ['00:30', true, '12:30 AM'],
    ['12:00', true, '12:00 PM'],
    ['08:30', false, '08:30'],
  ])('%s (12 h : %s) donne %s', (time, isHour12, clock) => {
    expect(formatClock(time, isHour12)).toBe(clock)
  })
})

describe('eventTimeRange', () => {
  it('ajoute la mention du lendemain quand l’événement passe minuit', () => {
    const lateEvent = { startTime: '22:00', endTime: '04:00', isSpanningMidnight: true }

    expect(eventTimeRange(lateEvent, true, '(+1 day)')).toBe('10:00 PM – 4:00 AM (+1 day)')
  })
})

describe('meetingSlots', () => {
  it('propose 25 créneaux de 08:00 à 20:00', () => {
    const slots = meetingSlots()

    expect([slots.length, slots[0], slots[1], slots.at(-1)]).toEqual([25, '08:00', '08:30', '20:00'])
  })
})

describe('composeMeetingMessage', () => {
  const labels = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    date: 'Date',
    time: 'Time',
    format: 'Format',
    topic: 'About',
    formats: { video: 'Video call', phone: 'Phone call', inPerson: 'In person' },
  }

  it('n’ajoute le téléphone que pour un appel téléphonique', () => {
    const phoneRequest: MeetingRequest = {
      name: ' Ada ',
      email: 'ada@example.com',
      phone: '+229 01 00 00 00',
      topic: 'Landing page',
      message: 'Hello',
      date: '2026-11-06',
      time: '12:00',
      timezone: 'Africa/Porto-Novo',
      format: 'phone',
    }

    expect(composeMeetingMessage(phoneRequest, labels)).toBe(
      [
        'Name: Ada',
        'Email: ada@example.com',
        'Date: 2026-11-06',
        'Time: 12:00 (Africa/Porto-Novo)',
        'Format: Phone call',
        'Phone: +229 01 00 00 00',
        'About: Landing page',
        '',
        'Hello',
      ].join('\n'),
    )
  })
})

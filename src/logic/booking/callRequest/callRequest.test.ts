import { describe, expect, it } from 'vitest'
import { callRequestMessage } from '@/logic/booking/callRequest/callRequest'

describe('callRequestMessage', () => {
  const template = 'Call request: {date} at {time}'

  it('ajoute le message sous la ligne du créneau', () => {
    const visitorNote = '  Hi, about my app.  '

    const requestText = callRequestMessage(template, 'Thursday, November 5', '9:00 AM', visitorNote)

    expect(requestText).toBe('Call request: Thursday, November 5 at 9:00 AM\n\nHi, about my app.')
  })

  it('garde seulement le créneau sans message', () => {
    const emptyNote = '   '

    expect(callRequestMessage(template, 'Friday, November 6', '14:30', emptyNote)).toBe(
      'Call request: Friday, November 6 at 14:30',
    )
  })
})

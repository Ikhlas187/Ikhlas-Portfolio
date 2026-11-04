import { describe, expect, it } from 'vitest'
import { bookingMailHref } from '@/logic/booking/bookingMail/bookingMail'

describe('bookingMailHref', () => {
  it('remplit le sujet et le corps avec le créneau', () => {
    const labels = { subject: 'Call on {date}', body: 'Hi, {date} at {time} works for me.' }

    const mailHref = bookingMailHref('me@example.com', labels, 'Thu 5 Nov', '9:00 AM')

    expect(mailHref).toBe(
      'mailto:me@example.com?subject=Call%20on%20Thu%205%20Nov&body=Hi%2C%20Thu%205%20Nov%20at%209%3A00%20AM%20works%20for%20me.',
    )
  })
})

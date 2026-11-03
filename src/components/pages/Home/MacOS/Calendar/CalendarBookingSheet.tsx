import { useState } from 'react'
import { Check } from 'lucide-react'
import BookingField from '@/components/pages/Home/MacOS/Calendar/BookingField'
import { GIANT_SUR } from '@/data/giantSur'
import { MACOS, type MeetingFormat } from '@/data/macos'
import { sendContactMessage } from '@/lib/api/contact'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { composeMeetingMessage, formatClock, keyToDate, meetingSlots } from '@/logic/macos/calendar/calendar'

type CalendarBookingSheetProps = { initialDate: string; todayKey: string; onClose: () => void }

const FORMATS: MeetingFormat[] = ['video', 'phone', 'inPerson']
const SLOTS = meetingSlots()
const INPUT =
  'min-w-0 flex-1 bg-transparent py-[10px] text-[15px] text-(--macos-app-ink) select-text placeholder:text-(--macos-app-faint) focus:outline-none'
const GROUP = 'overflow-hidden rounded-[12px] bg-(--macos-app-surface)'
const HEADER_BUTTON = 'cursor-pointer text-[16px] text-(--macos-calendar-red)'

export default function CalendarBookingSheet({ initialDate, todayKey, onClose }: CalendarBookingSheetProps) {
  const { locale } = useLocale()
  const calendar = MACOS[locale].calendar
  const texts = calendar.booking
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState('12:00')
  const [format, setFormat] = useState<MeetingFormat>('video')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Porto-Novo'

  const send = async () => {
    setIsSending(true)
    setError(null)
    try {
      const body = composeMeetingMessage(
        { name, email, phone, topic, message, date, time, timezone, format },
        { ...texts, topic: texts.about },
      )
      await sendContactMessage(email, `${texts.title}\n\n${body}`)
      setIsSent(true)
    } catch {
      setError(texts.error)
    } finally {
      setIsSending(false)
    }
  }

  const shortDate = keyToDate(date).toLocaleDateString(GIANT_SUR[locale].intlLocale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="absolute inset-0 z-30 flex cursor-pointer items-end bg-(--macos-app-scrim)" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[94%] w-full cursor-default flex-col rounded-t-[16px] bg-(--macos-calendar-sheet) shadow-(--macos-app-sheet-shadow)"
      >
        <div className="flex shrink-0 items-center justify-between px-[16px] pt-[12px] pb-[8px]">
          <button type="button" onClick={onClose} className={HEADER_BUTTON}>
            {isSent ? texts.done : texts.cancel}
          </button>
          <span className="text-[16px] font-semibold text-(--macos-app-ink)">{texts.title}</span>
          {isSent ? (
            <span className="w-[48px]" />
          ) : (
            <button
              type="button"
              onClick={send}
              disabled={isSending}
              className={cn(HEADER_BUTTON, 'font-semibold disabled:cursor-default disabled:opacity-40')}
            >
              {isSending ? texts.sending : texts.send}
            </button>
          )}
        </div>
        {isSent ? (
          <div className="px-[24px] pt-[40px] pb-[48px] text-center">
            <div className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-(--macos-calendar-red) text-(--macos-app-surface)">
              <Check strokeWidth={2.6} className="size-[28px]" />
            </div>
            <p className="mt-[16px] text-[19px] font-semibold text-(--macos-app-ink)">{texts.sentTitle}</p>
            <p className="mt-[4px] text-[14px] leading-relaxed text-(--macos-app-muted)">
              {texts.sentBody.replace('{date}', shortDate).replace('{time}', formatClock(time, calendar.isHour12))}
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-[20px] overflow-auto px-[16px] pt-[4px] pb-[40px]">
            <div className={GROUP}>
              <BookingField label={texts.name}>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value.slice(0, 100))}
                  placeholder={texts.namePlaceholder}
                  className={INPUT}
                />
              </BookingField>
              <BookingField label={texts.email}>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value.slice(0, 254))}
                  placeholder={texts.emailPlaceholder}
                  type="email"
                  inputMode="email"
                  className={INPUT}
                />
              </BookingField>
            </div>
            <div className={GROUP}>
              <BookingField label={texts.date}>
                <input
                  type="date"
                  value={date}
                  min={todayKey}
                  onChange={(event) => setDate(event.target.value)}
                  className={cn(INPUT, 'text-right')}
                />
              </BookingField>
              <BookingField label={texts.time}>
                <select
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className={cn(INPUT, 'cursor-pointer text-right')}
                >
                  {SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatClock(slot, calendar.isHour12)}
                    </option>
                  ))}
                </select>
              </BookingField>
              <p className="px-[16px] pb-[10px] text-[12px] text-(--macos-app-faint)">
                {texts.timezoneHint.replace('{timezone}', timezone.replace(/_/g, ' '))}
              </p>
            </div>
            <div>
              <div className="flex rounded-[9px] bg-(--macos-calendar-segment) p-[2px]">
                {FORMATS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFormat(item)}
                    className={cn(
                      'flex-1 cursor-pointer rounded-[7px] py-[6px] text-[13px] font-medium',
                      format === item
                        ? 'bg-(--macos-app-surface) text-(--macos-app-ink) shadow-(--macos-calendar-segment-shadow)'
                        : 'text-(--macos-app-secondary)',
                    )}
                  >
                    {texts.formats[item]}
                  </button>
                ))}
              </div>
              {format === 'phone' && (
                <div className={cn(GROUP, 'mt-[12px]')}>
                  <BookingField label={texts.phone}>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.slice(0, 30))}
                      placeholder={texts.phonePlaceholder}
                      type="tel"
                      inputMode="tel"
                      className={INPUT}
                    />
                  </BookingField>
                </div>
              )}
              {format === 'inPerson' && (
                <p className="mt-[8px] px-[4px] text-[12px] text-(--macos-app-muted)">{texts.inPersonHint}</p>
              )}
            </div>
            <div className={GROUP}>
              <BookingField label={texts.about}>
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value.slice(0, 120))}
                  placeholder={texts.aboutPlaceholder}
                  className={INPUT}
                />
              </BookingField>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, 4000))}
                placeholder={texts.messagePlaceholder}
                rows={5}
                className="w-full resize-none border-t border-(--macos-app-line) bg-transparent px-[16px] py-[12px] text-[15px] text-(--macos-app-ink) select-text placeholder:text-(--macos-app-faint) focus:outline-none"
              />
            </div>
            {error && <p className="px-[4px] text-[13px] text-(--macos-calendar-error)">{error}</p>}
            <p className="px-[4px] text-[12px] leading-relaxed text-(--macos-app-faint)">{texts.footnote}</p>
          </div>
        )}
      </div>
    </div>
  )
}

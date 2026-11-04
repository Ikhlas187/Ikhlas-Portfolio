import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FOOTER } from '@/data/footer'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { firstBookableDay, isBookableDay } from '@/logic/booking/bookableDay/bookableDay'
import { bookingMailHref } from '@/logic/booking/bookingMail/bookingMail'
import { dateKey, formatClock, keyToDate, meetingSlots, monthCells, shiftMonth } from '@/logic/macos/calendar/calendar'

const LOCALE_TAGS = { en: 'en-US', fr: 'fr-FR' } as const

/* Calendrier de réservation du footer (réf. haufsess.com) : un créneau ouvre un email pré-rempli. */
export default function BookingCalendar() {
  const { locale } = useLocale()
  const copy = FOOTER[locale].booking
  const localeTag = LOCALE_TAGS[locale]
  const [today] = useState(() => new Date())
  const todayKey = dateKey(today)
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [isHour12, setIsHour12] = useState(locale === 'en')

  const cells = useMemo(() => monthCells(view.year, view.month, 0), [view])
  const monthKeys = cells.filter((cell) => cell.isInMonth).map((cell) => cell.key)
  const [selectedKey, setSelectedKey] = useState(() => firstBookableDay(monthKeys, todayKey))
  const selectedDate = selectedKey ? keyToDate(selectedKey) : null
  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth()

  const monthName = new Intl.DateTimeFormat(localeTag, { month: 'long' }).format(new Date(view.year, view.month, 1))
  const dayTitle = selectedDate
    ? `${new Intl.DateTimeFormat(localeTag, { weekday: 'short' }).format(selectedDate)} ${selectedDate.getDate()}`
    : ''
  const mailDate = selectedDate
    ? new Intl.DateTimeFormat(localeTag, { weekday: 'long', day: 'numeric', month: 'long' }).format(selectedDate)
    : ''

  const changeMonth = (offset: number) => {
    const next = shiftMonth(view.year, view.month, offset)
    setView(next)
    const nextKeys = monthCells(next.year, next.month, 0)
      .filter((cell) => cell.isInMonth)
      .map((cell) => cell.key)
    setSelectedKey(firstBookableDay(nextKeys, todayKey))
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[8px] bg-white px-5 pt-5 text-black">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <p className="text-[16px] font-semibold capitalize">
          {monthName} <span className="font-medium text-black/50">{view.year}</span>
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label={copy.previousMonthLabel}
            disabled={isCurrentMonth}
            onClick={() => changeMonth(-1)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] text-black/40 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label={copy.nextMonthLabel}
            onClick={() => changeMonth(1)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] text-black/40 hover:text-black"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-black/10 py-3 text-center text-[12px] font-medium tracking-[0.06em]">
        {copy.weekDays.map((weekDay) => (
          <span key={weekDay}>{weekDay}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 pt-3">
        {cells.map((cell) => {
          if (!cell.isInMonth) return <span key={cell.key} aria-hidden="true" />
          const isBookable = isBookableDay(cell.key, todayKey)
          const isSelected = cell.key === selectedKey
          return (
            <button
              key={cell.key}
              type="button"
              disabled={!isBookable}
              aria-pressed={isSelected}
              onClick={() => setSelectedKey(cell.key)}
              className={cn(
                'relative flex aspect-square items-center justify-center rounded-[8px] text-[14px]',
                isBookable && 'cursor-pointer bg-black/8 font-medium hover:bg-black/15',
                isSelected && 'bg-black font-semibold text-white hover:bg-black',
                !isBookable && 'text-black/45',
              )}
            >
              {cell.day}
              {cell.key === todayKey && (
                <span aria-hidden="true" className="absolute bottom-[9px] size-1 rounded-full bg-current" />
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-auto flex min-h-0 flex-col pt-6">
          <div className="flex items-center justify-between pb-3">
            <p className="text-[16px] font-semibold capitalize">{dayTitle}</p>
            <div className="flex rounded-[8px] border border-black/10 p-0.5 text-[14px]">
              {[true, false].map((isOption12) => (
                <button
                  key={String(isOption12)}
                  type="button"
                  aria-pressed={isHour12 === isOption12}
                  onClick={() => setIsHour12(isOption12)}
                  className={cn(
                    'cursor-pointer rounded-[6px] px-1.5 py-0.5',
                    isHour12 === isOption12 ? 'bg-black/8 font-medium' : 'text-black/60',
                  )}
                >
                  {isOption12 ? copy.hour12Label : copy.hour24Label}
                </button>
              ))}
            </div>
          </div>
          <ul aria-label={copy.slotsLabel} className="flex max-h-[140px] flex-col gap-2 overflow-y-auto pb-5">
            {meetingSlots().map((slot) => {
              const time = formatClock(slot, isHour12)
              return (
                <li key={slot}>
                  <a
                    href={bookingMailHref(SITE.email, copy.mail, mailDate, time)}
                    className="flex h-9 cursor-pointer items-center justify-center rounded-[8px] border border-black/15 text-[14px] hover:border-black"
                  >
                    {time}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

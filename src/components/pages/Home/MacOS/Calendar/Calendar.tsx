import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CalendarBookingSheet from '@/components/pages/Home/MacOS/Calendar/CalendarBookingSheet'
import CalendarEventSheet from '@/components/pages/Home/MacOS/Calendar/CalendarEventSheet'
import { EVENT_DOT_CLASSES } from '@/components/pages/Home/MacOS/Calendar/eventDotClasses'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { GIANT_SUR } from '@/data/giantSur'
import { MACOS, type CalendarEvent } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import {
  dateKey,
  eventTimeRange,
  keyToDate,
  monthCells,
  resolveEventDate,
  shiftMonth,
} from '@/logic/macos/calendar/calendar'

type CalendarProps = { frame: WindowFrameProps }

export type DatedEvent = CalendarEvent & { date: string }

// Copie de l'app Calendrier de frvky.online : mois en grille, jour sélectionné, fiches en bas de fenêtre.
export default function Calendar({ frame }: CalendarProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].calendar
  const intlLocale = GIANT_SUR[locale].intlLocale
  const [today] = useState(() => new Date())
  const todayKey = dateKey(today)
  const [shown, setShown] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [openEvent, setOpenEvent] = useState<DatedEvent | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  const eventsByDate = useMemo(() => {
    const byDate = new Map<string, DatedEvent[]>()
    for (const event of texts.events) {
      const date = resolveEventDate(today, event.monthOffset, event.day)
      byDate.set(date, [...(byDate.get(date) ?? []), { ...event, date }])
    }
    return byDate
  }, [texts.events, today])

  const cells = monthCells(shown.year, shown.month, texts.weekStart)
  const selectedEvents = eventsByDate.get(selectedKey) ?? []
  const selectedLabel = keyToDate(selectedKey).toLocaleDateString(intlLocale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const selectDay = (key: string) => {
    setSelectedKey(key)
    const date = keyToDate(key)
    if (date.getMonth() !== shown.month || date.getFullYear() !== shown.year) {
      setShown({ year: date.getFullYear(), month: date.getMonth() })
    }
  }

  return (
    <FinderWindow frame={frame} title={MACOS[locale].appNames.calendar}>
      <div className="absolute inset-0 flex flex-col bg-(--macos-app-surface) font-(family-name:--font-macos-app) text-(--macos-app-ink) [&_:is(h1,h2)]:font-(family-name:--font-macos-app) [&_:is(h1,h2)]:tracking-normal">
        <div className="flex shrink-0 items-center justify-between border-b border-(--macos-app-line) px-[16px] py-[12px]">
          <button
            type="button"
            aria-label={texts.previous}
            onClick={() => setShown(shiftMonth(shown.year, shown.month, -1))}
            className="cursor-pointer p-[4px] text-(--macos-calendar-red)"
          >
            <ChevronLeft strokeWidth={2.2} className="size-[22px]" />
          </button>
          <h1 className="text-[17px] leading-[25.5px] font-semibold">
            <span className="capitalize">{texts.monthNames[shown.month]}</span> {shown.year}
          </h1>
          <button
            type="button"
            aria-label={texts.next}
            onClick={() => setShown(shiftMonth(shown.year, shown.month, 1))}
            className="cursor-pointer p-[4px] text-(--macos-calendar-red)"
          >
            <ChevronRight strokeWidth={2.2} className="size-[22px]" />
          </button>
        </div>
        <div className="grid grid-cols-7 border-b border-(--macos-app-line) px-[8px] pt-[8px] text-center text-[11px] leading-[16.5px] font-medium text-(--macos-app-faint)">
          {texts.weekdays.map((weekday, index) => (
            <div key={index}>{weekday}</div>
          ))}
        </div>
        <div className="grid shrink-0 grid-cols-7 gap-y-[4px] p-[8px]">
          {cells.map((cell) => {
            const isToday = cell.key === todayKey
            const isSelected = cell.key === selectedKey
            const dots = (eventsByDate.get(cell.key) ?? []).slice(0, 3)
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => selectDay(cell.key)}
                className="flex cursor-pointer flex-col items-center gap-[2px] py-[4px]"
              >
                <span
                  className={cn(
                    'flex size-[28px] items-center justify-center rounded-full text-[14px] leading-[21px]',
                    isToday
                      ? 'bg-(--macos-calendar-red) font-semibold text-(--macos-app-surface)'
                      : isSelected
                        ? 'border border-(--macos-calendar-red-ring) text-(--macos-app-ink)'
                        : cell.isInMonth
                          ? 'text-(--macos-app-ink)'
                          : 'text-(--macos-app-disabled)',
                  )}
                >
                  {cell.day}
                </span>
                <div className="flex h-[6px] gap-[2px]">
                  {dots.map((event) => (
                    <span key={event.id} className={cn('size-[6px] rounded-full', EVENT_DOT_CLASSES[event.kind])} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex items-center justify-between border-t border-(--macos-app-line) px-[16px] py-[8px]">
          <span className="text-[13px] leading-[19.5px] font-semibold text-(--macos-app-muted)">{selectedLabel}</span>
          <button
            type="button"
            onClick={() => setIsBooking(true)}
            className="cursor-pointer rounded-full bg-(--macos-calendar-red) px-[12px] py-[4px] text-[13px] leading-[19.5px] font-semibold text-(--macos-app-surface)"
          >
            {texts.bookMeeting}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto px-[16px] pb-[16px]">
          {selectedEvents.length === 0 ? (
            <div className="flex h-full items-center justify-center text-[14px] text-(--macos-app-faint)">
              {texts.noEvents}
            </div>
          ) : (
            <div className="space-y-[8px] pt-[4px]">
              {selectedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setOpenEvent(event)}
                  className="flex w-full cursor-pointer items-start gap-[10px] rounded-[8px] bg-(--macos-app-card) p-[10px] text-left"
                >
                  <span className={cn('mt-[2px] h-full w-[4px] shrink-0 rounded-full', EVENT_DOT_CLASSES[event.kind])} />
                  <div>
                    <div className="text-[14px] font-medium text-(--macos-app-ink)">{event.name}</div>
                    <div className="text-[12px] text-(--macos-app-muted)">
                      {eventTimeRange(event, texts.isHour12, texts.nextDay)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {openEvent && (
          <CalendarEventSheet event={openEvent} todayKey={todayKey} onClose={() => setOpenEvent(null)} />
        )}
        {isBooking && (
          <CalendarBookingSheet
            initialDate={selectedKey < todayKey ? todayKey : selectedKey}
            todayKey={todayKey}
            onClose={() => setIsBooking(false)}
          />
        )}
      </div>
    </FinderWindow>
  )
}

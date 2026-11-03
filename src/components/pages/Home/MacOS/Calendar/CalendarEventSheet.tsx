import type { DatedEvent } from '@/components/pages/Home/MacOS/Calendar/Calendar'
import { EVENT_DOT_CLASSES } from '@/components/pages/Home/MacOS/Calendar/eventDotClasses'
import { GIANT_SUR } from '@/data/giantSur'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { eventTimeRange, isUpcoming, keyToDate } from '@/logic/macos/calendar/calendar'

type CalendarEventSheetProps = { event: DatedEvent; todayKey: string; onClose: () => void }

export default function CalendarEventSheet({ event, todayKey, onClose }: CalendarEventSheetProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].calendar
  const fullDate = keyToDate(event.date).toLocaleDateString(GIANT_SUR[locale].intlLocale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="absolute inset-0 z-20 flex cursor-pointer items-end bg-(--macos-app-scrim)" onClick={onClose}>
      <div
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        className="w-full cursor-default rounded-t-[16px] bg-(--macos-app-surface) pt-[12px] pb-[32px] shadow-(--macos-app-sheet-shadow)"
      >
        <div className="mx-auto mb-[12px] h-[4px] w-[36px] rounded-full bg-(--macos-app-handle)" />
        <div className="px-[20px]">
          <div className="flex items-start justify-between">
            <h2 className="text-[19px] leading-tight font-semibold text-(--macos-app-ink)">{event.name}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={texts.eventClose}
              className="cursor-pointer text-[15px] font-medium text-(--macos-app-link)"
            >
              {texts.eventDone}
            </button>
          </div>
          <div className="mt-[16px] flex items-center gap-[8px]">
            <span className={cn('size-[10px] rounded-full', EVENT_DOT_CLASSES[event.kind])} />
            <span className="text-[13px] font-medium text-(--macos-app-secondary)">{event.kindLabel}</span>
          </div>
          <div className="mt-[16px] space-y-[4px] border-t border-(--macos-app-line) pt-[16px]">
            <div className="text-[15px] text-(--macos-app-ink)">{fullDate}</div>
            <div className="text-[14px] text-(--macos-app-muted)">
              {eventTimeRange(event, texts.isHour12, texts.nextDay)}
            </div>
          </div>
          {event.link && (
            <a
              href={event.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'mt-[20px] block cursor-pointer rounded-full py-[12px] text-center text-[15px] font-semibold text-(--macos-app-surface)',
                isUpcoming(event.date, todayKey) ? 'bg-(--macos-calendar-red)' : 'bg-(--macos-app-ink)',
              )}
            >
              {event.link.label}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

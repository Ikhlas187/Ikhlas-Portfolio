import type { CalendarEventKind } from '@/data/macos'

export const EVENT_DOT_CLASSES: Record<CalendarEventKind, string> = {
  release: 'bg-(--macos-calendar-dot-release)',
  meeting: 'bg-(--macos-calendar-dot-meeting)',
  other: 'bg-(--macos-calendar-dot-other)',
}

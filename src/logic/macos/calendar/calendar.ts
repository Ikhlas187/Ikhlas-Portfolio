import type { MeetingFormat } from '@/data/macos'

export type WeekStart = 0 | 1

export type CalendarCell = { key: string; day: number; isInMonth: boolean }

export type TimedEvent = { startTime: string; endTime: string; isSpanningMidnight: boolean }

export type MeetingRequest = {
  name: string
  email: string
  phone: string
  topic: string
  message: string
  date: string
  time: string
  timezone: string
  format: MeetingFormat
}

export type MeetingMessageLabels = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  format: string
  topic: string
  formats: Record<MeetingFormat, string>
}

const CELL_COUNT = 42

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function dateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function keyToDate(key: string) {
  return new Date(`${key}T00:00:00`)
}

// 6 semaines pleines, jours des mois voisins compris, comme le Calendrier de l'iPhone.
export function monthCells(year: number, month: number, weekStart: WeekStart): CalendarCell[] {
  const offset = (new Date(year, month, 1).getDay() - weekStart + 7) % 7
  return Array.from({ length: CELL_COUNT }, (_, index) => {
    const date = new Date(year, month, 1 - offset + index)
    return { key: dateKey(date), day: date.getDate(), isInMonth: date.getMonth() === month }
  })
}

export function shiftMonth(year: number, month: number, offset: number) {
  const target = new Date(year, month + offset, 1)
  return { year: target.getFullYear(), month: target.getMonth() }
}

export function resolveEventDate(today: Date, monthOffset: number, day: number) {
  return dateKey(new Date(today.getFullYear(), today.getMonth() + monthOffset, day))
}

export function isUpcoming(key: string, todayKey: string) {
  return key >= todayKey
}

export function formatClock(time: string, isHour12: boolean) {
  const [hours, minutes] = time.split(':').map(Number)
  if (!isHour12) return `${pad(hours)}:${pad(minutes)}`
  return `${hours % 12 || 12}:${pad(minutes)} ${hours >= 12 ? 'PM' : 'AM'}`
}

export function eventTimeRange(event: TimedEvent, isHour12: boolean, nextDayLabel: string) {
  const end = formatClock(event.endTime, isHour12) + (event.isSpanningMidnight ? ` ${nextDayLabel}` : '')
  return `${formatClock(event.startTime, isHour12)} – ${end}`
}

// Créneaux de 30 min de 08:00 à 20:00.
export function meetingSlots() {
  return Array.from({ length: 25 }, (_, index) => {
    const minutes = 480 + 30 * index
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
  })
}

export function composeMeetingMessage(request: MeetingRequest, labels: MeetingMessageLabels) {
  const lines = [
    `${labels.name}: ${request.name.trim()}`,
    `${labels.email}: ${request.email.trim()}`,
    `${labels.date}: ${request.date}`,
    `${labels.time}: ${request.time} (${request.timezone})`,
    `${labels.format}: ${labels.formats[request.format]}`,
  ]
  if (request.format === 'phone') lines.push(`${labels.phone}: ${request.phone.trim()}`)
  lines.push(`${labels.topic}: ${request.topic.trim()}`, '', request.message.trim())
  return lines.join('\n')
}

import { keyToDate } from '@/logic/macos/calendar/calendar'

// Réservable : un jour de semaine (lundi à vendredi) après aujourd'hui.
export function isBookableDay(key: string, todayKey: string) {
  const weekDay = keyToDate(key).getDay()
  return key > todayKey && weekDay !== 0 && weekDay !== 6
}

export function firstBookableDay(keys: readonly string[], todayKey: string) {
  return keys.find((key) => isBookableDay(key, todayKey)) ?? null
}

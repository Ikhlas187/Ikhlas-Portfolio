// Intl insère des espaces fines insécables (U+202F) avant AM/PM selon la version d'ICU : on les normalise.
function normalizeSpaces(value: string) {
  return value.replace(/[  ]/g, ' ')
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((item) => item.type === type)?.value ?? ''
}

// « Mon Nov 2 8:12 PM » en anglais, « lun. 2 nov. 20:12 » en français.
export function formatMenuBarClock(date: Date, intlLocale: string, timeZone?: string): string {
  const dateParts = new Intl.DateTimeFormat(intlLocale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone,
  }).formatToParts(date)
  const isEnglish = intlLocale.startsWith('en')
  const time = new Intl.DateTimeFormat(intlLocale, {
    hour: isEnglish ? 'numeric' : '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(date)
  const weekday = part(dateParts, 'weekday')
  const day = part(dateParts, 'day')
  const month = part(dateParts, 'month')
  const dayAndMonth = isEnglish ? `${month} ${day}` : `${day} ${month}`
  return normalizeSpaces(`${weekday} ${dayAndMonth} ${time}`)
}

export function msUntilNextMinute(date: Date): number {
  return 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds())
}

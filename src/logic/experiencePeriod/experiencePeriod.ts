import type { ExperiencePeriod, YearMonth } from '@/data/experience'

const PERIOD_SEPARATOR = ' — '

function formatYearMonth({ year, month }: YearMonth, locale: string) {
  // Jour 15 en UTC : aucun fuseau ne fait basculer la date sur le mois voisin.
  const date = new Date(Date.UTC(year, month - 1, 15))
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export function formatExperiencePeriod({ start, end }: ExperiencePeriod, locale: string) {
  return formatYearMonth(start, locale) + PERIOD_SEPARATOR + formatYearMonth(end, locale)
}

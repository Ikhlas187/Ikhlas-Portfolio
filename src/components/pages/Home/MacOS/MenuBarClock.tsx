import { useMinuteClock } from '@/components/pages/Home/MacOS/useMinuteClock'
import { GIANT_SUR } from '@/data/giantSur'
import { useLocale } from '@/lib/LocaleProvider'
import { formatMenuBarClock } from '@/logic/macos/clock/clock'

export default function MenuBarClock() {
  const { locale } = useLocale()
  const now = useMinuteClock()

  return (
    <time dateTime={now.toISOString()} className="pr-[8px] pl-[6px] font-medium tabular-nums">
      {formatMenuBarClock(now, GIANT_SUR[locale].intlLocale)}
    </time>
  )
}

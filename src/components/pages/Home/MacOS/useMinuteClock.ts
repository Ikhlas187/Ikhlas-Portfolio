import { useEffect, useState } from 'react'
import { msUntilNextMinute } from '@/logic/macos/clock/clock'

// Heure locale rafraîchie pile au changement de minute.
export function useMinuteClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeoutId = 0
    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        setNow(new Date())
        schedule()
      }, msUntilNextMinute(new Date()))
    }
    schedule()
    return () => window.clearTimeout(timeoutId)
  }, [])

  return now
}

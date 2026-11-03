import { useMemo, useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import CoinPile from '@/components/ui/CoinPile'
import { LOADER } from '@/data/loader'
import { buildRain, pileSettledAt, rainKeyframes, type CoinRainTiming } from '@/logic/coinRain/coinRain'

// Mêmes réglages de chute que le loader (components/ui/CoinLoader), le cycle est recalculé pour une seule chute.
const DROP_TIMING: CoinRainTiming = {
  cycle: 8,
  stagger: 0.16,
  rowPause: 0.35,
  fall: 0.97,
  bounce: 0.2,
  fadeIn: 0.08,
  swapFrom: 0.95,
  swapTo: 1.15,
  wipeFrom: 0.85,
  wipeTo: 0.93,
}
// Préfixe propre : le loader déclare déjà ses @keyframes rain-0, rain-1…
const KEYFRAMES_NAME = 'final-rain'

/* Fin de page : IKHLAS / AGBETI retombent une dernière fois, comme dans le loader, à l'arrivée du visiteur. */
export default function FinalCoinRain() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const isReducedMotion = useReducedMotion() ?? false

  const rain = useMemo(() => {
    const coins = buildRain(LOADER.rows, DROP_TIMING)
    const timing = { ...DROP_TIMING, cycle: pileSettledAt(coins, DROP_TIMING) }
    return { coins, cycle: timing.cycle, keyframes: rainKeyframes(coins, timing, KEYFRAMES_NAME) }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="flex h-[60svh] min-h-[340px] items-center justify-center bg-black">
      {isInView && (
        <CoinPile
          coins={rain.coins}
          keyframes={rain.keyframes}
          cycleSeconds={rain.cycle}
          rowCount={LOADER.rows.length}
          isStatic={isReducedMotion}
          isExiting={false}
          keyframesName={KEYFRAMES_NAME}
          isSingleDrop
        />
      )}
    </div>
  )
}

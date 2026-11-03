import { useEffect, useMemo, useRef, useState } from 'react'
import CoinPile from '@/components/ui/CoinPile'
import { Button } from '@/components/ui/button'
import { useLenis } from '@/lib/LenisProvider'
import { hasSeenLoader, markLoaderRevealed, markLoaderSeen } from '@/lib/loaderSession'
import { useLocale } from '@/lib/LocaleProvider'
import { LOADER, LOADER_LABELS } from '@/data/loader'
import { buildRain, isRevealCycle, rainKeyframes, rowsForCycle, type CoinRainTiming } from '@/logic/coinRain/coinRain'

const TIMING: CoinRainTiming = {
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
const FIRST_VISIT_DROPS = 3
const RETURN_VISIT_DROPS = 1
const EXIT_TOTAL_MS = 1400

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CoinLoader() {
  const lenis = useLenis()
  const { locale } = useLocale()
  const [isStatic] = useState(isReducedMotion)
  const [minDrops] = useState(() => (hasSeenLoader() ? RETURN_VISIT_DROPS : FIRST_VISIT_DROPS))
  const [isLoaded, setIsLoaded] = useState(() => document.readyState === 'complete')
  const [cycleIndex, setCycleIndex] = useState(0)
  const [hasFirstDropEnded, setHasFirstDropEnded] = useState(false)
  const [isSkipRequested, setIsSkipRequested] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isGone, setIsGone] = useState(false)
  const isLoadedRef = useRef(isLoaded)

  const rows = rowsForCycle(LOADER.rows, LOADER.roles, isStatic ? 0 : cycleIndex)
  const rowsKey = rows.join('|')
  const coins = useMemo(() => buildRain(rowsKey.split('|'), TIMING), [rowsKey])
  const keyframes = useMemo(() => rainKeyframes(coins, TIMING), [coins])

  useEffect(() => {
    isLoadedRef.current = isLoaded
    if (isLoaded) return
    const onLoad = () => setIsLoaded(true)
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [isLoaded])

  useEffect(() => {
    if (isStatic || isDone) return
    const wipeTimer = window.setTimeout(() => {
      setHasFirstDropEnded(true)
      if (isRevealCycle(cycleIndex, minDrops) && isLoadedRef.current) setIsDone(true)
    }, TIMING.wipeFrom * TIMING.cycle * 1000)
    const cycleTimer = window.setTimeout(() => setCycleIndex((index) => index + 1), TIMING.cycle * 1000)
    return () => {
      window.clearTimeout(wipeTimer)
      window.clearTimeout(cycleTimer)
    }
  }, [cycleIndex, isStatic, isDone, minDrops])

  useEffect(() => {
    if (isLoaded && (isStatic || isSkipRequested)) setIsDone(true)
  }, [isLoaded, isStatic, isSkipRequested])

  useEffect(() => {
    if (!isDone) return
    markLoaderSeen()
    markLoaderRevealed()
    const timer = window.setTimeout(() => setIsGone(true), isStatic ? 620 : EXIT_TOTAL_MS)
    return () => window.clearTimeout(timer)
  }, [isDone, isStatic])

  useEffect(() => {
    if (!lenis) return
    if (isDone) lenis.start()
    else lenis.stop()
  }, [lenis, isDone])

  if (isGone) return null

  const isSkipVisible = hasFirstDropEnded && minDrops > 1 && !isDone

  return (
    <div
      aria-hidden={isDone}
      role="status"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[26px] bg-black transition-opacity duration-500 ease-in-out ${isDone ? 'pointer-events-none opacity-0' : 'opacity-100'} ${isStatic ? 'delay-[120ms]' : 'delay-[650ms]'}`}
    >
      <CoinPile
        key={cycleIndex}
        coins={coins}
        keyframes={keyframes}
        cycleSeconds={TIMING.cycle}
        rowCount={rows.length}
        isStatic={isStatic}
        isExiting={isDone && !isStatic}
      />
      <span
        className={`text-[12px] font-extrabold tracking-[0.14em] text-white uppercase transition-opacity duration-300 after:animate-[rain-dots_1.4s_steps(4,end)_infinite] after:content-[''] ${isDone ? 'opacity-0' : 'opacity-100'}`}
      >
        {LOADER_LABELS[locale].label}
      </span>
      <Button
        variant="ghost"
        onClick={() => setIsSkipRequested(true)}
        className={`absolute bottom-10 cursor-pointer text-xs tracking-[0.14em] text-white/60 uppercase transition-opacity duration-500 hover:text-white ${isSkipVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {LOADER_LABELS[locale].skip}
      </Button>
    </div>
  )
}

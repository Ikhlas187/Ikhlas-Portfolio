import { useEffect, useMemo, useState } from 'react'
import CoinPile from '@/components/ui/CoinPile'
import { useLenis } from '@/lib/LenisProvider'
import { markLoaderRevealed } from '@/lib/loaderSession'
import { useLocale } from '@/lib/LocaleProvider'
import { LOADER, LOADER_LABELS } from '@/data/loader'
import { buildRain, rainKeyframes, rowsForCycle, type CoinRainTiming } from '@/logic/coinRain/coinRain'

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
const EXIT_TOTAL_MS = 1400

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CoinLoader() {
  const lenis = useLenis()
  const { locale } = useLocale()
  const [isStatic] = useState(isReducedMotion)
  const [isLoaded, setIsLoaded] = useState(() => document.readyState === 'complete')
  const [hasDropEnded, setHasDropEnded] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isGone, setIsGone] = useState(false)

  // Une seule chute : les 3 rangées posées, on entre dans le site (dès que la page a fini de charger).
  const rows = rowsForCycle(LOADER.rows, LOADER.roles, 0)
  const rowsKey = rows.join('|')
  const coins = useMemo(() => buildRain(rowsKey.split('|'), TIMING), [rowsKey])
  const keyframes = useMemo(() => rainKeyframes(coins, TIMING), [coins])

  useEffect(() => {
    if (isLoaded) return
    const onLoad = () => setIsLoaded(true)
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [isLoaded])

  useEffect(() => {
    if (isStatic) return
    const timer = window.setTimeout(() => setHasDropEnded(true), TIMING.wipeFrom * TIMING.cycle * 1000)
    return () => window.clearTimeout(timer)
  }, [isStatic])

  useEffect(() => {
    if (isLoaded && (isStatic || hasDropEnded)) setIsDone(true)
  }, [isLoaded, isStatic, hasDropEnded])

  useEffect(() => {
    if (!isDone) return
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

  return (
    <div
      aria-hidden={isDone}
      role="status"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[26px] bg-black transition-opacity duration-500 ease-in-out ${isDone ? 'pointer-events-none opacity-0' : 'opacity-100'} ${isStatic ? 'delay-[120ms]' : 'delay-[650ms]'}`}
    >
      <CoinPile
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
    </div>
  )
}

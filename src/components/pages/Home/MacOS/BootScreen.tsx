import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AppleLogo from '@/components/pages/Home/MacOS/AppleLogo'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { bootProgressAt } from '@/logic/macos/bootProgress/bootProgress'

type BootScreenProps = { isReducedMotion: boolean; onComplete: () => void }

// Timings relevés sur macweb.dev (MIT) : logo à 150 ms, barre à 500 ms, 100 % vers 3,2 s, bureau 300 ms plus tard.
const LOGO_DELAY_MS = 150
const PROGRESS_DELAY_MS = 500
const TICK_MS = 50
const HOLD_AFTER_FULL_MS = 300
const SAFETY_MS = 5000
// prefers-reduced-motion : même séquence, 4 fois plus courte (moins d'1 s).
const REDUCED_TIME_SCALE = 0.25

export default function BootScreen({ isReducedMotion, onComplete }: BootScreenProps) {
  const { locale } = useLocale()
  const [isLogoVisible, setIsLogoVisible] = useState(false)
  const [isProgressVisible, setIsProgressVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const timeScale = isReducedMotion ? REDUCED_TIME_SCALE : 1
    const startTime = performance.now()
    let hasFinished = false
    let completeId = 0

    const finish = () => {
      if (hasFinished) return
      hasFinished = true
      window.clearInterval(intervalId)
      setProgress(100)
      completeId = window.setTimeout(() => onCompleteRef.current(), HOLD_AFTER_FULL_MS * timeScale)
    }

    const logoId = window.setTimeout(() => setIsLogoVisible(true), LOGO_DELAY_MS * timeScale)
    const progressId = window.setTimeout(() => setIsProgressVisible(true), PROGRESS_DELAY_MS * timeScale)
    const intervalId = window.setInterval(() => {
      const value = bootProgressAt((performance.now() - startTime) / timeScale)
      if (value >= 100) finish()
      else setProgress(value)
    }, TICK_MS)
    const safetyId = window.setTimeout(finish, SAFETY_MS * timeScale)

    return () => {
      window.clearTimeout(logoId)
      window.clearTimeout(progressId)
      window.clearTimeout(safetyId)
      window.clearTimeout(completeId)
      window.clearInterval(intervalId)
    }
  }, [isReducedMotion])

  return (
    <motion.div
      role="status"
      aria-label={MACOS[locale].boot.label}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
    >
      <div className="flex flex-col items-center gap-[24px]">
        <div
          className={cn(
            'flex size-[96px] items-center justify-center text-(--macos-progress-fill) drop-shadow-(--macos-boot-logo-glow) transition-opacity duration-500 ease-out motion-reduce:transition-none',
            isLogoVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          <AppleLogo className="size-full" />
        </div>
        {isProgressVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-[2px] w-[280px] overflow-hidden rounded-[2px] bg-(--macos-progress-track)"
          >
            <div
              className="h-full rounded-[2px] bg-(--macos-progress-fill) shadow-(--macos-progress-glow) transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </motion.div>
        ) : (
          <div className="h-[2px] w-[280px]" />
        )}
      </div>
    </motion.div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import BootScreen from '@/components/pages/Home/MacOS/BootScreen'
import Desktop from '@/components/pages/Home/MacOS/Desktop'
import MacReposProvider from '@/components/pages/Home/MacOS/MacReposProvider'
import Wallpaper from '@/components/pages/Home/MacOS/Wallpaper'
import { readMacDisplay, saveMacDisplay, type MacDisplay } from '@/lib/macDisplaySession'
import { cn } from '@/lib/utils'
import { brightnessShade } from '@/logic/macos/brightness/brightness'

type MacOSProps = {
  isPoweredOn: boolean
  onShutdown?: () => void
}

type Phase = 'off' | 'boot' | 'desktop'

const THEME_TRANSITION_MS = 450

// Écran du MacBook 3D (1512 × 982) : démarrage de macweb.dev, bureau Giant Sur avec le fond et la barre de menus du 1er macOS.
export default function MacOS({ isPoweredOn, onShutdown }: MacOSProps) {
  const [phase, setPhase] = useState<Phase>(isPoweredOn ? 'boot' : 'off')
  const [hasBeenPoweredOn, setHasBeenPoweredOn] = useState(isPoweredOn)
  const [display, setDisplay] = useState<MacDisplay>(readMacDisplay)
  const [isThemeChanging, setIsThemeChanging] = useState(false)
  const themeTimer = useRef(0)
  const isReducedMotion = useReducedMotion() ?? false

  if (isPoweredOn !== hasBeenPoweredOn) {
    setHasBeenPoweredOn(isPoweredOn)
    setPhase(isPoweredOn ? 'boot' : 'off')
  }

  useEffect(() => saveMacDisplay(display), [display])
  useEffect(() => () => window.clearTimeout(themeTimer.current), [])

  const changeDisplay = useCallback(
    (next: MacDisplay) => {
      if (next.isDarkMode !== display.isDarkMode && !isReducedMotion) {
        setIsThemeChanging(true)
        window.clearTimeout(themeTimer.current)
        themeTimer.current = window.setTimeout(() => setIsThemeChanging(false), THEME_TRANSITION_MS)
      }
      setDisplay(next)
    },
    [display.isDarkMode, isReducedMotion],
  )

  const finishBoot = useCallback(() => setPhase('desktop'), [])

  const shutDown = () => {
    if (onShutdown) onShutdown()
    else setPhase('off')
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-macos-root
        data-macos-theme={display.isDarkMode ? 'dark' : 'light'}
        onContextMenu={(event) => event.preventDefault()}
        className={cn(
          'relative flex size-full overflow-hidden bg-(--color-giantsur-black) font-(family-name:--font-giantsur) text-[1rem]/[1.5]',
          // Les tokens changent d'un coup : le temps de la bascule, chaque élément fond ses couleurs vers les nouvelles.
          isThemeChanging &&
            '[&_*]:transition-[background-color,border-color,color,box-shadow]! [&_*]:duration-[400ms]! [&_*]:ease-out!',
        )}
      >
        {phase === 'desktop' && <Wallpaper />}
        {phase === 'desktop' && (
          <MacReposProvider>
            <Desktop
              display={display}
              onDisplayChange={changeDisplay}
              onRestart={() => setPhase('boot')}
              onShutdown={shutDown}
            />
          </MacReposProvider>
        )}
        <AnimatePresence>
          {phase === 'boot' && <BootScreen key="boot" isReducedMotion={isReducedMotion} onComplete={finishBoot} />}
        </AnimatePresence>
        {/* Voile de luminosité : au-dessus de tout l'écran, sous le seul centre de contrôle (z-50). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 bg-(--macos-brightness-shade) transition-opacity duration-150"
          style={{ opacity: brightnessShade(display.brightness) }}
        />
      </div>
    </MotionConfig>
  )
}

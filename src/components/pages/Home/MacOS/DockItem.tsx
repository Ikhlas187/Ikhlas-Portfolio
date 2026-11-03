import { motion } from 'framer-motion'
import { dockBounceKeyframes } from '@/logic/giantSur/dockBounce/dockBounce'

type DockItemProps = {
  app: string
  title: string
  logo: string
  width: string
  isRunning: boolean
  isLaunching: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

// 3 sauts amortis en 1 s, le temps que l'app « charge » (même durée que LAUNCH_DELAY_MS du bureau).
const BOUNCE = dockBounceKeyframes(26, 3, 0.55)
const BOUNCE_TRANSITION = {
  duration: 1,
  times: BOUNCE.times,
  ease: BOUNCE.y.slice(1).map((_, index) => (index % 2 === 0 ? 'easeOut' : 'easeIn')),
}

export default function DockItem({
  app,
  title,
  logo,
  width,
  isRunning,
  isLaunching,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: DockItemProps) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      data-dock-app={app}
      className="relative w-16 cursor-pointer p-2 align-bottom transition-all duration-200 ease-[ease]"
      style={{ width }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <motion.img
        alt=""
        className="w-full select-none"
        src={logo}
        draggable={false}
        animate={{ y: isLaunching ? BOUNCE.y : 0 }}
        transition={isLaunching ? BOUNCE_TRANSITION : { duration: 0 }}
      />
      {isRunning && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-(--macos-dock-dot)"
        />
      )}
    </button>
  )
}

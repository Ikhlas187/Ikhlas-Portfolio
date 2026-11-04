import { useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { isLoaderRevealed, subscribeLoaderReveal } from '@/lib/loaderSession'

type HeroNameProps = {
  name: string
}

const MOUNT_DELAY = 0.2
// Le voile du loader attend 650 ms puis s'efface en 500 ms : le nom part quand il est presque transparent.
const AFTER_LOADER_DELAY = 1.05

// Comme la réf. : viewBox = chasse du nom en Plus Jakarta Sans 400 à 269.149px (+ 1 interlettrage) x 269, à recalculer si le nom change.
export default function HeroName({ name }: HeroNameProps) {
  const isRevealed = useSyncExternalStore(subscribeLoaderReveal, isLoaderRevealed)
  const [wasRevealedOnMount] = useState(isLoaderRevealed)
  const shouldReduceMotion = useReducedMotion()
  const hiddenY = shouldReduceMotion ? 0 : 50
  const delay = wasRevealedOnMount || shouldReduceMotion ? MOUNT_DELAY : AFTER_LOADER_DELAY

  return (
    <div className="flex w-full overflow-clip min-[810px]:px-5 min-[810px]:pb-[46px] min-[1200px]:px-8">
      <motion.h1
        initial={{ opacity: 0.001, y: hiddenY }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0.001, y: hiddenY }}
        transition={{ type: 'spring', stiffness: 130, damping: 30, mass: 0.1, delay }}
        className="w-full"
      >
        <svg viewBox="0 0 849 269" className="block h-auto w-full" role="img" aria-label={name}>
          <text
            x="0"
            y="244"
            className="fill-black font-heading text-[269.149px] font-normal tracking-[-0.08em] whitespace-pre"
          >
            {name}
          </text>
        </svg>
      </motion.h1>
    </div>
  )
}

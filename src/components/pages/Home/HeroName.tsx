import { useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import NameMark from '@/components/pages/Home/NameMark'
import { isLoaderRevealed, subscribeLoaderReveal } from '@/lib/loaderSession'

type HeroNameProps = {
  name: string
}

const MOUNT_DELAY = 0.2
// Le voile du loader attend 650 ms puis s'efface en 500 ms : le nom part quand il est presque transparent.
const AFTER_LOADER_DELAY = 1.05

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
        <NameMark name={name} className="text-black" />
      </motion.h1>
    </div>
  )
}

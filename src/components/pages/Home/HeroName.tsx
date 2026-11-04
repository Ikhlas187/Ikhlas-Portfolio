import { useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { isLoaderRevealed, subscribeLoaderReveal } from '@/lib/loaderSession'

type HeroNameProps = {
  name: string
}

const MOUNT_DELAY = 0.2
// Le voile du loader attend 650 ms puis s'efface en 500 ms : le nom part quand il est presque transparent.
const AFTER_LOADER_DELAY = 1.05

// Copie de la réf. : viewBox 1136 x 269 et texte HTML dans un foreignObject, mis à l'échelle de la largeur.
// La viewBox n'est pas recalée sur le nom : les lettres ont la taille de celles de la réf., le nom est centré dans la largeur.
// Le Plus Jakarta Sans de Google Fonts a un ascendant plus court que celui servi par Framer (279 contre 350 à cette taille) :
// à line-height 100 %, sa ligne de base tombe à 244 au lieu de 261. top 17px (unités de la viewBox) la remet au même endroit.
// left -8.5px recentre l'encre : avec l'interlettrage négatif, text-center laisse le nom décalé vers la droite.
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
        <svg viewBox="0 0 1136 269" className="block h-auto w-full overflow-hidden" role="img" aria-label={name}>
          <foreignObject width="100%" height="100%" className="overflow-visible">
            <p className="relative top-[17px] -left-[8.5px] m-0 text-center font-heading text-[269.149px] leading-[100%] font-normal tracking-[-0.08em] whitespace-pre text-black">
              {name}
            </p>
          </foreignObject>
        </svg>
      </motion.h1>
    </div>
  )
}

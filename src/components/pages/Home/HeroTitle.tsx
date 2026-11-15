import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Globe } from 'lucide-react'
import EyesCursor from '@/components/pages/Home/EyesCursor'
import StretchedName from '@/components/pages/Home/StretchedName'
import { cn } from '@/lib/utils'
import { badgeIntro } from '@/logic/badgeIntro/badgeIntro'
import { heroExit } from '@/logic/heroExit/heroExit'

type HeroTitleProps = {
  name: string
  location: string
  availability: string
  establishedLabel: string
  establishedYear: string
  tagline: string
  ctaLabel: string
  isVisible: boolean
  exitStart: number
}

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const

/* Héros de dexharlan.framer.website : lieu et disponibilité, ESTD / phrase / année, lien de contact, puis le nom géant
   qui se déforme sous le pointeur. Curseur en yeux au survol, une fois le badge effacé. */
export default function HeroTitle({
  name,
  location,
  availability,
  establishedLabel,
  establishedYear,
  tagline,
  ctaLabel,
  isVisible,
  exitStart,
}: HeroTitleProps) {
  const shouldReduceMotion = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const exitFilter = useTransform(scrollY, (y) => `blur(${heroExit(y - exitStart, { width: window.innerWidth, height: window.innerHeight }).blur}px)`)
  const exitScale = useTransform(scrollY, (y) => heroExit(y - exitStart, { width: window.innerWidth, height: window.innerHeight }).scale)
  // Tant que le canvas du badge est là, les événements doivent lui arriver avec les coordonnées de la section.
  const isBadgeGone = (y: number) => badgeIntro(y / exitStart).canvasOpacity <= 0
  const [isInteractive, setIsInteractive] = useState(() => isBadgeGone(scrollY.get()))
  const [isHovered, setIsHovered] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setIsInteractive(isBadgeGone(y)))
  const isEyesActive = isInteractive && isHovered

  // Réf. : les blocs montent d'un bloc, sans décalage par mot ; ils repartent si l'on remonte dans l'intro du badge.
  const reveal = (offset: number, delay: number, duration: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0.001, y: offset },
          animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0.001, y: offset },
          transition: isVisible ? { duration, delay, ease: REVEAL_EASE } : { duration: 0.3, ease: REVEAL_EASE },
        }

  return (
    <motion.div
      ref={root}
      style={shouldReduceMotion ? undefined : { filter: exitFilter, scale: exitScale }}
      onPointerMove={(event) => setIsHovered(event.pointerType === 'mouse')}
      onPointerLeave={() => setIsHovered(false)}
      className={cn(
        'flex h-full w-full flex-col gap-8 pt-24 font-sans text-black antialiased min-[810px]:gap-9 min-[1200px]:gap-12',
        isInteractive ? 'pointer-events-auto' : 'pointer-events-none',
        isEyesActive && 'cursor-none',
      )}
    >
      <div className="flex w-full flex-col items-center gap-6 overflow-clip">
        <motion.p {...reveal(12, 0.1, 0.8)} className="flex h-8 items-center justify-center gap-12 text-center text-[13px] leading-[1.2] font-normal min-[810px]:gap-4 min-[810px]:text-[14px]">
          <span>{location}</span>
          <span className="flex h-8 w-[30px] items-center justify-center">
            <Globe aria-hidden="true" className="size-[30px]" strokeWidth={1.5} />
          </span>
          <span>{availability}</span>
        </motion.p>
        <motion.div {...reveal(16, 0.2, 0.9)} className="flex w-full items-center justify-center gap-5 uppercase min-[810px]:gap-10">
          <span className="shrink-0 text-[12px] leading-[1.2] font-semibold tracking-[-0.02em]">{establishedLabel}</span>
          <p className="max-w-[480px] flex-[1_0_0] text-center text-[16px] leading-[1.2] font-semibold tracking-[-0.04em] text-balance min-[810px]:max-w-[680px] min-[810px]:text-[18px] min-[1200px]:max-w-[480px] min-[1200px]:text-[20px]">
            {tagline}
          </p>
          <span className="shrink-0 text-[12px] leading-[1.2] font-semibold tracking-[-0.02em]">{establishedYear}</span>
        </motion.div>
        <motion.div {...reveal(12, 0.3, 0.8)} className="flex justify-center">
          <a
            href="#contact"
            className={cn(
              'text-[14px] leading-[1.2] font-semibold tracking-[-0.02em] uppercase underline transition-[color,text-decoration-color,text-decoration-thickness,text-underline-offset] duration-300 ease-[cubic-bezier(0.44,0,0.56,1)] hover:no-underline min-[810px]:text-[16px]',
              isEyesActive ? 'cursor-none' : 'cursor-pointer',
            )}
          >
            {ctaLabel}
          </a>
        </motion.div>
      </div>
      <div className="@container flex w-full">
        <StretchedName text={name} isVisible={isVisible} />
      </div>
      <EyesCursor scope={root} isActive={isEyesActive} />
    </motion.div>
  )
}

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Globe } from 'lucide-react'
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

const FIRST_DELAY = 0.1
const STAGGER = 0.1

/* Infos du hero de dexharlan.framer.website : lieu et disponibilité, ESTD / phrase / année, lien de contact,
   puis le nom géant étiré et vu en perspective (à plat sur téléphone). */
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
  const { scrollY } = useScroll()
  const exitFilter = useTransform(scrollY, (y) => `blur(${heroExit(y - exitStart, { width: window.innerWidth, height: window.innerHeight }).blur}px)`)
  const exitScale = useTransform(scrollY, (y) => heroExit(y - exitStart, { width: window.innerWidth, height: window.innerHeight }).scale)
  const words = name.split(' ')

  const hidden = shouldReduceMotion ? { opacity: 0.001 } : { opacity: 0.001, filter: 'blur(10px)', y: 10, scale: 0.95 }
  const visible = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }
  // Le hero apparaît quand le dos de la carte se montre, et repart si l'on remonte.
  const reveal = (index: number) => ({
    initial: hidden,
    animate: isVisible ? visible : hidden,
    transition: { type: 'spring' as const, bounce: 0, duration: 1.8, restDelta: 0.001, delay: FIRST_DELAY + index * STAGGER },
  })

  return (
    <motion.div
      style={shouldReduceMotion ? undefined : { filter: exitFilter, scale: exitScale }}
      className="pointer-events-none flex h-full w-full flex-col items-center pt-24 font-sans text-black uppercase antialiased"
    >
      <motion.p {...reveal(0)} className="flex w-full items-center justify-between text-[14px] normal-case min-[810px]:w-auto min-[810px]:gap-6 min-[810px]:text-[16px]">
        <span>{location}</span>
        <Globe aria-hidden="true" className="size-6" strokeWidth={1.5} />
        <span>{availability}</span>
      </motion.p>
      <motion.div {...reveal(1)} className="mt-8 grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 min-[810px]:w-[640px] min-[810px]:gap-10">
        <span className="text-[12px] font-medium">{establishedLabel}</span>
        <p className="text-[16px] leading-none font-medium tracking-[-0.03em] text-balance min-[810px]:text-[22px]">{tagline}</p>
        <span className="text-[12px] font-medium">{establishedYear}</span>
      </motion.div>
      <motion.a
        {...reveal(2)}
        href="#contact"
        className="pointer-events-auto mt-6 cursor-pointer text-[14px] font-medium underline underline-offset-4 min-[810px]:text-[16px]"
      >
        {ctaLabel}
      </motion.a>
      <div className="mt-8 flex w-full justify-center min-[810px]:mt-10">
        <h1 className="w-full origin-top text-[13vw] min-[810px]:text-[13.6vw] leading-none font-black tracking-[-0.05em] whitespace-nowrap [font-feature-settings:'ss07'] [font-optical-sizing:none] [transform:scaleY(1.6)] min-[810px]:[transform:translateX(-3vw)_perspective(1400px)_rotateY(-10deg)_scaleY(1.7)]">
          {words.map((word, index) => (
            <span key={index}>
              {index > 0 && ' '}
              <motion.span {...reveal(3 + index)} className="inline-block will-change-transform">
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </div>
    </motion.div>
  )
}

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { heroExit } from '@/logic/heroExit/heroExit'

type HeroTitleProps = {
  name: string
  role: string
  isVisible: boolean
  exitStart: number
}

const NAME_DELAY = 0.1
const STAGGER = 0.1
const TEXT_CLASSES = "uppercase antialiased [font-feature-settings:'ss07'] [font-optical-sizing:none] text-balance"

export default function HeroTitle({ name, role, isVisible, exitStart }: HeroTitleProps) {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const exitFilter = useTransform(scrollY, (y) => `blur(${heroExit(y - exitStart, { width: window.innerWidth, height: window.innerHeight }).blur}px)`)
  const exitScale = useTransform(scrollY, (y) => heroExit(y - exitStart, { width: window.innerWidth, height: window.innerHeight }).scale)
  const words = name.split(' ')

  const hidden = shouldReduceMotion
    ? { opacity: 0.001 }
    : { opacity: 0.001, filter: 'blur(10px)', y: 10, scale: 0.95 }
  const visible = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }
  // Le titre apparaît quand la carte remplit l'écran, et repart si l'on remonte.
  const reveal = (index: number) => ({
    initial: hidden,
    animate: isVisible ? visible : hidden,
    transition: { type: 'spring' as const, bounce: 0, duration: 1.8, restDelta: 0.001, delay: NAME_DELAY + index * STAGGER },
  })

  return (
    <motion.div
      style={shouldReduceMotion ? undefined : { filter: exitFilter, scale: exitScale }}
      className="pointer-events-none flex w-full flex-col items-center justify-center gap-5"
    >
      <h1
        className={`w-full font-sans text-[56px] leading-none font-medium tracking-[-0.06em] min-[810px]:text-[110px] min-[1200px]:text-[132px] min-[1280px]:text-[170px] ${TEXT_CLASSES}`}
      >
        {words.map((word, index) => (
          <span key={index}>
            {index > 0 && ' '}
            <motion.span {...reveal(index)} className="inline-block will-change-transform">
              {word}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.p
        {...reveal(words.length)}
        className={`w-full font-sans text-[16px] will-change-transform leading-[1.2] font-normal tracking-[-0.04em] ${TEXT_CLASSES}`}
      >
        {role}
      </motion.p>
    </motion.div>
  )
}

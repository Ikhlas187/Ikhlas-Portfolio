import { motion, useReducedMotion } from 'framer-motion'

type ExperienceHeadingProps = {
  title: string
}

// Trait « Line Empty » vers « Line Full » de la réf. : 1 % puis 100 % de sa piste, une seule fois à mi-visibilité.
const LINE_TRANSITION = { type: 'tween', delay: 0.25, duration: 1, ease: [0.12, 0.23, 0.5, 1] } as const

/* Titre de section de la réf. haufsess.com : trait de 2 px qui pousse depuis le titre vers la gauche. */
export default function ExperienceHeading({ title }: ExperienceHeadingProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="empty"
      whileInView="full"
      viewport={{ once: true, amount: 0.5 }}
      className="flex w-full items-center justify-center gap-2 overflow-clip"
    >
      {/* Piste à 110 % centrée et retournée comme la réf. : le trait part du titre et ses 5 premiers % restent cachés. */}
      <div aria-hidden className="flex w-px flex-1 rotate-180 flex-col items-center overflow-hidden">
        <div className="flex h-[2px] w-[110%] shrink-0 flex-col items-start">
          <motion.div
            variants={{ empty: { width: shouldReduceMotion ? '100%' : '1%' }, full: { width: '100%' } }}
            transition={LINE_TRANSITION}
            className="h-[2px] bg-black"
          />
        </div>
      </div>
      <h2 className="shrink-0 font-heading text-[28px] leading-[1.2] font-medium tracking-[-0.02em] whitespace-pre min-[810px]:text-[36px] min-[1200px]:text-[40px]">
        {title}
      </h2>
    </motion.div>
  )
}

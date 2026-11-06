import { useEffect, useRef, useState } from 'react'
import CallWidget from '@/components/pages/Home/CallWidget'
import FooterLinkColumn from '@/components/pages/Home/FooterLinkColumn'
import NameMark from '@/components/pages/Home/NameMark'
import { FOOTER } from '@/data/footer'
import { HERO } from '@/data/hero'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'
import { footerPath } from '@/logic/footerShape/footerShape'

// Jeu autour du téléphone dans l'encoche, et arrondis du contour (coins, fond du U, épaules).
const NOTCH_GAP = 16
const CORNER_RADIUS = 28
const NOTCH_RADIUS = 24
const SHOULDER_RADIUS = 16

type Size = { width: number; height: number }

/* Footer (réf. cosmoq.framer.website) : carte noire bordée, avec en haut une encoche en U qui épouse exactement
   l'appel entrant (ou la carte de réservation une fois ouverte), puis accroche, nom géant, liens et copyright. */
export default function Footer() {
  const { locale } = useLocale()
  const copy = FOOTER[locale]
  const cardRef = useRef<HTMLDivElement>(null)
  const callRef = useRef<HTMLDivElement>(null)
  const [card, setCard] = useState<Size>({ width: 0, height: 0 })
  const [call, setCall] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const observe = (element: HTMLElement | null, setSize: (size: Size) => void) => {
      if (!element) return undefined
      const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.target.getBoundingClientRect()
        setSize({ width, height })
      })
      observer.observe(element)
      return observer
    }
    const observers = [observe(cardRef.current, setCard), observe(callRef.current, setCall)]
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [])

  const notchWidth = call.width + NOTCH_GAP * 2
  const notchDepth = call.height + NOTCH_GAP
  const isMeasured = card.width > 0 && call.width > 0

  return (
    <footer id="contact" className="bg-white px-3 pt-12 pb-3 text-black min-[810px]:px-4 min-[810px]:pb-4 min-[1200px]:pt-20">
      <h2 className="mb-8 text-center font-heading text-[28px] leading-[1.2] font-normal tracking-[-0.02em] min-[810px]:mb-10 min-[810px]:text-[36px] min-[1200px]:text-[40px]">
        {copy.callTitle}
      </h2>
      <div ref={cardRef} className="relative mx-auto max-w-[1800px] text-white">
        {isMeasured && (
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
            <path
              d={footerPath({
                width: card.width,
                height: card.height,
                notchWidth,
                notchDepth,
                cornerRadius: CORNER_RADIUS,
                notchRadius: NOTCH_RADIUS,
                shoulderRadius: SHOULDER_RADIUS,
              })}
              className="fill-black stroke-(--color-gray-400)"
              strokeWidth={1.5}
            />
          </svg>
        )}
        {/* L'appel entrant, posé dans l'encoche : sa taille règle celle du U. */}
        <div className="relative z-10 flex justify-center text-black">
          <div ref={callRef}>
            <CallWidget />
          </div>
        </div>

        <div className="relative flex flex-col items-center px-5 pt-16 text-center min-[810px]:px-10 min-[810px]:pt-20">
          <h3 className="max-w-[760px] font-heading text-[36px] leading-[1.1] font-normal tracking-[-0.03em] min-[810px]:text-[56px]">
            {copy.heading}
          </h3>
          <p className="mt-5 max-w-[460px] font-sans text-[16px] leading-[1.5] font-normal text-white/60">{copy.subheading}</p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-8 inline-flex h-12 cursor-pointer items-center rounded-full border border-white/20 bg-white/10 px-6 font-sans text-[16px] font-medium text-white transition-colors duration-200 hover:bg-white hover:text-black"
          >
            {copy.ctaLabel}
          </a>
        </div>

        {/* Nom géant en dégradé avec un halo derrière, comme le mot lumineux de la réf. */}
        <div aria-hidden="true" className="relative mt-12 overflow-hidden px-5 min-[810px]:px-10">
          <div className="pointer-events-none absolute inset-x-[10%] top-1/3 h-1/2 rounded-[50%] bg-white/10 blur-3xl" />
          <NameMark name={HERO[locale].name} className="bg-linear-to-b from-white to-white/10 bg-clip-text text-transparent" />
        </div>

        <div className="relative grid grid-cols-2 gap-x-6 gap-y-10 px-5 pt-12 pb-12 min-[810px]:grid-cols-4 min-[810px]:px-10">
          {copy.columns.map((column) => (
            <FooterLinkColumn key={column.title} column={column} />
          ))}
        </div>

        <div className="relative flex flex-col gap-2 border-t border-white/10 px-5 py-6 font-sans text-[14px] text-white/50 min-[810px]:flex-row min-[810px]:justify-between min-[810px]:px-10">
          <p>{copy.copyright}</p>
          <p>{copy.credit}</p>
        </div>
      </div>
    </footer>
  )
}

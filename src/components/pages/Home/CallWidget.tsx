import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Phone, X } from 'lucide-react'
import { useLocale } from '@/lib/LocaleProvider'
import CallBooking from '@/components/pages/Home/CallBooking'
import { CALL_WIDGET } from '@/data/about'
import { isCallSilenced, markCallSilenced } from '@/lib/callRingSession'
import '@/components/pages/Home/About.css'

gsap.registerPlugin(useGSAP)

// 3 secousses horizontales par sonnerie, une sonnerie toutes les ~6 s.
const RING_SHAKES = 3
const RING_SHAKE_X = [0, -4, 4, -4, 4, -2, 2, 0]
const RING_PERIOD_REPEAT_DELAY = 2.9

/* Widget « appel entrant » (réf. abhijitrout.in) : refuser replie la pastille sur l'avatar, répondre déplie le formulaire. */
export default function CallWidget() {
  const { locale } = useLocale()
  const callWidget = CALL_WIDGET[locale]
  const pillRef = useRef<HTMLDivElement>(null)
  const collapseTlRef = useRef<gsap.core.Timeline | null>(null)
  const ringLoopRef = useRef<gsap.core.Timeline | null>(null)
  const [isClosed, setIsClosed] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useGSAP(
    () => {
      const pill = pillRef.current!

      const collapsedWidth = () => {
        const avatar = pill.querySelector<HTMLElement>('.about__call-avatar')!
        const pillStyle = getComputedStyle(pill)
        return avatar.offsetWidth + parseFloat(pillStyle.paddingLeft) + parseFloat(pillStyle.paddingRight)
      }

      collapseTlRef.current = gsap
        .timeline({ paused: true })
        .to('.about__call-text, .about__call-btn', {
          autoAlpha: 0,
          x: 18,
          duration: 0.25,
          ease: 'power2.in',
          stagger: 0.05,
        })
        .to(pill, { width: collapsedWidth, duration: 0.45, ease: 'power3.inOut' }, '-=0.05')

      // Les 3 points « tapent » à la place du nom, puis la pastille vibre 3 fois, jusqu'au 1er clic de la visite.
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isCallSilenced()) {
        const ring = gsap
          .timeline({ repeat: -1, repeatDelay: RING_PERIOD_REPEAT_DELAY, delay: 1.6 })
          .to('.about__call-hey, .about__call-name', { autoAlpha: 0.12, duration: 0.25 }, 0)
          .to('.about__call-dots', { autoAlpha: 1, duration: 0.25 }, 0)
          .to({}, { duration: 1.0 })
          .to('.about__call-dots', { autoAlpha: 0, duration: 0.2 })
          .to('.about__call-hey, .about__call-name', { autoAlpha: 1, duration: 0.25 }, '<')
        for (let i = 0; i < RING_SHAKES; i++) {
          ring.to(pill, { keyframes: { x: RING_SHAKE_X }, duration: 0.32, ease: 'none' }, i === 0 ? '>+0.15' : '>+0.16')
        }
        ringLoopRef.current = ring
      }
    },
    { scope: pillRef },
  )

  // Le 1er clic sur le widget, quel que soit le bouton, coupe la sonnerie pour le reste de la visite.
  const silenceRing = () => {
    if (!ringLoopRef.current) return
    markCallSilenced()
    ringLoopRef.current.pause(0).kill()
    ringLoopRef.current = null
  }

  const close = () => {
    setIsClosed(true)
    setIsFormOpen(false)
    collapseTlRef.current?.play()
  }

  const reopen = () => {
    if (!isClosed) return
    setIsClosed(false)
    collapseTlRef.current?.reverse()
  }

  const openBooking = () => setIsFormOpen(true)

  return (
    <>
    {isFormOpen && <CallBooking onClose={() => setIsFormOpen(false)} />}
    {/* La pastille reste montée (timelines GSAP liées à son DOM), masquée tant que la carte est ouverte. */}
    <div
      className={`about__call${isClosed ? ' about__call--closed' : ''}`}
      style={isFormOpen ? { display: 'none' } : undefined}
      ref={pillRef}
      onClickCapture={silenceRing}
    >
      <div className="about__call-head">
        <button
          type="button"
          className="about__call-avatar"
          onClick={reopen}
          aria-label={isClosed ? callWidget.ariaReopen : 'Ikhlas'}
        >
          {callWidget.initials}
        </button>
        <span className="about__call-text">
          <span className="about__call-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="about__call-hey">{callWidget.greeting}</span>
          <span className="about__call-name">{callWidget.name}</span>
        </span>
        <button
          type="button"
          className="about__call-btn about__call-btn--decline"
          aria-label={callWidget.ariaDecline}
          onClick={close}
        >
          <X size={20} strokeWidth={2.4} aria-hidden="true" className="text-[var(--color-white)]" />
        </button>
        <button
          type="button"
          className="about__call-btn about__call-btn--accept"
          aria-label={callWidget.ariaAccept}
          aria-expanded={isFormOpen}
          onClick={openBooking}
        >
          {/* Combiné orienté vers le bas, comme la référence */}
          <Phone size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" className="text-[var(--color-white)]" style={{ transform: 'rotate(135deg)' }} />
        </button>
      </div>
    </div>
    </>
  )
}

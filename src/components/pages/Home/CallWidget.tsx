import { useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Phone, X } from 'lucide-react'
import { useLocale } from '@/lib/LocaleProvider'
import { CALL_WIDGET } from '@/data/about'
import { sendContactMessage } from '@/lib/api/contact'
import { isCallSilenced, markCallSilenced } from '@/lib/callRingSession'
import '@/components/pages/Home/About.css'

gsap.registerPlugin(useGSAP)

type SendState = 'idle' | 'sending' | 'sent' | 'error'

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
  const panelTlRef = useRef<gsap.core.Timeline | null>(null)
  const ringLoopRef = useRef<gsap.core.Timeline | null>(null)
  const [isClosed, setIsClosed] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [sendState, setSendState] = useState<SendState>('idle')

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

      panelTlRef.current = gsap
        .timeline({ paused: true })
        .to(pill, { borderRadius: 26, duration: 0.35, ease: 'power3.inOut' }, 0)
        .fromTo(
          '.about__call-panel',
          { height: 0, autoAlpha: 0 },
          { height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power3.inOut' },
          0,
        )
        .from(
          '.about__call-panel-in > *',
          { y: 14, autoAlpha: 0, duration: 0.3, ease: 'power2.out', stagger: 0.06 },
          0.18,
        )
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
    panelTlRef.current?.reverse()
    collapseTlRef.current?.play()
  }

  const reopen = () => {
    if (!isClosed) return
    setIsClosed(false)
    collapseTlRef.current?.reverse()
  }

  const toggleForm = () => {
    const willOpen = !isFormOpen
    setIsFormOpen(willOpen)
    if (willOpen) {
      setSendState('idle')
      panelTlRef.current?.play()
    } else {
      panelTlRef.current?.reverse()
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sendState === 'sending') return
    const form = e.currentTarget
    const formData = new FormData(form)
    setSendState('sending')
    try {
      await sendContactMessage(String(formData.get('email')), String(formData.get('message')))
      setSendState('sent')
      form.reset()
    } catch {
      setSendState('error')
    }
  }

  return (
    <div
      className={`about__call${isClosed ? ' about__call--closed' : ''}${isFormOpen ? ' is-form-open' : ''}`}
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
          onClick={toggleForm}
        >
          {/* Combiné orienté vers le bas, comme la référence */}
          <Phone size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" className="text-[var(--color-white)]" style={{ transform: 'rotate(135deg)' }} />
        </button>
      </div>

      <form className="about__call-panel" onSubmit={handleSubmit}>
        <div className="about__call-panel-in">
          <label className="about__call-field">
            <span className="about__call-field-label">{callWidget.emailLabel}</span>
            <input type="email" name="email" required placeholder={callWidget.emailPlaceholder} />
          </label>
          <label className="about__call-field">
            <span className="about__call-field-label">{callWidget.messageLabel}</span>
            <input type="text" name="message" required placeholder={callWidget.messagePlaceholder} />
          </label>
          <button type="submit" className="about__call-send" disabled={sendState === 'sending'}>
            {callWidget.sendLabels[sendState]}
          </button>
          <button
            type="button"
            className="about__call-panel-close"
            aria-label={callWidget.ariaCloseForm}
            onClick={toggleForm}
          >
            <X size={14} strokeWidth={2.4} aria-hidden="true" className="text-[var(--color-white)]" />
          </button>
        </div>
      </form>
    </div>
  )
}

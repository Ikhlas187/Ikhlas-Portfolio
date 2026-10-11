import { useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Phone, X } from 'lucide-react'
import { CALL_WIDGET } from '@/data/about'
import { sendContactMessage } from '@/lib/api/contact'

gsap.registerPlugin(useGSAP)

type SendState = 'idle' | 'sending' | 'sent' | 'error'

const RING_BACK_DELAY_MS = 8000

/* Widget « appel entrant » (réf. abhijitrout.in) : refuser replie la pastille sur l'avatar, répondre déplie le formulaire. */
export default function CallWidget() {
  const pillRef = useRef<HTMLDivElement>(null)
  const collapseTlRef = useRef<gsap.core.Timeline | null>(null)
  const panelTlRef = useRef<gsap.core.Timeline | null>(null)
  const ringLoopRef = useRef<gsap.core.Timeline | null>(null)
  const ringBackRef = useRef<(() => void) | null>(null)
  const ringTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [isClosed, setIsClosed] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [sendState, setSendState] = useState<SendState>('idle')

  useGSAP(
    (_context, contextSafe) => {
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

      ringBackRef.current = contextSafe!(() => {
        gsap
          .timeline()
          .to(pill, { rotation: 2.2, duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' })
          .to(pill, { rotation: 0, duration: 0.1 })
      })

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Les 3 points « tapent » à la place du nom, puis la pastille sonne, en boucle.
        ringLoopRef.current = gsap
          .timeline({ repeat: -1, repeatDelay: 3.4, delay: 1.6 })
          .to('.about__call-hey, .about__call-name', { autoAlpha: 0.12, duration: 0.25 }, 0)
          .to('.about__call-dots', { autoAlpha: 1, duration: 0.25 }, 0)
          .to({}, { duration: 1.0 })
          .to('.about__call-dots', { autoAlpha: 0, duration: 0.2 })
          .to('.about__call-hey, .about__call-name', { autoAlpha: 1, duration: 0.25 }, '<')
          .to(pill, { rotation: 2, duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '>+0.15')
          .to(pill, { rotation: 0, duration: 0.08 })
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

      return () => clearTimeout(ringTimer.current)
    },
    { scope: pillRef },
  )

  const close = () => {
    setIsClosed(true)
    setIsFormOpen(false)
    panelTlRef.current?.reverse()
    ringLoopRef.current?.pause(0)
    collapseTlRef.current?.play()
    clearTimeout(ringTimer.current)
    ringTimer.current = setTimeout(() => ringBackRef.current?.(), RING_BACK_DELAY_MS)
  }

  const reopen = () => {
    if (!isClosed) return
    clearTimeout(ringTimer.current)
    setIsClosed(false)
    collapseTlRef.current?.reverse()
    ringLoopRef.current?.play()
  }

  const toggleForm = () => {
    const willOpen = !isFormOpen
    setIsFormOpen(willOpen)
    if (willOpen) {
      setSendState('idle')
      ringLoopRef.current?.pause(0)
      panelTlRef.current?.play()
    } else {
      panelTlRef.current?.reverse()
      ringLoopRef.current?.play()
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
    >
      <div className="about__call-head">
        <button
          type="button"
          className="about__call-avatar"
          onClick={reopen}
          aria-label={isClosed ? CALL_WIDGET.ariaReopen : 'Ikhlas'}
        >
          {CALL_WIDGET.initials}
        </button>
        <span className="about__call-text">
          <span className="about__call-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="about__call-hey">{CALL_WIDGET.greeting}</span>
          <span className="about__call-name">{CALL_WIDGET.name}</span>
        </span>
        <button
          type="button"
          className="about__call-btn about__call-btn--decline"
          aria-label={CALL_WIDGET.ariaDecline}
          onClick={close}
        >
          <X size={20} color="#fff" strokeWidth={2.4} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="about__call-btn about__call-btn--accept"
          aria-label={CALL_WIDGET.ariaAccept}
          aria-expanded={isFormOpen}
          onClick={toggleForm}
        >
          {/* Combiné orienté vers le bas, comme la référence */}
          <Phone size={20} fill="#fff" strokeWidth={0} aria-hidden="true" style={{ transform: 'rotate(135deg)' }} />
        </button>
      </div>

      <form className="about__call-panel" onSubmit={handleSubmit}>
        <div className="about__call-panel-in">
          <label className="about__call-field">
            <span className="about__call-field-label">{CALL_WIDGET.emailLabel}</span>
            <input type="email" name="email" required placeholder={CALL_WIDGET.emailPlaceholder} />
          </label>
          <label className="about__call-field">
            <span className="about__call-field-label">{CALL_WIDGET.messageLabel}</span>
            <input type="text" name="message" required placeholder={CALL_WIDGET.messagePlaceholder} />
          </label>
          <button type="submit" className="about__call-send" disabled={sendState === 'sending'}>
            {CALL_WIDGET.sendLabels[sendState]}
          </button>
          <button
            type="button"
            className="about__call-panel-close"
            aria-label={CALL_WIDGET.ariaCloseForm}
            onClick={toggleForm}
          >
            <X size={14} color="#fff" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  )
}

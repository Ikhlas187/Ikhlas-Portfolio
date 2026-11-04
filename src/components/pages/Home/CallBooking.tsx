import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import BookingCalendar, { type BookingSlot } from '@/components/pages/Home/BookingCalendar'
import { Button } from '@/components/ui/button'
import { CALL_WIDGET } from '@/data/about'
import { sendContactMessage } from '@/lib/api/contact'
import { useLocale } from '@/lib/LocaleProvider'
import { callRequestMessage } from '@/logic/booking/callRequest/callRequest'

type CallBookingProps = {
  onClose: () => void
}

type SendState = 'idle' | 'sending' | 'sent' | 'error'

const FIELD =
  'w-full rounded-[8px] border border-black/15 bg-transparent px-3 py-2.5 font-sans text-[14px] text-black outline-none placeholder:text-black/45 focus-visible:border-black'

/* Carte qui remplace l'appel entrant : calendrier du footer, email, message et bouton Appeler. */
export default function CallBooking({ onClose }: CallBookingProps) {
  const { locale } = useLocale()
  const copy = CALL_WIDGET[locale]
  const [slot, setSlot] = useState<BookingSlot | null>(null)
  const [sendState, setSendState] = useState<SendState>('idle')

  const selectSlot = (nextSlot: BookingSlot | null) => {
    setSlot(nextSlot)
    if (nextSlot) setSendState('idle')
  }

  const buttonLabel = sendState === 'sent' || slot ? copy.sendLabels[sendState] : copy.pickSlotHint

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!slot || sendState === 'sending') return
    const form = event.currentTarget
    const formData = new FormData(form)
    setSendState('sending')
    try {
      const message = callRequestMessage(copy.callRequest, slot.date, slot.time, String(formData.get('message')))
      await sendContactMessage(String(formData.get('email')), message)
      setSendState('sent')
      form.reset()
      setSlot(null)
    } catch {
      setSendState('error')
    }
  }

  return (
    <div className="flex w-[400px] max-w-full flex-col overflow-hidden rounded-[8px] bg-white text-black shadow-(--note-form-shadow) min-[810px]:w-[800px] min-[810px]:flex-row">
      <BookingCalendar
        selectedSlot={slot}
        onSlotSelect={selectSlot}
        className="h-auto shrink-0 rounded-none min-[810px]:w-[400px]"
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 border-t border-black/10 px-5 pt-4 pb-5 min-[810px]:flex-1 min-[810px]:border-t-0 min-[810px]:border-l min-[810px]:pt-5">
        <label className="flex flex-col gap-1.5 text-[12px] text-black/60">
          {copy.emailLabel}
          <input type="email" name="email" required placeholder={copy.emailPlaceholder} className={FIELD} />
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] text-black/60 min-[810px]:flex-1">
          {copy.messageLabel}
          <textarea name="message" rows={3} placeholder={copy.messagePlaceholder} className={`${FIELD} resize-none min-[810px]:flex-1`} />
        </label>
        <div className="mt-auto flex items-center gap-3">
          <Button
            type="submit"
            disabled={!slot || sendState === 'sending'}
            className="h-11 flex-1 rounded-full bg-(--color-call-accept) text-[15px] font-medium text-white hover:bg-(--color-call-accept)/90"
          >
            {buttonLabel}
          </Button>
          {/* Bouton raccrocher, comme le rouge de l'appel entrant : revient à la pastille. */}
          <button
            type="button"
            aria-label={copy.ariaCloseForm}
            onClick={onClose}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--color-call-decline) text-white"
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  )
}

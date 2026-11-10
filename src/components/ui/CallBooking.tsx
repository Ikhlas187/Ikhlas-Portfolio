import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { X } from 'lucide-react'
import { CALL_WIDGET } from '@/data/about'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'

type CallBookingProps = {
  onClose: () => void
}

/* Carte qui remplace l'appel entrant : réservation Cal.com (Google Meet, agendas et mails gérés par Cal.com). */
export default function CallBooking({ onClose }: CallBookingProps) {
  const { locale } = useLocale()
  const copy = CALL_WIDGET[locale]

  useEffect(() => {
    void getCalApi().then((cal) => cal('ui', { hideEventTypeDetails: false, layout: 'month_view' }))
  }, [])

  return (
    <div className="relative w-[400px] max-w-full overflow-hidden rounded-[8px] bg-white text-black shadow-(--note-form-shadow) min-[810px]:w-[800px]">
      <button
        type="button"
        aria-label={copy.ariaCloseForm}
        onClick={onClose}
        className="absolute right-4 bottom-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-(--color-call-decline) text-white"
      >
        <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
      </button>
      <Cal
        calLink={SITE.calLink}
        config={{ layout: 'month_view', theme: 'light' }}
        className="h-[586px] w-full overflow-y-auto"
      />
    </div>
  )
}

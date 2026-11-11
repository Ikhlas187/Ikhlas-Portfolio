import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { X } from 'lucide-react'
import { CALL_WIDGET } from '@/data/about'
import { SITE } from '@/data/site'
import { useLocale } from '@/lib/LocaleProvider'
import { Button } from '@/components/ui/button'

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
    <div className="relative w-full overflow-hidden rounded-[8px] bg-white text-black shadow-(--note-form-shadow)">
      <Button
        variant="plain"
        aria-label={copy.ariaCloseForm}
        onClick={onClose}
        className="absolute right-4 bottom-4 z-10 size-10 rounded-full bg-(--color-call-decline) text-white"
      >
        <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
      </Button>
      <Cal
        calLink={SITE.calLink}
        config={{ layout: 'month_view', theme: 'light' }}
        className="h-[586px] w-full overflow-y-auto"
      />
    </div>
  )
}

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cal, { getCalApi } from '@calcom/embed-react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CALL_WIDGET } from '@/data/about'
import { SITE } from '@/data/site'
import { useLenis } from '@/lib/LenisProvider'
import { useLocale } from '@/lib/LocaleProvider'

/* Prise de rendez-vous sur mobile, ouverte par le bouton vert de l'appel : flèche de retour en haut, calendrier Cal.com dessous. */
export default function BookingPage() {
  const { locale } = useLocale()
  const copy = CALL_WIDGET[locale]
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'
  const lenis = useLenis()

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    void getCalApi().then((cal) => cal('ui', { hideEventTypeDetails: false, layout: 'month_view' }))
  }, [lenis])

  // Retour au footer de la page d'où vient le visiteur (la home si on arrive directement par l'URL).
  const goBack = () => navigate(`${from}#contact`, { replace: true })

  return (
    <div className="min-h-svh bg-white text-black">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-3 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          aria-label={copy.ariaBack}
          className="size-11 rounded-full text-black bg-[color-mix(in_srgb,var(--color-black)_6%,var(--color-white))] hover:bg-[color-mix(in_srgb,var(--color-black)_12%,var(--color-white))]"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Button>
        <h1 className="font-heading text-[22px] leading-[1.2] font-normal tracking-[-0.02em]">{copy.bookingTitle}</h1>
      </header>
      <Cal calLink={SITE.calLink} config={{ layout: 'month_view', theme: 'light' }} className="min-h-[calc(100svh-76px)] w-full" />
    </div>
  )
}

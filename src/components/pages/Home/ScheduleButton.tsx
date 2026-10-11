import { ArrowUpRight } from 'lucide-react'
import { SCHEDULE_BUTTON } from '@/data/home'
import { SITE } from '@/data/site'
import '@/components/pages/Home/ScheduleButton.css'

type ScheduleButtonProps = {
  href?: string
  label?: string
}

/* CTA pill (réf. verteal.com) : au survol, le libellé glisse entre ses 2 copies. Mène à l'email d'Ikhlas. */
export default function ScheduleButton({
  href = `mailto:${SITE.email}`,
  label = SCHEDULE_BUTTON.label,
}: ScheduleButtonProps) {
  return (
    <a className="vt-btn" href={href}>
      <span className="vt-btn__pill">
        <span className="vt-btn__label">
          <span className="vt-btn__line">{label}</span>
          <span className="vt-btn__line" aria-hidden="true">
            {label}
          </span>
        </span>
      </span>
      <span className="vt-btn__icon" aria-hidden="true">
        <ArrowUpRight size={16} color="#FF4D2E" strokeWidth={1.6} strokeLinecap="square" />
      </span>
    </a>
  )
}

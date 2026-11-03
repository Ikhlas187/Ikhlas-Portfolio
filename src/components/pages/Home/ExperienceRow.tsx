import type { ExperienceItem } from '@/data/experience'
import type { Locale } from '@/data/locale'
import { formatExperiencePeriod } from '@/logic/experiencePeriod/experiencePeriod'

type ExperienceRowProps = {
  item: ExperienceItem
  locale: Locale
}

const ROW_TEXT = 'font-sans text-[20px] leading-[1.2] font-medium tracking-[-0.04em]'

// Réalisations absentes de la réf. : placées sous la ligne pour ne pas écraser la colonne gauche sur mobile.
export default function ExperienceRow({ item, locale }: ExperienceRowProps) {
  return (
    <li className="flex w-full flex-col gap-2 overflow-clip border-b border-black py-[13px]">
      <div className="flex w-full items-start gap-[6px]">
        <div className="w-px flex-1 break-words whitespace-pre-wrap">
          <h3 className={ROW_TEXT}>{item.company}</h3>
          <p className={ROW_TEXT}>{item.role}</p>
        </div>
        <p className={`${ROW_TEXT} shrink-0 whitespace-pre`}>{formatExperiencePeriod(item.period, locale)}</p>
      </div>
      <ul className="flex max-w-[640px] flex-col gap-1 font-sans text-[16px] leading-[1.4] tracking-[-0.01em] text-black/60">
        {item.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </li>
  )
}

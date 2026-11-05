import type { ExperienceItem } from '@/data/experience'
import type { Locale } from '@/data/locale'
import { formatExperiencePeriod } from '@/logic/experiencePeriod/experiencePeriod'

type ExperienceRowProps = {
  item: ExperienceItem
  locale: Locale
  presentLabel: string
}

const ROW_TEXT = 'font-sans text-[20px] leading-[1.2] font-medium tracking-[-0.04em]'

export default function ExperienceRow({ item, locale, presentLabel }: ExperienceRowProps) {
  return (
    <li className="flex w-full flex-col overflow-clip border-b border-black pt-[13px] pb-[12px]">
      <div className="flex w-full items-start gap-[6px]">
        <div className="w-px flex-1 break-words whitespace-pre-wrap">
          <h3 className={ROW_TEXT}>{item.company}</h3>
          <p className={ROW_TEXT}>{item.role}</p>
        </div>
        <p className={`${ROW_TEXT} shrink-0 whitespace-pre`}>{formatExperiencePeriod(item.period, locale, presentLabel)}</p>
      </div>
    </li>
  )
}

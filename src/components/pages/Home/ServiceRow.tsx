import type { CSSProperties } from 'react'
import FadeInImage from '@/components/pages/Home/FadeInImage'
import { TOOL_LOGOS } from '@/components/pages/Home/toolLogos'
import type { Service, ToolId } from '@/data/services'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type ServiceRowProps = {
  service: Service
  toolsLabel: string
  toolNames: Record<ToolId, string>
  stickyTop: number
}

const PHOTO_WIDTH = 640
const ROW_HEADING = 'font-sans text-[26px] leading-[1.15] font-medium tracking-[-0.04em] min-[810px]:text-[32px]'
const TOOL_ITEM = 'border-t border-black/20 py-2 font-sans text-[18px] leading-[1.5] tracking-[-0.02em]'

/* Une rangée de la pile de services (réf. oddlymade.webflow.io) : collée en haut, 64 px sous la précédente. */
export default function ServiceRow({ service, toolsLabel, toolNames, stickyTop }: ServiceRowProps) {
  return (
    <article
      style={{ '--row-top': `${stickyTop}px` } as CSSProperties}
      className="grid grid-cols-1 gap-6 border-t border-black/20 bg-white pt-6 pb-10 min-[810px]:sticky min-[810px]:top-(--row-top) min-[810px]:grid-cols-[286fr_906fr] min-[810px]:pb-0"
    >
      <FadeInImage
        src={unsplashPhotoUrl(service.photo, PHOTO_WIDTH)}
        alt={service.alt}
        loading="lazy"
        className="h-[260px] w-full object-cover min-[810px]:h-[329px]"
      />
      <div className="grid grid-cols-1 gap-4 min-[810px]:grid-cols-[194fr_388fr_291fr]">
        <p className={ROW_HEADING}>{service.num}</p>
        <div className="flex flex-col gap-4">
          <h3 className={ROW_HEADING}>{service.title}</h3>
          <p className="max-w-[360px] font-sans text-[16px] leading-[1.5] font-normal text-black/60">{service.desc}</p>
        </div>
        {/* Téléphone (réf. haufsess.com, section Tools) : titre et trait, logos fixes, trait de fin. */}
        <div className="flex flex-col gap-6 min-[810px]:hidden">
          <div className="flex items-center gap-2">
            <p className="shrink-0 font-heading text-[28px] leading-[1.2] font-normal tracking-[-0.02em]">{toolsLabel}</p>
            <span aria-hidden="true" className="h-[2px] flex-1 bg-black" />
          </div>
          <ul className="grid grid-cols-5 gap-4 border-b-2 border-black pb-6">
            {service.tools.map((tool) => {
              const Logo = TOOL_LOGOS[tool]
              return (
                <li key={tool} className="flex aspect-square items-center justify-center">
                  <Logo role="img" aria-label={toolNames[tool]} strokeWidth={1.5} className="size-full text-black" />
                </li>
              )
            })}
          </ul>
        </div>
        <ul className="hidden flex-col border-b border-black/20 min-[810px]:flex">
          <li className="py-2 font-sans text-[18px] leading-[1.5] font-medium tracking-[-0.02em]">{toolsLabel}</li>
          {service.tools.map((tool) => (
            <li key={tool} className={TOOL_ITEM}>
              {toolNames[tool]}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

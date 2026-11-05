import ServiceRow from '@/components/pages/Home/ServiceRow'
import { SERVICES, SERVICES_SECTION } from '@/data/services'
import { useLocale } from '@/lib/LocaleProvider'

// Pile collée en haut (réf. oddlymade.webflow.io) : titre à 64 px, 1re rangée à 224 px, chaque suivante 64 px plus bas.
const HEADER_TOP = 64
const HEADER_HEIGHT = 160
const ROW_STEP = 64

/* Section services : chaque rangée reste collée sous la précédente en ne laissant voir que sa ligne de titre. */
export default function Services() {
  const { locale } = useLocale()
  const section = SERVICES_SECTION[locale]

  return (
    <section id="services" className="bg-white px-3 pt-(--section-gap) pb-12 text-black min-[810px]:px-4 min-[1200px]:px-8 min-[1200px]:pb-20">
      <div className="mx-auto max-w-[1800px]">
        <div className="pb-8 min-[810px]:sticky min-[810px]:top-16 min-[810px]:h-[160px] min-[810px]:pb-0">
          <h2 className="font-heading text-[28px] leading-[1.2] font-normal tracking-[-0.02em] min-[810px]:text-[36px] min-[1200px]:text-[40px]">
            {section.title}
          </h2>
        </div>
        {SERVICES[locale].map((service, index) => (
          <ServiceRow
            key={service.num}
            service={service}
            toolsLabel={section.toolsLabel}
            stickyTop={HEADER_TOP + HEADER_HEIGHT + index * ROW_STEP}
          />
        ))}
        {/* 256 px sous la pile, comme la réf. : un bloc et pas un padding, sinon les rangées collées s'arrêtent avant. */}
        <div aria-hidden="true" className="hidden min-[810px]:block min-[810px]:h-64" />
      </div>
    </section>
  )
}

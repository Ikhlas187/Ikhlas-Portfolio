import SectionHeading from '@/components/pages/Home/SectionHeading'
import ExperienceRow from '@/components/pages/Home/ExperienceRow'
import { EXPERIENCE } from '@/data/experience'
import { useLocale } from '@/lib/LocaleProvider'

/* Section « Experiences » de la réf. haufsess.com : titre à trait, liste sur les 3/5 droits. Paliers 810 et 1200 de la réf. */
export default function Experience() {
  const { locale } = useLocale()
  const experience = EXPERIENCE[locale]

  return (
    <section id="experience" className="bg-white text-black">
      <div className="mx-auto flex max-w-[1800px] flex-col items-center gap-8 px-3 pt-(--section-gap) min-[810px]:gap-12 min-[810px]:px-4 min-[1200px]:gap-14 min-[1200px]:px-5">
        <SectionHeading title={experience.title} />
        <div className="flex w-full flex-col items-start gap-4 overflow-clip min-[810px]:gap-0 min-[1200px]:flex-row">
          <div aria-hidden className="hidden min-[1200px]:block min-[1200px]:w-px min-[1200px]:flex-1" />
          <ul className="flex w-full flex-col items-start gap-1 min-[1200px]:w-px min-[1200px]:flex-[1.5_0_0]">
            {experience.items.map((item) => (
              <ExperienceRow key={item.company} item={item} locale={locale} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

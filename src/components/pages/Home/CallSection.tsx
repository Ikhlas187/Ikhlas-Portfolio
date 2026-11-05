import CallWidget from '@/components/pages/Home/CallWidget'
import { CALL_WIDGET } from '@/data/about'
import { useLocale } from '@/lib/LocaleProvider'

// Widget d'appel entrant en fin de home, sous les notes, avec de grandes marges autour.
export default function CallSection() {
  const { locale } = useLocale()

  return (
    <section className="bg-white px-3 py-24 text-black min-[810px]:px-4 min-[1200px]:px-5 min-[1200px]:py-40">
      <div className="mx-auto flex max-w-[1800px] flex-col items-center gap-8 min-[810px]:gap-10">
        <h2 className="text-center font-heading text-[28px] leading-[1.2] font-normal tracking-[-0.02em] min-[810px]:text-[36px] min-[1200px]:text-[40px]">
          {CALL_WIDGET[locale].title}
        </h2>
        <CallWidget />
      </div>
    </section>
  )
}

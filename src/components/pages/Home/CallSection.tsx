import CallWidget from '@/components/pages/Home/CallWidget'

// Widget d'appel entrant en fin de home, sous les notes, avec de grandes marges autour.
export default function CallSection() {
  return (
    <section className="bg-white px-3 py-24 text-black min-[810px]:px-4 min-[1200px]:px-5 min-[1200px]:py-40">
      <div className="mx-auto flex max-w-[1800px] justify-center">
        <CallWidget />
      </div>
    </section>
  )
}

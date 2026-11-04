import CallWidget from '@/components/pages/Home/CallWidget'

// Widget d'appel entrant en fin de home, sous les notes : l'espace du haut vient déjà du padding bas de PinNote.
export default function CallSection() {
  return (
    <section className="bg-white px-3 pb-(--section-gap) text-black min-[810px]:px-4 min-[1200px]:px-5">
      <div className="mx-auto flex max-w-[1800px] justify-center">
        <CallWidget />
      </div>
    </section>
  )
}

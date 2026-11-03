import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NoteForm from '@/components/pages/Home/NoteForm'
import RollingLabel from '@/components/pages/Home/RollingLabel'
import StickyNote from '@/components/pages/Home/StickyNote'
import { NOTES_SECTION, WELCOME_NOTES } from '@/data/notes'
import { useLocale } from '@/lib/LocaleProvider'
import { localNotesStore } from '@/lib/notesStore'
import { cn } from '@/lib/utils'
import { createPinnedNote, type NoteDraft } from '@/logic/notes/draft/draft'
import { hasMoreNotes, visibleNotes, type NotesLayout } from '@/logic/notes/page/page'
import type { PinnedNote } from '@/types/note'

// 7 emplacements du tableau de la réf. (left/top en % du tableau), rotation en grille puis sur le tableau.
const BOARD_SLOTS = [
  'lg:left-[13.46%] lg:top-[9.5%] [--rg:-3deg] [--rd:6deg]',
  'lg:left-[82.16%] lg:top-[9.73%] [--rg:4deg] [--rd:4deg]',
  'lg:left-[32.16%] lg:top-[6.23%] [--rg:3deg] [--rd:-4deg]',
  'lg:left-[91.35%] lg:top-[29.5%] [--rg:-4deg] [--rd:-7deg]',
  'lg:left-[13.62%] lg:top-[58.41%] [--rg:-2deg] [--rd:-3deg]',
  'lg:left-[87.59%] lg:top-[65.7%] [--rg:3deg] [--rd:-5deg]',
  'lg:left-[52.34%] lg:top-[71.1%] [--rg:-3deg] [--rd:3deg]',
]
const UNDER_FORM_SLOT = 6
const NOTE_ROTATION = 'rotate-(--rg) lg:rotate-(--rd)'

const BOARD_QUERY = '(min-width: 1024px)'

function subscribeToBoardQuery(onChange: () => void) {
  const query = window.matchMedia(BOARD_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function readLayout(): NotesLayout {
  return window.matchMedia(BOARD_QUERY).matches ? 'board' : 'grid'
}

const INK_EASE = [0.16, 1, 0.3, 1] as const

export default function PinNote() {
  const { locale } = useLocale()
  const copy = NOTES_SECTION[locale]
  const layout = useSyncExternalStore(subscribeToBoardQuery, readLayout)
  const [visitorNotes, setVisitorNotes] = useState<PinnedNote[]>([])
  // Le nombre de clics sur « See more » ne vaut que pour la disposition où il a été fait.
  const [paging, setPaging] = useState({ layout, step: 0 })
  const step = paging.layout === layout ? paging.step : 0
  const [justPinnedId, setJustPinnedId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    localNotesStore.listNotes().then((notes) => {
      if (isMounted) setVisitorNotes(notes)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const allNotes = [...visitorNotes, ...WELCOME_NOTES[locale]]
  const shownNotes = visibleNotes(allNotes, step, layout)

  async function handlePin(draft: NoteDraft) {
    const note = createPinnedNote(draft, crypto.randomUUID(), new Date().toISOString())
    if (!note) return
    const savedNote = await localNotesStore.pinNote(note)
    setVisitorNotes((notes) => [savedNote, ...notes])
    setPaging({ layout, step: 0 })
    setJustPinnedId(savedNote.id)
  }

  return (
    <section id="notes" className="bg-white px-4 pt-[70px] pb-[70px] text-black sm:px-10 lg:px-20 lg:pt-[140px] lg:pb-[140px]">
      <div className="mx-auto max-w-[1280px]">
        {/* ============================================
            EN-TÊTE : accroche + titre + intro
            ============================================ */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="flex flex-col items-start gap-1">
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: 3 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: INK_EASE }}
              className="flex origin-left flex-col items-start gap-1"
            >
              <p className="text-[18px] font-medium text-gray-200 sm:text-[20px]">{copy.kicker}</p>
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.3, ease: INK_EASE }}
                className="block h-[2px] w-[70px] origin-left rounded-[1px] bg-gray-400"
              />
            </motion.div>
            <h2 className="font-heading text-[clamp(48px,6.67vw,96px)] leading-none font-medium tracking-[-0.03em] text-black uppercase">
              {/* L'observateur est sur le masque : le texte décalé hors du masque ne serait jamais vu « à l'écran ». */}
              <motion.span
                className="-mb-[0.06em] block overflow-hidden pb-[0.06em]"
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, margin: '-80px' }}
              >
                <motion.span
                  className="block"
                  variants={{ hidden: { y: '110%' }, shown: { y: '0%' } }}
                  transition={{ duration: 0.9, ease: INK_EASE }}
                >
                  {copy.title}
                </motion.span>
              </motion.span>
            </h2>
          </div>
          <p className="max-w-[420px] text-[16px] leading-[1.5] font-medium text-gray-400">{copy.intro}</p>
        </div>

        {/* ============================================
            TABLEAU : formulaire + notes épinglées
            ============================================ */}
        <div className="relative mt-8 rounded-[24px] bg-[color-mix(in_srgb,var(--color-black)_4%,var(--color-white))] bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-black)_11%,var(--color-white))_1.5px,transparent_1.6px)] bg-size-[32px_32px] bg-position-[5.5px_5.5px] p-4 sm:p-8 lg:mt-12 lg:h-[560px] lg:overflow-hidden lg:rounded-[32px] lg:p-0 xl:h-[600px] min-[1440px]:h-[640px]">
          <NoteForm onPin={handlePin} />
          <ul
            aria-label={copy.boardLabel}
            className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-14 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 lg:static lg:mt-0 lg:block"
          >
            {shownNotes.map((note, index) => (
              <motion.li
                key={note.id}
                initial={note.id === justPinnedId ? { opacity: 0, y: -48, scale: 1.12 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className={cn(
                  'lg:absolute lg:w-[164px] lg:-translate-x-1/2 xl:w-[189px] min-[1440px]:w-[210px]',
                  BOARD_SLOTS[index % BOARD_SLOTS.length],
                )}
              >
                <StickyNote
                  note={note}
                  anonymousLabel={copy.anonymous}
                  rotation={NOTE_ROTATION}
                  isUnderForm={index === UNDER_FORM_SLOT}
                />
              </motion.li>
            ))}
          </ul>
        </div>

        {hasMoreNotes(allNotes.length, step, layout) && (
          <div className="mt-2 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPaging({ layout, step: step + 1 })}
              className="h-auto rounded-full bg-white py-3.5 pr-5 pl-[22px] text-sm leading-[normal] font-medium text-gray-200 hover:bg-white hover:text-gray-200"
            >
              <RollingLabel>
                {copy.seeMoreLabel}
                <Eye aria-hidden="true" className="size-4" />
              </RollingLabel>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

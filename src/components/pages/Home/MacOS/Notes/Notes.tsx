import { useEffect, useState } from 'react'
import { ChevronRight, Folder, SquarePen } from 'lucide-react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import NotesBackButton from '@/components/pages/Home/MacOS/Notes/NotesBackButton'
import NotesCompose from '@/components/pages/Home/MacOS/Notes/NotesCompose'
import NotesList from '@/components/pages/Home/MacOS/Notes/NotesList'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { GIANT_SUR } from '@/data/giantSur'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { localNotesStore } from '@/lib/notesStore'
import {
  TESTIMONIALS_FOLDER,
  capitalize,
  entriesInFolder,
  folderNames,
  testimonialEntry,
} from '@/logic/macos/notesFolders/notesFolders'
import type { PinnedNote } from '@/types/note'

type NotesProps = { frame: WindowFrameProps }

// Copie de l'app Notes de frvky.online : dossiers, liste, note ouverte, nouveau témoignage.
export default function Notes({ frame }: NotesProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].notes
  const [openId, setOpenId] = useState<string | null>(null)
  const [folder, setFolder] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([])

  useEffect(() => {
    localNotesStore.listNotes().then(setPinnedNotes)
  }, [])

  const testimonials = pinnedNotes.map((note) =>
    testimonialEntry(note, { from: texts.testimonialFrom, anonymous: texts.anonymous }, GIANT_SUR[locale].intlLocale),
  )
  const openEntry = [...texts.entries, ...testimonials].find((entry) => entry.id === openId) ?? null
  const folderLabel = (name: string) => texts.folderNames[name] ?? capitalize(name)

  const renderContent = () => {
    if (isComposing) {
      return (
        <NotesCompose
          onCancel={() => setIsComposing(false)}
          onPosted={(note) => {
            setPinnedNotes((current) => [note, ...current])
            setIsComposing(false)
            setFolder(TESTIMONIALS_FOLDER)
            setOpenId(`testimonial-${note.id}`)
          }}
        />
      )
    }

    if (openEntry) {
      return (
        <div className="flex h-full flex-col bg-(--macos-notes-paper)">
          <div className="flex shrink-0 items-center border-b border-(--macos-app-line) px-[12px] py-[10px]">
            <NotesBackButton label={folder ? folderLabel(folder) : texts.title} onClick={() => setOpenId(null)} />
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-[20px] py-[16px]">
            <h2 className="mb-[12px] text-[19px] leading-snug font-semibold text-(--macos-app-ink)">{openEntry.title}</h2>
            <div className="space-y-[12px] text-[14px] leading-relaxed whitespace-pre-line text-(--macos-app-text) select-text">
              {openEntry.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (folder) {
      const isTestimonials = folder === TESTIMONIALS_FOLDER
      const entries = isTestimonials ? testimonials : entriesInFolder(texts.entries, folder)
      return (
        <div className="relative flex h-full flex-col bg-(--macos-notes-paper)">
          <div className="shrink-0 border-b border-(--macos-app-line) px-[12px] pt-[10px] pb-[12px]">
            <NotesBackButton label={texts.title} onClick={() => setFolder(null)} />
            <h1 className="mt-[4px] px-[4px] text-[22px] leading-normal font-bold text-(--macos-app-ink)">{folderLabel(folder)}</h1>
            {isTestimonials && <p className="px-[4px] text-[13px] text-(--macos-app-muted)">{texts.testimonialsHint}</p>}
          </div>
          {isTestimonials && entries.length === 0 ? (
            <p className="px-[24px] pt-[48px] text-center text-[14px] text-(--macos-app-muted)">{texts.testimonialsEmpty}</p>
          ) : (
            <NotesList entries={entries} onOpen={setOpenId} />
          )}
          {isTestimonials && (
            <button
              type="button"
              aria-label={texts.newTestimonial}
              onClick={() => setIsComposing(true)}
              className="absolute right-[20px] bottom-[20px] flex size-[48px] cursor-pointer items-center justify-center rounded-full bg-(--macos-notes-paper) text-(--macos-notes-pencil) shadow-(--macos-notes-fab-shadow)"
            >
              <SquarePen strokeWidth={1.9} className="size-[24px]" />
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="flex h-full flex-col bg-(--macos-notes-paper)">
        <div className="shrink-0 border-b border-(--macos-app-line) px-[16px] py-[12px]">
          <h1 className="text-[22px] leading-[33px] font-bold text-(--macos-app-ink)">{texts.title}</h1>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="px-[16px] pt-[12px] pb-[12px]">
            <div className="mb-[6px] text-[13px] font-semibold tracking-wide text-(--macos-app-muted) uppercase">
              {texts.folders}
            </div>
            <div className="overflow-hidden rounded-[12px] bg-(--macos-notes-group)">
              {folderNames(texts.entries).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFolder(name)}
                  className="flex w-full cursor-pointer items-center gap-[12px] border-b border-(--macos-app-line-soft) px-[12px] py-[10px] text-left last:border-b-0 hover:bg-(--macos-notes-hover)"
                >
                  <Folder strokeWidth={1.8} className="size-[22px] text-(--macos-notes-folder)" />
                  <span className="flex-1 text-[15px] text-(--macos-app-ink)">{folderLabel(name)}</span>
                  <span className="text-[14px] text-(--macos-app-muted)">
                    {name === TESTIMONIALS_FOLDER ? testimonials.length : entriesInFolder(texts.entries, name).length}
                  </span>
                  <ChevronRight strokeWidth={2.4} className="size-[16px] text-(--macos-notes-chevron)" />
                </button>
              ))}
            </div>
          </div>
          <NotesList entries={entriesInFolder(texts.entries, null)} onOpen={setOpenId} />
        </div>
      </div>
    )
  }

  return (
    <FinderWindow frame={frame} title={MACOS[locale].appNames.notes}>
      <div className="absolute inset-0 font-(family-name:--font-macos-app) [&_:is(h1,h2)]:font-(family-name:--font-macos-app) [&_:is(h1,h2)]:tracking-normal">{renderContent()}</div>
    </FinderWindow>
  )
}

import { useEffect, useMemo, useState } from 'react'
import NotesEditor from '@/components/pages/Home/MacOS/Notes/NotesEditor'
import NotesList from '@/components/pages/Home/MacOS/Notes/NotesList'
import NotesSidebar from '@/components/pages/Home/MacOS/Notes/NotesSidebar'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { readNotesChanges, saveNotesChanges } from '@/lib/notesBookStorage'
import { notesStore } from '@/lib/notesStore'
import {
  ALL_NOTES,
  DEFAULT_FOLDER,
  addFolder,
  applyNotesChanges,
  countInFolder,
  createNote,
  deleteNote,
  editNote,
  notesFolders,
  seedNotes,
  setNotePinned,
  testimonialNote,
  visibleNotes,
} from '@/logic/macos/notesBook/notesBook'
import type { PinnedNote } from '@/types/note'

type NotesProps = { frame: WindowFrameProps }

// Copie de l'app Notes de mihrimatrix/macos-clone-react (dossiers, liste, éditeur, recherche), remplie avec les notes d'Ikhlas.
export default function Notes({ frame }: NotesProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].notes
  const [openedAt] = useState(Date.now)
  const [changes, setChanges] = useState(readNotesChanges)
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([])
  const [folder, setFolder] = useState(ALL_NOTES)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    notesStore
      .listNotes()
      .then(setPinnedNotes)
      .catch(() => undefined)
  }, [])

  useEffect(() => saveNotesChanges(changes), [changes])

  const seeds = useMemo(
    () => [
      ...seedNotes(texts.entries, openedAt),
      ...pinnedNotes.map((note) => testimonialNote(note, { from: texts.testimonialFrom, anonymous: texts.anonymous })),
    ],
    [texts, openedAt, pinnedNotes],
  )
  const notes = applyNotesChanges(seeds, changes)
  const folders = notesFolders(seeds, changes)
  const visible = visibleNotes(notes, folder, query)
  const selected = notes.find((note) => note.id === selectedId) ?? visible[0]
  const labelOf = (name: string) => (name === ALL_NOTES ? texts.allNotes : (texts.folderNames[name] ?? name))

  const newNote = () => {
    const id = crypto.randomUUID()
    const target = folder === ALL_NOTES ? DEFAULT_FOLDER : folder
    setQuery('')
    setChanges((current) => createNote(current, { id, folder: target, body: '', isPinned: false, modifiedAt: Date.now() }))
    setSelectedId(id)
  }

  const removeSelected = () => {
    if (!selected) return
    setChanges((current) => deleteNote(current, selected.id))
    setSelectedId(visible.find((note) => note.id !== selected.id)?.id ?? null)
  }

  return (
    <Window {...frame} title={MACOS[locale].appNames.notes} hasToolbarRow={false} isSeeThrough>
      <div className="absolute inset-0 flex font-(family-name:--font-macos-frame) tracking-[-0.006em] text-(--macos-frame-fg) [&_:is(h1,h2,h3)]:font-(family-name:--font-macos-frame) [&_:is(h1,h2,h3)]:tracking-[-0.006em]">
        <NotesSidebar
          folders={[ALL_NOTES, ...folders].map((id) => ({ id, label: labelOf(id), count: countInFolder(notes, id) }))}
          active={folder}
          onSelect={setFolder}
          onAddFolder={(name) => setChanges((current) => addFolder(current, name, folders))}
        />
        <NotesList
          title={labelOf(folder)}
          notes={visible}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          onDelete={removeSelected}
        />
        <NotesEditor
          note={selected}
          query={query}
          onQueryChange={setQuery}
          onEdit={(body) => selected && setChanges((current) => editNote(current, selected.id, body, Date.now()))}
          onTogglePin={() => selected && setChanges((current) => setNotePinned(current, selected.id, !selected.isPinned))}
          onNewNote={newNote}
        />
      </div>
    </Window>
  )
}

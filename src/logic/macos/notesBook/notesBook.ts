import type { NotesEntry } from '@/data/macos'
import type { PinnedNote } from '@/types/note'

// Note de l'app Notes : la 1re ligne du corps sert de titre, comme dans macOS.
export type BookNote = { id: string; folder: string; body: string; isPinned: boolean; modifiedAt: number }

// Ce que le visiteur a changé, gardé à part des notes d'Ikhlas pour qu'elles suivent la langue du site.
export type NotesChanges = {
  created: BookNote[]
  edited: Record<string, { body: string; modifiedAt: number }>
  isPinnedById: Record<string, boolean>
  deletedIds: string[]
  folders: string[]
}

export const ALL_NOTES = '*'
export const DEFAULT_FOLDER = 'notes'
export const TESTIMONIALS_FOLDER = 'testimonials'
export const EMPTY_NOTES_CHANGES: NotesChanges = { created: [], edited: {}, isPinnedById: {}, deletedIds: [], folders: [] }

const SEED_STEP_MS = 60_000

export function joinNote(title: string, rest: string) {
  return rest === '' ? title : `${title}\n${rest}`
}

export function splitNote(body: string) {
  const [title = '', ...rest] = body.split('\n')
  return { title, rest: rest.join('\n') }
}

export function noteTitle(note: BookNote, untitled: string) {
  return note.body.trim().split('\n')[0] || untitled
}

export function notePreview(note: BookNote) {
  return note.body.split('\n')[1] ?? ''
}

// Notes d'Ikhlas : 1 minute d'écart entre chacune pour garder l'ordre des données une fois triées par date.
export function seedNotes(entries: NotesEntry[], now: number): BookNote[] {
  return entries.map((entry, index) => ({
    id: entry.id,
    folder: entry.folder ?? DEFAULT_FOLDER,
    body: joinNote(entry.title, entry.body.join('\n\n')),
    isPinned: entry.isPinned ?? false,
    modifiedAt: now - index * SEED_STEP_MS,
  }))
}

// Les notes épinglées par les visiteurs (Pin a note) remplissent le dossier Testimonials ; {name} est remplacé par l'auteur.
export function testimonialNote(note: PinnedNote, labels: { from: string; anonymous: string }): BookNote {
  return {
    id: `testimonial-${note.id}`,
    folder: TESTIMONIALS_FOLDER,
    body: joinNote(labels.from.replace('{name}', note.author || labels.anonymous), note.text),
    isPinned: false,
    modifiedAt: Date.parse(note.createdAt),
  }
}

export function applyNotesChanges(seeds: BookNote[], changes: NotesChanges): BookNote[] {
  const seededNotes = seeds
    .filter((note) => !changes.deletedIds.includes(note.id))
    .map((note) => ({ ...note, ...changes.edited[note.id] }))
  return [...changes.created, ...seededNotes].map((note) =>
    note.id in changes.isPinnedById ? { ...note, isPinned: changes.isPinnedById[note.id] } : note,
  )
}

export function createNote(changes: NotesChanges, note: BookNote): NotesChanges {
  return { ...changes, created: [note, ...changes.created] }
}

export function editNote(changes: NotesChanges, id: string, body: string, now: number): NotesChanges {
  if (changes.created.some((note) => note.id === id)) {
    return {
      ...changes,
      created: changes.created.map((note) => (note.id === id ? { ...note, body, modifiedAt: now } : note)),
    }
  }
  return { ...changes, edited: { ...changes.edited, [id]: { body, modifiedAt: now } } }
}

export function setNotePinned(changes: NotesChanges, id: string, isPinned: boolean): NotesChanges {
  return { ...changes, isPinnedById: { ...changes.isPinnedById, [id]: isPinned } }
}

export function deleteNote(changes: NotesChanges, id: string): NotesChanges {
  if (changes.created.some((note) => note.id === id)) {
    const { [id]: _pin, ...isPinnedById } = changes.isPinnedById
    return { ...changes, created: changes.created.filter((note) => note.id !== id), isPinnedById }
  }
  return { ...changes, deletedIds: [...changes.deletedIds, id] }
}

export function addFolder(changes: NotesChanges, name: string, existing: string[]): NotesChanges {
  const folder = name.trim()
  if (folder === '' || existing.includes(folder)) return changes
  return { ...changes, folders: [...changes.folders, folder] }
}

// Notes d'abord, puis les dossiers des notes d'Ikhlas, Testimonials, et ceux créés par le visiteur.
export function notesFolders(seeds: BookNote[], changes: NotesChanges): string[] {
  return [...new Set([DEFAULT_FOLDER, ...seeds.map((note) => note.folder), TESTIMONIALS_FOLDER, ...changes.folders])]
}

export function countInFolder(notes: BookNote[], folder: string) {
  return notes.filter((note) => folder === ALL_NOTES || note.folder === folder).length
}

// Notes du dossier qui contiennent la recherche (sans casse), les plus récentes d'abord.
export function visibleNotes(notes: BookNote[], folder: string, query: string): BookNote[] {
  const needle = query.toLowerCase()
  return notes
    .filter((note) => folder === ALL_NOTES || note.folder === folder)
    .filter((note) => note.body.toLowerCase().includes(needle))
    .sort((a, b) => b.modifiedAt - a.modifiedAt)
}

export function isSameDay(a: number, b: number) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

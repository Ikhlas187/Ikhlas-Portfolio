import { apiNotesStore, NotesRequestError } from '@/lib/api/notes'
import { NOTE_COLORS, type PinnedNote } from '@/types/note'

// Contrat de stockage des notes : localNotesStore (ce navigateur) ou apiNotesStore (lib/api/notes.ts, partagé).
export type NotesStore = {
  listNotes: () => Promise<PinnedNote[]>
  pinNote: (note: PinnedNote) => Promise<PinnedNote>
  removeNote: (id: string) => Promise<void>
}

const NOTES_KEY = 'pinned-notes'

function isPinnedNote(value: unknown): value is PinnedNote {
  if (typeof value !== 'object' || value === null) return false
  const note = value as Record<string, unknown>
  return (
    typeof note.id === 'string' &&
    typeof note.text === 'string' &&
    (note.author === null || typeof note.author === 'string') &&
    NOTE_COLORS.includes(note.color as PinnedNote['color']) &&
    typeof note.createdAt === 'string'
  )
}

// localStorage peut lever une erreur (navigation privée, stockage bloqué) ou contenir autre chose : on repart d'une liste vide.
function readNotes(): PinnedNote[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(NOTES_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isPinnedNote) : []
  } catch {
    return []
  }
}

function writeNotes(notes: PinnedNote[]) {
  try {
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  } catch {
    // Stockage bloqué : la note vit jusqu'au rechargement.
  }
}

// Toutes les notes de ce navigateur sont celles du visiteur ; même règle qu'en ligne, 1 note à la fois.
export const localNotesStore: NotesStore = {
  listNotes: async () => readNotes().map((note) => ({ ...note, isMine: true })),
  pinNote: async (note) => {
    const notes = readNotes()
    if (notes.length > 0) throw new NotesRequestError('alreadyPinned')
    writeNotes([note])
    return { ...note, isMine: true }
  },
  removeNote: async (id) => writeNotes(readNotes().filter((note) => note.id !== id)),
}

// Notes partagées (api/notes.ts) une fois VITE_SHARED_NOTES=true et DATABASE_URL posés dans Vercel ; sinon ce navigateur.
export const notesStore: NotesStore = import.meta.env.VITE_SHARED_NOTES === 'true' ? apiNotesStore : localNotesStore

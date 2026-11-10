import { apiNotesStore } from '@/lib/api/notes'
import { NOTE_COLORS, type PinnedNote } from '@/types/note'

// Contrat de stockage des notes : localNotesStore (ce navigateur) ou apiNotesStore (lib/api/notes.ts, partagé).
export type NotesStore = {
  listNotes: () => Promise<PinnedNote[]>
  pinNote: (note: PinnedNote) => Promise<PinnedNote>
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

export const localNotesStore: NotesStore = {
  listNotes: async () => readNotes(),
  pinNote: async (note) => {
    try {
      window.localStorage.setItem(NOTES_KEY, JSON.stringify([note, ...readNotes()]))
    } catch {
      return note
    }
    return note
  },
}

// Notes partagées (api/notes.ts) une fois VITE_SHARED_NOTES=true et DATABASE_URL posés dans Vercel ; sinon ce navigateur.
export const notesStore: NotesStore = import.meta.env.VITE_SHARED_NOTES === 'true' ? apiNotesStore : localNotesStore

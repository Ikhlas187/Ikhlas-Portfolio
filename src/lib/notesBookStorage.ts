import { EMPTY_NOTES_CHANGES, type NotesChanges } from '@/logic/macos/notesBook/notesBook'

const NOTES_BOOK_KEY = 'macos.notes'

// Changements de l'app Notes du faux macOS, gardés entre les visites. Stockage bloqué ou valeur abîmée : aucun changement.
export function readNotesChanges(): NotesChanges {
  try {
    const stored = JSON.parse(window.localStorage.getItem(NOTES_BOOK_KEY) ?? 'null') as Partial<NotesChanges> | null
    if (!stored || typeof stored !== 'object') return EMPTY_NOTES_CHANGES
    return {
      created: Array.isArray(stored.created) ? stored.created : [],
      edited: stored.edited && typeof stored.edited === 'object' ? stored.edited : {},
      pinned: stored.pinned && typeof stored.pinned === 'object' ? stored.pinned : {},
      deletedIds: Array.isArray(stored.deletedIds) ? stored.deletedIds : [],
      folders: Array.isArray(stored.folders) ? stored.folders : [],
    }
  } catch {
    return EMPTY_NOTES_CHANGES
  }
}

export function saveNotesChanges(changes: NotesChanges) {
  try {
    window.localStorage.setItem(NOTES_BOOK_KEY, JSON.stringify(changes))
  } catch {
    return
  }
}

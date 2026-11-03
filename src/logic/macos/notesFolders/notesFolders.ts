import type { NotesEntry } from '@/data/macos'
import type { PinnedNote } from '@/types/note'

export const TESTIMONIALS_FOLDER = 'testimonials'

const TESTIMONIAL_MIN_LENGTH = 3

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function canPostTestimonial(text: string) {
  return text.trim().length >= TESTIMONIAL_MIN_LENGTH
}

// Les notes épinglées par les visiteurs deviennent le dossier Testimonials ; {name} est remplacé par l'auteur.
export function testimonialEntry(
  note: PinnedNote,
  labels: { from: string; anonymous: string },
  intlLocale: string,
): NotesEntry {
  const date = new Date(note.createdAt).toLocaleDateString(intlLocale, { day: 'numeric', month: 'long', year: 'numeric' })
  return {
    id: `testimonial-${note.id}`,
    folder: TESTIMONIALS_FOLDER,
    title: labels.from.replace('{name}', note.author || labels.anonymous),
    body: [note.text, date],
  }
}

// Testimonials d'abord, puis les dossiers des notes dans leur ordre d'apparition.
export function folderNames(entries: NotesEntry[]) {
  return [TESTIMONIALS_FOLDER, ...new Set(entries.flatMap((entry) => (entry.folder ? [entry.folder] : [])))]
}

export function entriesInFolder(entries: NotesEntry[], folder: string | null) {
  return entries.filter((entry) => entry.folder === folder)
}

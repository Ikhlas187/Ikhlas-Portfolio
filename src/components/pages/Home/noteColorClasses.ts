import type { NoteColor } from '@/types/note'

type NoteColorClasses = {
  paper: string
  field: string
  swatch: string
}

// Classes écrites en entier pour que Tailwind les détecte : pas de nom de couleur assemblé à la volée.
export const NOTE_COLOR_CLASSES: Record<NoteColor, NoteColorClasses> = {
  pink: {
    paper: 'bg-(--color-note-pink) text-(--color-note-pink-ink)',
    field:
      'bg-[color-mix(in_srgb,var(--color-note-pink)_42%,var(--color-white))] text-(--color-note-pink-ink) placeholder:text-[color-mix(in_srgb,var(--color-note-pink-ink)_55%,transparent)] focus-visible:ring-(--color-note-pink-ink)',
    swatch: 'bg-(--color-note-pink)',
  },
  yellow: {
    paper: 'bg-(--color-note-yellow) text-(--color-note-yellow-ink)',
    field:
      'bg-[color-mix(in_srgb,var(--color-note-yellow)_42%,var(--color-white))] text-(--color-note-yellow-ink) placeholder:text-[color-mix(in_srgb,var(--color-note-yellow-ink)_55%,transparent)] focus-visible:ring-(--color-note-yellow-ink)',
    swatch: 'bg-(--color-note-yellow)',
  },
  orange: {
    paper: 'bg-(--color-note-orange) text-(--color-note-orange-ink)',
    field:
      'bg-[color-mix(in_srgb,var(--color-note-orange)_42%,var(--color-white))] text-(--color-note-orange-ink) placeholder:text-[color-mix(in_srgb,var(--color-note-orange-ink)_55%,transparent)] focus-visible:ring-(--color-note-orange-ink)',
    swatch: 'bg-(--color-note-orange)',
  },
  green: {
    paper: 'bg-(--color-note-green) text-(--color-note-green-ink)',
    field:
      'bg-[color-mix(in_srgb,var(--color-note-green)_42%,var(--color-white))] text-(--color-note-green-ink) placeholder:text-[color-mix(in_srgb,var(--color-note-green-ink)_55%,transparent)] focus-visible:ring-(--color-note-green-ink)',
    swatch: 'bg-(--color-note-green)',
  },
  blue: {
    paper: 'bg-(--color-note-blue) text-(--color-note-blue-ink)',
    field:
      'bg-[color-mix(in_srgb,var(--color-note-blue)_42%,var(--color-white))] text-(--color-note-blue-ink) placeholder:text-[color-mix(in_srgb,var(--color-note-blue-ink)_55%,transparent)] focus-visible:ring-(--color-note-blue-ink)',
    swatch: 'bg-(--color-note-blue)',
  },
}

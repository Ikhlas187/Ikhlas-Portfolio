import { CURSOR_KINDS, type CursorKind } from '@/data/cursor'

// Valeur de l'attribut data-cursor : une valeur inconnue ne doit pas afficher de bulle vide.
export function cursorKindOf(value: string | null | undefined): CursorKind | null {
  return CURSOR_KINDS.find((kind) => kind === value) ?? null
}

export const CURSOR_KINDS = ['view', 'scroll'] as const

export type CursorKind = (typeof CURSOR_KINDS)[number]

// Valeur de l'attribut data-cursor : une valeur inconnue ne doit pas afficher de bulle vide.
export function cursorKindOf(value: string | null | undefined): CursorKind | null {
  return CURSOR_KINDS.find((kind) => kind === value) ?? null
}

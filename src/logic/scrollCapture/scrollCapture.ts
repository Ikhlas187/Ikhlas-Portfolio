export type ScrollAxis = {
  offset: number
  contentSize: number
  viewportSize: number
}

// Vrai si le conteneur peut encore défiler dans le sens du delta (molette ou trackpad).
export function canScrollBy(axis: ScrollAxis, delta: number): boolean {
  if (delta > 0) return axis.offset + axis.viewportSize < axis.contentSize - 1
  if (delta < 0) return axis.offset > 0
  return false
}

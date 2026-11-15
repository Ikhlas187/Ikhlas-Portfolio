// Hauteur de la ligne de base dans une boîte de line-height 1, en part de la taille de police (métriques fontBoundingBox).
export function fontBaseline(ascent: number, descent: number, fontSize: number) {
  return ((fontSize - (ascent + descent)) / 2 + ascent) / fontSize
}

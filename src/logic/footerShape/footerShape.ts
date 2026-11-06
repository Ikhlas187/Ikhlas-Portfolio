export type FooterShape = {
  width: number
  height: number
  notchWidth: number
  notchDepth: number
  cornerRadius: number
  notchRadius: number
  shoulderRadius: number
}

// Contour SVG du footer : rectangle arrondi avec, en haut au centre, une encoche en U
// (épaules arrondies vers le bas, fond arrondi), comme l'encoche de caméra d'un MacBook.
export function footerPath({ width, height, notchWidth, notchDepth, cornerRadius, notchRadius, shoulderRadius }: FooterShape) {
  const left = (width - notchWidth) / 2
  const right = left + notchWidth
  const corner = cornerRadius
  return [
    `M ${corner} 0`,
    `L ${left - shoulderRadius} 0`,
    `A ${shoulderRadius} ${shoulderRadius} 0 0 1 ${left} ${shoulderRadius}`,
    `L ${left} ${notchDepth - notchRadius}`,
    `A ${notchRadius} ${notchRadius} 0 0 0 ${left + notchRadius} ${notchDepth}`,
    `L ${right - notchRadius} ${notchDepth}`,
    `A ${notchRadius} ${notchRadius} 0 0 0 ${right} ${notchDepth - notchRadius}`,
    `L ${right} ${shoulderRadius}`,
    `A ${shoulderRadius} ${shoulderRadius} 0 0 1 ${right + shoulderRadius} 0`,
    `L ${width - corner} 0`,
    `A ${corner} ${corner} 0 0 1 ${width} ${corner}`,
    `L ${width} ${height - corner}`,
    `A ${corner} ${corner} 0 0 1 ${width - corner} ${height}`,
    `L ${corner} ${height}`,
    `A ${corner} ${corner} 0 0 1 0 ${height - corner}`,
    `L 0 ${corner}`,
    `A ${corner} ${corner} 0 0 1 ${corner} 0`,
    'Z',
  ].join(' ')
}

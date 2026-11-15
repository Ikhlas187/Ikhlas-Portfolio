const MIN_SCALE_Y = 0.72
const MAX_SCALE_Y = 1.22

// Étirement de chaque lettre à largeur totale constante ; offset (en em) = ce que les lettres d'avant ont gagné ou perdu.
export function letterTransforms(widths: number[], values: number[], squash: number) {
  const rawScales = values.map((value) => Math.exp(value))
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
  const stretchedWidth = widths.reduce((sum, width, index) => sum + width * rawScales[index], 0)
  const normalize = totalWidth / stretchedWidth
  let restLeft = 0
  let liveLeft = 0
  return widths.map((width, index) => {
    const scaleX = rawScales[index] * normalize
    const scaleY = Math.min(MAX_SCALE_Y, Math.max(MIN_SCALE_Y, scaleX ** -squash))
    const offset = liveLeft - restLeft
    restLeft += width
    liveLeft += width * scaleX
    return { offset, scaleX, scaleY }
  })
}

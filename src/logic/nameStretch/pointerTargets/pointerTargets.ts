type StretchSettings = { spread: number; strength: number }

// Cible de chaque lettre (log de son scaleX) en cloche autour du pointeur ; widths et pointer en em, pointer null = sorti.
export function pointerTargets(widths: number[], chars: string[], pointer: number | null, { spread, strength }: StretchSettings) {
  const meanWidth = widths.reduce((sum, width) => sum + width, 0) / widths.length
  const reach = Math.max(0.2, spread) * meanWidth
  const peak = Math.log(1 + 2.4 * Math.max(0, strength))
  let left = 0
  return widths.map((width, index) => {
    const center = left + width / 2
    left += width
    if (pointer === null || chars[index] === ' ') return 0
    const distance = (center - pointer) / reach
    return peak * Math.exp(-distance * distance)
  })
}

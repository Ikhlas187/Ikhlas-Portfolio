export type FitTarget = {
  width: number
  height: number
}

export type FitLens = {
  verticalFovDeg: number
  aspect: number
}

// Distance caméra → plan pour qu'un rectangle tienne entier dans le cadre, multiplié par la marge.
export function fitDistance(target: FitTarget, lens: FitLens, margin = 1): number {
  const halfTan = Math.tan((lens.verticalFovDeg * Math.PI) / 360)
  const byHeight = target.height / 2 / halfTan
  const byWidth = target.width / 2 / (halfTan * lens.aspect)
  return Math.max(byHeight, byWidth) * margin
}

// Distance pour que le rectangle couvre tout le cadre (ses bords débordent sur l'axe le moins serré).
export function coverDistance(target: FitTarget, lens: FitLens): number {
  const halfTan = Math.tan((lens.verticalFovDeg * Math.PI) / 360)
  const byHeight = target.height / 2 / halfTan
  const byWidth = target.width / 2 / (halfTan * lens.aspect)
  return Math.min(byHeight, byWidth)
}

export type CoverBox = {
  width: number
  height: number
  scale: number
}

// Le contenu garde au moins minWidth px logiques de large, quitte à être réduit pour tenir dans la partie visible.
export function coverBox(screen: FitTarget, viewportAspect: number, minWidth: number): CoverBox {
  const isWider = viewportAspect > screen.width / screen.height
  const visible = isWider
    ? { width: screen.width, height: screen.width / viewportAspect }
    : { width: screen.height * viewportAspect, height: screen.height }
  const scale = Math.min(1, visible.width / minWidth)
  return { width: visible.width / scale, height: visible.height / scale, scale }
}

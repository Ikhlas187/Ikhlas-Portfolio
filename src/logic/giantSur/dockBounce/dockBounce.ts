export type DockBounceKeyframes = { y: number[]; times: number[] }

// Rebond d'une icône du Dock au lancement : sauts de plus en plus bas, chacun proportionnel au précédent.
export function dockBounceKeyframes(height: number, count: number, damping: number): DockBounceKeyframes {
  const heights = Array.from({ length: count }, (_, index) => height * damping ** index)
  const total = heights.reduce((sum, jump) => sum + Math.sqrt(jump), 0)
  const y = [0]
  const times = [0]
  let elapsed = 0
  // La durée d'un saut suit la racine de sa hauteur, comme une vraie chute.
  heights.forEach((jump) => {
    const share = Math.sqrt(jump) / total
    y.push(-jump, 0)
    times.push(elapsed + share / 2, elapsed + share)
    elapsed += share
  })
  times[times.length - 1] = 1
  return { y, times }
}

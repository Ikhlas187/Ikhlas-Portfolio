// Au minimum de luminosité, l'écran reste lisible : le voile noir ne dépasse pas 85 % d'opacité, comme un vrai Mac.
const MAX_SHADE = 0.85

export function brightnessShade(brightness: number) {
  const clamped = Math.min(Math.max(brightness, 0), 1)
  return Math.round((1 - clamped) * MAX_SHADE * 1000) / 1000
}

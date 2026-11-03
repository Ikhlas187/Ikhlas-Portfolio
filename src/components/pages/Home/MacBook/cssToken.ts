// Les couleurs de la scène 3D se lisent dans tokens.css, comme celles du reste du site.
export function cssToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

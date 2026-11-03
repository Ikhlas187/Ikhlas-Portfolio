export const RECENTS_LIMIT = 20

// Le fichier ouvert passe en tête ; s'il y était déjà, il n'apparaît qu'une fois.
export function addRecent(recents: string[][], path: string[], limit = RECENTS_LIMIT): string[][] {
  const key = path.join('/')
  return [path, ...recents.filter((recent) => recent.join('/') !== key)].slice(0, limit)
}

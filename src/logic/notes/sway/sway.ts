export type NoteSway = {
  durationS: number
  delayS: number
}

const MIN_DURATION_S = 3.2
const DURATION_SPREAD_S = 2.4

// FNV-1a : la même note garde le même balancement d'un rendu et d'une visite à l'autre.
function hashId(id: string) {
  let hash = 0x811c9dc5
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  // Brassage final (murmur3) : des id voisins comme « welcome-1 » et « welcome-2 » donnent des rythmes éloignés.
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x85ebca6b)
  hash ^= hash >>> 13
  return hash >>> 0
}

// Délai négatif : chaque note démarre déjà au milieu de son balancement, sans attente au chargement.
export function noteSway(id: string): NoteSway {
  const hash = hashId(id)
  const durationS = MIN_DURATION_S + ((hash & 0xffff) / 0xffff) * DURATION_SPREAD_S
  const delayS = -((hash >>> 16) / 0xffff) * durationS
  return { durationS: Number(durationS.toFixed(2)), delayS: Number(delayS.toFixed(2)) }
}

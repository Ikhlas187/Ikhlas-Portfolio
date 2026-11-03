export type SwipeGesture = 'next' | 'previous' | 'tap' | null

const SWIPE_DISTANCE = 60
const TAP_DISTANCE = 10

// Albums dans l'ordre de leur 1re photo.
export function groupByAlbum<T extends { album: string }>(items: T[]): [string, T[]][] {
  const albums = new Map<string, T[]>()
  for (const item of items) albums.set(item.album, [...(albums.get(item.album) ?? []), item])
  return [...albums.entries()]
}

// Glisser franchement à l'horizontale change de photo, un geste quasi immobile compte comme un tap.
export function swipeGesture(deltaX: number, deltaY: number): SwipeGesture {
  if (Math.abs(deltaX) > SWIPE_DISTANCE && Math.abs(deltaX) > 1.5 * Math.abs(deltaY)) {
    return deltaX < 0 ? 'next' : 'previous'
  }
  if (Math.abs(deltaX) < TAP_DISTANCE && Math.abs(deltaY) < TAP_DISTANCE) return 'tap'
  return null
}

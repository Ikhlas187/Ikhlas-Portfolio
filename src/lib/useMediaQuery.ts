import { useSyncExternalStore } from 'react'

// Sous 810 px : la version mobile de la réf. haufsess.com (pas de Mac, pas de tableau de notes).
export const MOBILE_QUERY = '(max-width: 809px)'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

import type { AboutSegment } from '@/data/about'

// Texte brut d'un morceau du paragraphe À propos, sans sa mise en forme (surlignage, lien, citation).
export function segmentText(segment: AboutSegment) {
  if (typeof segment === 'string') return segment
  if ('highlight' in segment) return segment.highlight
  if ('link' in segment) return segment.link
  return segment.quote
}

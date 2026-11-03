import type { Localized } from '@/data/locale'

// Bouton son fixe du site, en bas à gauche.
export const MUSIC_TOGGLE: Localized<{ mute: string; unmute: string }> = {
  en: { mute: 'Mute the music', unmute: 'Play the music' },
  fr: { mute: 'Couper la musique', unmute: 'Mettre la musique' },
}

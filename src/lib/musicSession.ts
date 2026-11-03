export type MusicPreferences = { isMuted: boolean; volume: number }

const MUSIC_KEY = 'music.preferences'
export const DEFAULT_MUSIC_PREFERENCES: MusicPreferences = { isMuted: false, volume: 0.35 }

// Musique coupée ou non et volume, gardés pour la session. Stockage bloqué ou valeur abîmée : réglages par défaut.
export function readMusicPreferences(): MusicPreferences {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(MUSIC_KEY) ?? 'null') as Partial<MusicPreferences> | null
    if (!stored) return DEFAULT_MUSIC_PREFERENCES
    return {
      isMuted: typeof stored.isMuted === 'boolean' ? stored.isMuted : DEFAULT_MUSIC_PREFERENCES.isMuted,
      volume:
        typeof stored.volume === 'number' && stored.volume >= 0 && stored.volume <= 1
          ? stored.volume
          : DEFAULT_MUSIC_PREFERENCES.volume,
    }
  } catch {
    return DEFAULT_MUSIC_PREFERENCES
  }
}

export function saveMusicPreferences(preferences: MusicPreferences) {
  try {
    window.sessionStorage.setItem(MUSIC_KEY, JSON.stringify(preferences))
  } catch {
    return
  }
}

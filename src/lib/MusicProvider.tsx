import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import batmanTrack from '@/assets/background-music.m4a'
import { isLoaderRevealed } from '@/lib/loaderSession'
import { readMusicPreferences, saveMusicPreferences } from '@/lib/musicSession'
import { shouldStartOnGesture } from '@/logic/music/autoStart/autoStart'

type MusicContextValue = {
  // Faux si le navigateur ne sait pas décoder le fichier : rien ne s'affiche comme « en lecture ».
  isAvailable: boolean
  isPlaying: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  volume: number
  setVolume: (volume: number) => void
  currentTime: number
  duration: number
}

// Événements qui donnent au navigateur l'activation utilisateur exigée par play() (touchstart n'en fait pas partie).
const GESTURE_EVENTS = ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'] as const
// Les commandes de musique gèrent elles-mêmes leur clic : le démarrage au 1er geste les ignore.
export const MUSIC_CONTROL_ATTRIBUTE = 'data-music-control'

const MusicContext = createContext<MusicContextValue | null>(null)

// Un seul lecteur pour tout le site : la musique de fond et l'app Musique du faux macOS pilotent le même Audio.
export default function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const preferencesRef = useRef(readMusicPreferences())
  const hasStartedOrChosenRef = useRef(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(preferencesRef.current.volume)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(Number.NaN)

  useEffect(() => {
    const audio = new Audio(batmanTrack)
    audio.loop = true
    audio.preload = 'metadata'
    audio.volume = preferencesRef.current.volume
    audioRef.current = audio

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration)
    const onError = () => {
      setIsAvailable(false)
      setIsPlaying(false)
      audio.pause()
    }
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('error', onError)
      audio.removeAttribute('src')
      audio.load()
      if (audioRef.current === audio) audioRef.current = null
    }
  }, [])

  const savePreferences = useCallback((changes: Partial<typeof preferencesRef.current>) => {
    preferencesRef.current = { ...preferencesRef.current, ...changes }
    saveMusicPreferences(preferencesRef.current)
  }, [])

  const play = useCallback(() => {
    hasStartedOrChosenRef.current = true
    savePreferences({ isMuted: false })
    if (audioRef.current?.error) return
    audioRef.current?.play().catch(() => undefined)
  }, [savePreferences])

  const pause = useCallback(() => {
    hasStartedOrChosenRef.current = true
    savePreferences({ isMuted: true })
    audioRef.current?.pause()
  }, [savePreferences])

  const toggle = useCallback(() => {
    if (audioRef.current?.paused ?? true) play()
    else pause()
  }, [play, pause])

  const setVolume = useCallback(
    (nextVolume: number) => {
      const clamped = Math.min(1, Math.max(0, nextVolume))
      if (audioRef.current) audioRef.current.volume = clamped
      setVolumeState(clamped)
      savePreferences({ volume: clamped })
    },
    [savePreferences],
  )

  useEffect(() => {
    const startOnGesture = (event: Event) => {
      const audio = audioRef.current
      const target = event.target instanceof Element ? event.target : null
      if (!audio || audio.error || target?.closest(`[${MUSIC_CONTROL_ATTRIBUTE}]`)) return
      const shouldStart = shouldStartOnGesture({
        isLoaderRevealed: isLoaderRevealed(),
        isMutedForSession: preferencesRef.current.isMuted,
        hasStartedOrChosen: hasStartedOrChosenRef.current,
      })
      if (!shouldStart) return
      hasStartedOrChosenRef.current = true
      // Refusé (geste qui n'active pas la lecture) : on retente au geste suivant.
      audio.play().catch(() => {
        hasStartedOrChosenRef.current = false
      })
    }
    GESTURE_EVENTS.forEach((type) => window.addEventListener(type, startOnGesture))
    return () => GESTURE_EVENTS.forEach((type) => window.removeEventListener(type, startOnGesture))
  }, [])

  const value = useMemo(
    () => ({ isAvailable, isPlaying, play, pause, toggle, volume, setVolume, currentTime, duration }),
    [isAvailable, isPlaying, play, pause, toggle, volume, setVolume, currentTime, duration],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) throw new Error('useMusic doit être appelé sous <MusicProvider>')
  return context
}

import { useEffect, useState } from 'react'
import { AudioLines, ListMusic, Music2, Pause, Play } from 'lucide-react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { MUSIC_CONTROL_ATTRIBUTE, useMusic } from '@/lib/MusicProvider'
import { cn } from '@/lib/utils'
import { trackProgress } from '@/logic/music/trackProgress/trackProgress'
import { formatTrackTime } from '@/logic/music/trackTime/trackTime'

type MusicProps = { frame: WindowFrameProps }

const UNAVAILABLE_NOTICE_MS = 2000

// Seul « Batman » de Bedry se joue, sur le lecteur partagé du site (bouton son compris) ; les autres pistes sont des aperçus indisponibles.
export default function Music({ frame }: MusicProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].music
  const { isAvailable, isPlaying, toggle, play, currentTime, duration } = useMusic()
  const current = texts.tracks.find((track) => track.isPlayable) ?? texts.tracks[0]
  const [selectedId, setSelectedId] = useState(current.id)
  const [unavailableId, setUnavailableId] = useState<string | null>(null)
  const progress = trackProgress(currentTime, duration)

  useEffect(() => {
    if (!unavailableId) return
    const timer = window.setTimeout(() => setUnavailableId(null), UNAVAILABLE_NOTICE_MS)
    return () => window.clearTimeout(timer)
  }, [unavailableId])

  return (
    <FinderWindow
      frame={frame}
      title={MACOS[locale].appNames.music}
      sidebar={
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-[1px]">
            <p className="px-[8px] pb-[4px] text-[11px] font-semibold text-(--macos-text-muted)">{texts.library}</p>
            <p className="flex h-[26px] items-center gap-[8px] rounded-[6px] px-[8px]">
              <Music2 strokeWidth={1.8} className="size-[15px] text-(--macos-music)" />
              {MACOS[locale].appNames.music}
            </p>
          </div>
          <div className="flex flex-col gap-[1px]">
            <p className="px-[8px] pb-[4px] text-[11px] font-semibold text-(--macos-text-muted)">{texts.playlist}</p>
            <p className="flex h-[26px] items-center gap-[8px] rounded-[6px] bg-(--macos-pressed-strong) px-[8px]">
              <ListMusic strokeWidth={1.8} className="size-[15px] text-(--macos-music)" />
              {texts.playlistTitle}
            </p>
          </div>
        </div>
      }
      toolbar={
        <div className="flex flex-1 items-center gap-[12px]">
          <button
            type="button"
            {...{ [MUSIC_CONTROL_ATTRIBUTE]: '' }}
            aria-label={isPlaying ? texts.pause : texts.play}
            disabled={!isAvailable}
            onClick={toggle}
            className="flex size-[30px] cursor-pointer items-center justify-center rounded-full hover:bg-(--macos-hover) disabled:cursor-default disabled:opacity-40"
          >
            {isPlaying ? <Pause className="size-[18px] fill-current" /> : <Play className="size-[18px] fill-current" />}
          </button>
          <div className="flex h-[40px] w-[380px] items-center gap-[10px] rounded-[6px] bg-(--macos-field) px-[10px]">
            <AudioLines
              className={cn(
                'size-[16px] shrink-0 text-(--macos-music)',
                isPlaying && 'animate-pulse motion-reduce:animate-none',
              )}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-[3px] text-[11px] leading-[1.2]">
              <span className="truncate">
                <span className="font-semibold">{current.title}</span>
                <span className="text-(--macos-text-muted)"> · {current.artist}</span>
              </span>
              <div className="flex items-center gap-[6px] text-[10px] text-(--macos-text-muted) tabular-nums">
                <span aria-label={texts.elapsed}>{formatTrackTime(currentTime)}</span>
                <div
                  role="progressbar"
                  aria-label={current.title}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-(--macos-separator)"
                >
                  <div className="h-full rounded-full bg-(--macos-music)" style={{ width: `${progress * 100}%` }} />
                </div>
                <span>{formatTrackTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="absolute inset-0 overflow-y-auto px-[24px] py-[20px]">
        <div className="flex items-end gap-[18px] pb-[18px]">
          <div className="flex size-[120px] items-center justify-center rounded-[8px] bg-linear-to-br from-(--color-accent) to-(--macos-music) shadow-(--macos-shadow-icon)">
            <ListMusic strokeWidth={1.4} className="size-[52px] text-(--macos-icon-glyph)" />
          </div>
          <div>
            <h2 className="[font-family:inherit] text-[24px] font-bold">{texts.playlistTitle}</h2>
            <p className="text-(--macos-music)">{texts.playlistSubtitle}</p>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="h-[26px] border-b border-(--macos-separator) text-[11px] text-(--macos-text-muted)">
              <th className="w-[36px] font-normal" />
              <th className="font-normal">{texts.columns.title}</th>
              <th className="font-normal">{texts.columns.artist}</th>
              <th className="w-[140px] text-right font-normal">{texts.columns.time}</th>
            </tr>
          </thead>
          <tbody>
            {texts.tracks.map((track, index) => {
              const isCurrent = track.id === current.id
              const isPlayable = track.isPlayable === true && isAvailable
              return (
                <tr
                  key={track.id}
                  {...(isPlayable ? { [MUSIC_CONTROL_ATTRIBUTE]: '' } : {})}
                  aria-disabled={!isPlayable}
                  title={isPlayable ? undefined : texts.previewUnavailable}
                  onClick={() => setSelectedId(track.id)}
                  onDoubleClick={() => (isPlayable ? play() : setUnavailableId(track.id))}
                  className={cn(
                    'h-[30px] odd:bg-(--macos-field)',
                    isPlayable ? 'cursor-pointer hover:bg-(--macos-hover)' : 'cursor-default opacity-45',
                    selectedId === track.id && 'bg-(--macos-pressed-strong) odd:bg-(--macos-pressed-strong)',
                    isCurrent && 'text-(--macos-music)',
                  )}
                >
                  <td className="pl-[10px] text-[11px] text-(--macos-text-muted) tabular-nums">
                    {isCurrent && isPlaying ? <AudioLines className="size-[13px] text-(--macos-music)" /> : index + 1}
                  </td>
                  <td>{track.title}</td>
                  <td className="text-(--macos-text-muted)">{track.artist}</td>
                  <td className="pr-[10px] text-right text-(--macos-text-muted) tabular-nums">
                    {unavailableId === track.id ? texts.previewUnavailable : (track.duration ?? formatTrackTime(duration))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </FinderWindow>
  )
}

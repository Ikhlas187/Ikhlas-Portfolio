import { useState } from 'react'
import { AudioLines, ListMusic, Music2, Pause, Play } from 'lucide-react'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type MusicProps = { frame: WindowFrameProps }

// Lecteur décoratif : aucun son, seule la piste en cours et l'état lecture/pause changent.
export default function Music({ frame }: MusicProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].music
  const [currentId, setCurrentId] = useState(texts.tracks[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const current = texts.tracks.find((track) => track.id === currentId) ?? texts.tracks[0]

  const playTrack = (id: string) => {
    setCurrentId(id)
    setIsPlaying(true)
  }

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
            aria-label={isPlaying ? texts.pause : texts.play}
            onClick={() => setIsPlaying((value) => !value)}
            className="flex size-[30px] cursor-pointer items-center justify-center rounded-full hover:bg-(--macos-hover)"
          >
            {isPlaying ? <Pause className="size-[18px] fill-current" /> : <Play className="size-[18px] fill-current" />}
          </button>
          <div className="flex h-[36px] w-[340px] items-center gap-[10px] rounded-[6px] bg-(--macos-field) px-[10px]">
            <AudioLines className={cn('size-[16px] text-(--macos-music)', isPlaying && 'animate-pulse')} />
            <span className="min-w-0 text-[12px] leading-[1.25]">
              <span className="block truncate font-semibold">{current.title}</span>
              <span className="block truncate text-(--macos-text-muted)">{current.artist}</span>
            </span>
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
              <th className="w-[60px] text-right font-normal">{texts.columns.time}</th>
            </tr>
          </thead>
          <tbody>
            {texts.tracks.map((track, index) => {
              const isCurrent = track.id === currentId
              return (
                <tr
                  key={track.id}
                  onDoubleClick={() => playTrack(track.id)}
                  onClick={() => setCurrentId(track.id)}
                  className={cn(
                    'h-[30px] cursor-pointer odd:bg-(--macos-field) hover:bg-(--macos-hover)',
                    isCurrent && 'text-(--macos-music)',
                  )}
                >
                  <td className="pl-[10px] text-[11px] text-(--macos-text-muted) tabular-nums">
                    {isCurrent && isPlaying ? <AudioLines className="size-[13px] text-(--macos-music)" /> : index + 1}
                  </td>
                  <td>{track.title}</td>
                  <td className="text-(--macos-text-muted)">{track.artist}</td>
                  <td className="pr-[10px] text-right text-(--macos-text-muted) tabular-nums">{track.duration}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </FinderWindow>
  )
}

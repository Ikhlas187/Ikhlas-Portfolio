import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Heart, Info, Share, SlidersHorizontal, Trash2 } from 'lucide-react'
import PhotoActionButton from '@/components/pages/Home/MacOS/Photos/PhotoActionButton'
import PhotoInfoSheet from '@/components/pages/Home/MacOS/Photos/PhotoInfoSheet'
import type { PhotoItem } from '@/components/pages/Home/MacOS/Photos/Photos'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { swipeGesture } from '@/logic/macos/photoAlbums/photoAlbums'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type PhotoViewerProps = {
  items: PhotoItem[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
}

const ACTION_ICON = 'size-[23px]'

// Visionneuse plein cadre : pellicule, flèches du clavier, glisser pour changer de photo.
export default function PhotoViewer({ items, index, onNavigate, onClose }: PhotoViewerProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].photos
  const item = items[index]
  const hasPrevious = index > 0
  const hasNext = index < items.length - 1
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const filmstrip = useRef<HTMLDivElement>(null)
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const isLoaded = loadedId === item.id
  const isLiked = likedIds.includes(item.id)

  useEffect(() => {
    const strip = filmstrip.current
    const thumb = strip?.querySelector<HTMLElement>(`[data-filmstrip-index="${index}"]`)
    if (!strip || !thumb) return
    strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2, behavior: 'smooth' })
  }, [index])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && hasPrevious) onNavigate(index - 1)
      else if (event.key === 'ArrowRight' && hasNext) onNavigate(index + 1)
      else if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index, hasPrevious, hasNext, onNavigate, onClose])

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current
    pointerStart.current = null
    if (!start) return
    const gesture = swipeGesture(event.clientX - start.x, event.clientY - start.y)
    if (gesture === 'next' && hasNext) onNavigate(index + 1)
    if (gesture === 'previous' && hasPrevious) onNavigate(index - 1)
  }

  const share = async () => {
    const url = unsplashPhotoUrl(item.photoId, 1600)
    try {
      if (navigator.share) await navigator.share({ url, title: item.fileName })
      else await navigator.clipboard.writeText(url)
    } catch {
      // Partage annulé par le visiteur.
    }
  }

  return (
    <div
      onClick={onClose}
      onPointerDown={(event) => (pointerStart.current = { x: event.clientX, y: event.clientY })}
      onPointerUp={handlePointerUp}
      className="absolute inset-0 z-[999] flex touch-none cursor-pointer flex-col bg-(--macos-photos-bg)"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={texts.close}
        className="absolute top-[16px] right-[16px] z-10 cursor-pointer rounded-full bg-(--macos-photos-button) px-[12px] py-[4px] text-[14px] text-(--macos-photos-text) hover:bg-(--macos-photos-button-hover)"
      >
        {texts.done}
      </button>
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative flex min-h-0 flex-1 cursor-default items-center justify-center overflow-hidden"
      >
        <img
          key={item.id}
          src={unsplashPhotoUrl(item.photoId, 1600)}
          alt={item.alt}
          draggable={false}
          onLoad={() => setLoadedId(item.id)}
          className={cn(
            'size-full object-contain transition-all duration-700',
            isLoaded ? 'blur-0 scale-100' : 'scale-105 blur-xl',
          )}
        />
      </div>
      <div
        onClick={(event) => event.stopPropagation()}
        className="z-10 shrink-0 cursor-default bg-linear-to-t from-(--macos-photos-bg) to-(--macos-photos-shade-soft)"
      >
        {items.length > 1 && (
          <div
            ref={filmstrip}
            className="flex touch-pan-x gap-[4px] overflow-x-auto px-[12px] py-[8px] [scrollbar-width:none]"
          >
            {items.map((thumb, thumbIndex) => (
              <button
                key={thumb.id}
                type="button"
                data-filmstrip-index={thumbIndex}
                onClick={() => onNavigate(thumbIndex)}
                className={cn(
                  'size-[44px] shrink-0 cursor-pointer overflow-hidden rounded-[6px] transition',
                  thumbIndex === index ? 'opacity-100 ring-2 ring-(--macos-photos-text)' : 'opacity-50',
                )}
              >
                <img loading="lazy" decoding="async"
                  src={unsplashPhotoUrl(thumb.photoId, 120)}
                  alt=""
                  draggable={false}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-around px-[8px] pt-[4px] pb-[24px]">
          <PhotoActionButton label={texts.share} onClick={share}>
            <Share strokeWidth={1.8} className={ACTION_ICON} />
          </PhotoActionButton>
          <PhotoActionButton
            label={texts.like}
            onClick={() =>
              setLikedIds((current) => (isLiked ? current.filter((id) => id !== item.id) : [...current, item.id]))
            }
          >
            <Heart
              strokeWidth={1.8}
              className={cn(ACTION_ICON, isLiked && 'fill-(--macos-photos-like) text-(--macos-photos-like)')}
            />
          </PhotoActionButton>
          <PhotoActionButton label={texts.info} onClick={() => setIsInfoOpen((isOpen) => !isOpen)}>
            <Info strokeWidth={1.8} className={ACTION_ICON} />
          </PhotoActionButton>
          <PhotoActionButton label={texts.adjustments} onClick={() => {}}>
            <SlidersHorizontal strokeWidth={1.8} className={ACTION_ICON} />
          </PhotoActionButton>
          <PhotoActionButton label={texts.delete} onClick={() => {}}>
            <Trash2 strokeWidth={1.8} className={ACTION_ICON} />
          </PhotoActionButton>
        </div>
      </div>
      {isInfoOpen && (
        <div onClick={(event) => event.stopPropagation()} className="contents">
          <PhotoInfoSheet item={item} onClose={() => setIsInfoOpen(false)} />
        </div>
      )}
    </div>
  )
}

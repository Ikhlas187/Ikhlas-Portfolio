import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { PhotoItem } from '@/components/pages/Home/MacOS/Photos/Photos'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type PhotosMemoryCardProps = { album: string; items: PhotoItem[]; countLabel: string; onOpen: () => void }

const ROTATE_MS = 3000
const FADE_S = 0.7

// Carte « Souvenirs » : les photos de l'album défilent toutes les 3 s en fondu.
export default function PhotosMemoryCard({ album, items, countLabel, onOpen }: PhotosMemoryCardProps) {
  const [index, setIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)

  useEffect(() => {
    if (items.length < 2) return
    const timer = setInterval(() => {
      setIndex((current) => {
        setPreviousIndex(current)
        return (current + 1) % items.length
      })
    }, ROTATE_MS)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative h-[160px] w-[256px] shrink-0 cursor-pointer overflow-hidden rounded-[12px] bg-(--macos-photos-tile) text-left"
    >
      <img
        src={unsplashPhotoUrl(items[index].photoId, 600)}
        alt=""
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
      {previousIndex !== null && (
        <motion.img
          key={previousIndex}
          src={unsplashPhotoUrl(items[previousIndex].photoId, 600)}
          alt=""
          draggable={false}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: FADE_S }}
          onAnimationComplete={() => setPreviousIndex(null)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-(--macos-photos-shade) to-transparent px-[12px] pt-[32px] pb-[8px]">
        <div className="text-[14px] font-semibold text-(--macos-photos-text)">{album}</div>
        <div className="text-[11px] text-(--macos-photos-text-70)">
          {items.length} {countLabel}
        </div>
      </div>
    </button>
  )
}

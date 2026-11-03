import type { PhotoItem } from '@/components/pages/Home/MacOS/Photos/Photos'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type PhotosAlbumCardProps = { label: string; items: PhotoItem[]; onOpen: () => void }

export default function PhotosAlbumCard({ label, items, onOpen }: PhotosAlbumCardProps) {
  const cover = items[0]

  return (
    <button type="button" onClick={onOpen} className="cursor-pointer text-left">
      <div className="aspect-square overflow-hidden rounded-[8px] bg-(--macos-photos-tile)">
        {cover && (
          <img
            src={unsplashPhotoUrl(cover.photoId, 600)}
            alt={label}
            draggable={false}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="mt-[6px] text-[14px] font-medium">{label}</div>
      <div className="text-[12px] text-(--macos-photos-text-50)">{items.length}</div>
    </button>
  )
}

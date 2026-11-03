import type { PhotoItem } from '@/components/pages/Home/MacOS/Photos/Photos'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type PhotosGridProps = { items: PhotoItem[]; emptyLabel: string; onSelect: (index: number) => void }

export default function PhotosGrid({ items, emptyLabel, onSelect }: PhotosGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[14px] text-(--macos-photos-text-40)">{emptyLabel}</div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-[4px]">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(index)}
          className="group relative aspect-square cursor-pointer overflow-hidden bg-(--macos-photos-tile)"
        >
          <img
            src={unsplashPhotoUrl(item.photoId, 400)}
            alt={item.fileName}
            loading="lazy"
            draggable={false}
            className="size-full object-cover transition group-hover:scale-105"
          />
        </button>
      ))}
    </div>
  )
}

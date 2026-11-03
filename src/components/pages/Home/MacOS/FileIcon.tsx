import documentIconUrl from '@/assets/finder-document.svg'
import folderIconUrl from '@/assets/finder-folder.svg'
import pdfIconUrl from '@/assets/finder-document-pdf.svg'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'
import type { FinderItem } from '@/logic/macos/finderItems/finderItems'
import { cn } from '@/lib/utils'

type FileIconProps = { item: FinderItem; className?: string }

const ICON_URLS = { folder: folderIconUrl, text: documentIconUrl, code: documentIconUrl, pdf: pdfIconUrl }

// Icône Sequoia d'un élément du Finder : dossier bleu clair, document blanc, vignette pour une photo, logo pour une app.
export default function FileIcon({ item, className }: FileIconProps) {
  const imageClass = 'pointer-events-none size-full object-contain select-none'

  if (item.kind === 'app') {
    return <img src={item.logo} alt="" draggable={false} className={cn(imageClass, className)} />
  }

  if (item.node.kind === 'image') {
    return (
      <span className={cn('flex size-full items-center justify-center', className)}>
        <img
          src={unsplashPhotoUrl(item.node.photoId, 160)}
          alt=""
          draggable={false}
          className="pointer-events-none max-h-[76%] max-w-[92%] border-[1.5px] border-(--macos-finder-window) object-cover shadow-(--macos-finder-shadow-icon) select-none"
        />
      </span>
    )
  }

  return (
    <img
      src={ICON_URLS[item.node.kind]}
      alt=""
      draggable={false}
      className={cn(imageClass, 'drop-shadow-(--macos-finder-shadow-icon)', className)}
    />
  )
}

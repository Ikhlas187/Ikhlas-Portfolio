import CvDocument from '@/components/pages/Home/MacOS/Preview/CvDocument'
import FinderWindow from '@/components/pages/Home/MacOS/FinderWindow'
import type { WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { MACOS } from '@/data/macos'
import { useMacFiles } from '@/components/pages/Home/MacOS/useMacFiles'
import { useLocale } from '@/lib/LocaleProvider'
import { findNode } from '@/logic/macos/fileTree/fileTree'
import { unsplashPhotoUrl } from '@/logic/unsplashPhotoUrl/unsplashPhotoUrl'

type PreviewProps = { frame: WindowFrameProps }

export default function Preview({ frame }: PreviewProps) {
  const { locale } = useLocale()
  const node = findNode(useMacFiles(), frame.window.payload.path ?? [])
  const title = node?.name ?? MACOS[locale].appNames.preview

  return (
    <FinderWindow frame={frame} title={title}>
      {node?.kind === 'text' && (
        <div className="absolute inset-0 overflow-y-auto bg-(--macos-window) px-[28px] py-[22px]">
          <p className="text-[14px] leading-[1.65] whitespace-pre-wrap select-text">{node.content}</p>
        </div>
      )}
      {node?.kind === 'image' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            src={unsplashPhotoUrl(node.photoId, 1400)}
            alt={node.alt}
            draggable={false}
            className="size-full object-contain"
          />
        </div>
      )}
      {node?.kind === 'pdf' && (
        <div className="absolute inset-0 flex flex-col overflow-y-auto bg-(--macos-window-sidebar) py-[24px]">
          <CvDocument document={node.document} />
          <p className="mt-[14px] text-center text-[11px] text-(--macos-text-muted)">{MACOS[locale].preview.page}</p>
        </div>
      )}
    </FinderWindow>
  )
}

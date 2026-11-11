import type { ReactNode } from 'react'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { cn } from '@/lib/utils'

type FinderWindowProps = {
  frame: WindowFrameProps
  title: string
  isZoomable?: boolean
  // undefined : titre en gras à gauche, comme le Finder. null : titre centré, sans outils.
  toolbar?: ReactNode | null
  sidebar?: ReactNode
  sidebarClassName?: string
  titleBarClassName?: string
  contentClassName?: string
  children: ReactNode
}

// Les apps écrites pour le thème sombre lisent --macos-text, --macos-field… : on les rebranche sur la palette claire du Finder.
const LIGHT_SCHEME =
  'contents [--macos-field:var(--macos-finder-field)] [--macos-hover:var(--macos-finder-hover)] [--macos-message-received:var(--macos-finder-bubble)] [--macos-pressed-strong:var(--macos-finder-pressed-strong)] [--macos-pressed:var(--macos-finder-pressed)] [--macos-separator-strong:var(--macos-finder-separator)] [--macos-separator:var(--macos-finder-separator)] [--macos-text-muted:var(--macos-finder-text-muted)] [--macos-text:var(--macos-finder-text)] [--macos-window-sidebar:var(--macos-finder-paper-backdrop)] [--macos-window:var(--macos-finder-window)]'

// Cadre commun des apps (celui du Safari de mihrimatrix/macos-clone-react), intérieurs rebranchés sur la palette du Finder.
export default function FinderWindow({
  frame,
  title,
  isZoomable,
  toolbar,
  sidebar,
  sidebarClassName,
  titleBarClassName,
  contentClassName,
  children,
}: FinderWindowProps) {
  const toolbarContent =
    toolbar === null ? undefined : (
      <div className={LIGHT_SCHEME}>
        {toolbar ?? (
          <p className="ml-[4px] min-w-0 flex-1 truncate text-[15px] font-bold text-(--macos-frame-fg)">{title}</p>
        )}
      </div>
    )

  return (
    <Window
      {...frame}
      title={title}
      isZoomable={isZoomable}
      sidebarClassName={cn('w-[152px] bg-(--macos-finder-sidebar)', sidebarClassName)}
      titleBarClassName={titleBarClassName}
      contentClassName={cn('bg-(--macos-finder-window)', contentClassName)}
      toolbar={toolbarContent}
      sidebar={sidebar && <div className={LIGHT_SCHEME}>{sidebar}</div>}
    >
      <div className={LIGHT_SCHEME}>{children}</div>
    </Window>
  )
}

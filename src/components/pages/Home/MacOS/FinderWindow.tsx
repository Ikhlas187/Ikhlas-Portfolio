import type { ReactNode } from 'react'
import Window, { type WindowFrameProps } from '@/components/pages/Home/MacOS/Window'
import { cn } from '@/lib/utils'

type FinderWindowProps = {
  frame: WindowFrameProps
  title: string
  canZoom?: boolean
  // undefined : titre en gras à gauche, comme le Finder. null : barre de titre courte, titre centré.
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

// Cadre du Finder Sequoia (clair, barre latérale translucide pleine hauteur) partagé par toutes les apps sauf Safari.
export default function FinderWindow({
  frame,
  title,
  canZoom,
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
          <p className="ml-[4px] min-w-0 flex-1 truncate text-[15px] font-bold text-(--macos-finder-text)">{title}</p>
        )}
      </div>
    )

  return (
    <Window
      {...frame}
      title={title}
      canZoom={canZoom}
      className="border-(--macos-finder-window-border) bg-(--macos-finder-glass) text-(--macos-finder-text)"
      sidebarClassName={cn('w-[152px] border-(--macos-finder-separator) bg-(--macos-finder-sidebar)', sidebarClassName)}
      titleBarClassName={cn(
        'gap-[8px] border-transparent bg-(--macos-finder-window) pr-[12px] pl-[14px]',
        toolbar === null && 'text-(--macos-finder-text)',
        titleBarClassName,
      )}
      contentClassName={cn('bg-(--macos-finder-window)', contentClassName)}
      toolbar={toolbarContent}
      sidebar={sidebar && <div className={LIGHT_SCHEME}>{sidebar}</div>}
    >
      <div className={LIGHT_SCHEME}>{children}</div>
    </Window>
  )
}

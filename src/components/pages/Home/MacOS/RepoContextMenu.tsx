import { useEffect, useRef } from 'react'
import { Code, ExternalLink, Lock, Play } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import type { Point } from '@/logic/macos/windowBounds/windowBounds'
import type { RepoSummary } from '@/types/repo'

type RepoContextMenuProps = {
  repo: RepoSummary
  position: Point
  onOpenInVSCode: () => void
  isRunnable: boolean
  onRun: () => void
  onOpenOnGitHub: () => void
  onClose: () => void
}

export const REPO_CONTEXT_MENU_SIZE = { width: 250, height: 96 }

const ITEM =
  'group flex h-[22px] w-full cursor-pointer items-center gap-[8px] rounded-[5px] px-[9px] text-left whitespace-nowrap outline-none hover:bg-(--macos-context-menu-highlight) hover:text-(--macos-context-menu-highlight-text) focus-visible:bg-(--macos-context-menu-highlight) focus-visible:text-(--macos-context-menu-highlight-text) disabled:cursor-default disabled:text-(--macos-context-menu-muted) disabled:hover:bg-transparent disabled:hover:text-(--macos-context-menu-muted)'
const ICON = 'size-[14px] shrink-0 opacity-80'

// Menu maison, comme MenuBarMenu : un menu de shadcn sortirait par son portail du plan de l'écran 3D.
export default function RepoContextMenu({
  repo,
  position,
  onOpenInVSCode,
  isRunnable,
  onRun,
  onOpenOnGitHub,
  onClose,
}: RepoContextMenuProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].repos
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', closeOutside, true)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside, true)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  // Projet sans code (repo privé d'une autre équipe) : ni VS Code ni GitHub, seulement Exécuter.
  const hasCode = repo.githubUrl !== ''

  const run = (action: () => void) => () => {
    action()
    onClose()
  }

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={repo.name}
      style={{ left: position.x, top: position.y, width: REPO_CONTEXT_MENU_SIZE.width }}
      className="absolute z-50 flex flex-col rounded-[10px] border border-(--macos-context-menu-border) bg-(--macos-context-menu-bg) p-[5px] text-[13px] text-(--macos-context-menu-text) shadow-(--macos-context-menu-shadow) backdrop-blur-[30px] backdrop-saturate-[1.8]"
    >
      <button type="button" role="menuitem" autoFocus disabled={!hasCode} onClick={run(onOpenInVSCode)} className={ITEM}>
        <Code strokeWidth={2} className={ICON} />
        {texts.openInVSCode}
      </button>
      <div role="separator" className="mx-[9px] my-[5px] h-px bg-(--macos-context-menu-separator)" />
      <button
        type="button"
        role="menuitem"
        disabled={!isRunnable}
        onClick={run(onRun)}
        className={ITEM}
      >
        <Play strokeWidth={2} className={ICON} />
        {texts.run}
      </button>
      <button type="button" role="menuitem" disabled={!hasCode} onClick={run(onOpenOnGitHub)} className={ITEM}>
        <ExternalLink strokeWidth={2} className={ICON} />
        <span className="flex-1">{texts.openOnGitHub}</span>
        {repo.visibility === 'private' && (
          <span className="flex items-center gap-[3px] text-[11px] text-(--macos-context-menu-muted) group-hover:text-inherit group-focus-visible:text-inherit">
            <Lock strokeWidth={2.2} className="size-[10px]" />
            {texts.private}
          </span>
        )}
      </button>
    </div>
  )
}

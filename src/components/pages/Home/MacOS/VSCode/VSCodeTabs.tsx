import { X } from 'lucide-react'
import VSCodeFileIcon from '@/components/pages/Home/MacOS/VSCode/VSCodeFileIcon'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { fileName } from '@/logic/macos/vscodeWorkspace/vscodeWorkspace'

type VSCodeTabsProps = {
  paths: string[]
  activePath: string | null
  onSelect: (path: string) => void
  onClose: (path: string) => void
}

export default function VSCodeTabs({ paths, activePath, onSelect, onClose }: VSCodeTabsProps) {
  const { locale } = useLocale()
  const closeLabel = MACOS[locale].vscode.closeTab

  return (
    <div role="tablist" className="flex h-[35px] shrink-0 overflow-x-auto bg-(--macos-vscode-tab) [scrollbar-width:none]">
      {paths.map((path) => {
        const isActive = path === activePath
        return (
          <div
            key={path}
            role="tab"
            aria-selected={isActive}
            title={path}
            onClick={() => onSelect(path)}
            onAuxClick={(event) => event.button === 1 && onClose(path)}
            className={cn(
              'group relative flex h-full shrink-0 cursor-pointer items-center gap-[6px] border-r border-b border-(--macos-vscode-border) pr-[6px] pl-[10px] text-(--macos-vscode-muted)',
              isActive &&
                'border-b-transparent bg-(--macos-vscode-tab-active) text-(--macos-vscode-fg-active) before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-(--macos-vscode-accent)',
            )}
          >
            <VSCodeFileIcon path={path} />
            <span>{fileName(path)}</span>
            <button
              type="button"
              aria-label={`${closeLabel} ${fileName(path)}`}
              onClick={(event) => {
                event.stopPropagation()
                onClose(path)
              }}
              className={cn(
                'grid size-[20px] cursor-pointer place-items-center rounded-[4px] opacity-0 group-hover:opacity-100 hover:bg-(--macos-vscode-hover) focus-visible:opacity-100',
                isActive && 'opacity-100',
              )}
            >
              <X strokeWidth={1.8} className="size-[14px]" />
            </button>
          </div>
        )
      })}
      <div className="flex-1 border-b border-(--macos-vscode-border)" />
    </div>
  )
}

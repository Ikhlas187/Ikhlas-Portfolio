import { ChevronDown, Ellipsis, LoaderCircle } from 'lucide-react'
import VSCodeTreeItem from '@/components/pages/Home/MacOS/VSCode/VSCodeTreeItem'
import type { LoadStatus } from '@/components/pages/Home/MacOS/MacReposProvider'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import type { RepoTreeDir } from '@/logic/macos/repoTree/repoTree'

type VSCodeExplorerProps = {
  repoName: string | null
  tree: RepoTreeDir | null
  status: LoadStatus | null
  expanded: ReadonlySet<string>
  activePath: string | null
  onToggle: (path: string) => void
  onOpen: (path: string) => void
}

export default function VSCodeExplorer({ repoName, tree, status, expanded, activePath, onToggle, onOpen }: VSCodeExplorerProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].vscode

  return (
    <aside className="flex w-[250px] shrink-0 flex-col border-r border-(--macos-vscode-border) bg-(--macos-vscode-sidebar) text-[13px] text-(--macos-vscode-fg)">
      <div className="flex h-[35px] shrink-0 items-center justify-between pr-[8px] pl-[20px] text-[11px] tracking-[0.04em] uppercase">
        <span>{texts.explorer}</span>
        <Ellipsis aria-hidden="true" strokeWidth={1.8} className="size-[16px] text-(--macos-vscode-icon)" />
      </div>
      {repoName ? (
        <>
          <p className="flex h-[22px] shrink-0 items-center gap-[2px] px-[2px] text-[11px] font-bold tracking-[0.02em] uppercase">
            <ChevronDown aria-hidden="true" strokeWidth={1.8} className="size-[16px]" />
            <span className="truncate">{repoName}</span>
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:var(--macos-vscode-selected)_transparent]">
            {tree ? (
              <ul role="tree" aria-label={repoName}>
                {tree.children.map((node) => (
                  <VSCodeTreeItem
                    key={node.path}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    activePath={activePath}
                    onToggle={onToggle}
                    onOpen={onOpen}
                  />
                ))}
              </ul>
            ) : (
              <p role="status" className="flex items-center gap-[6px] px-[20px] py-[8px] text-(--macos-vscode-muted)">
                {status === 'error' ? (
                  texts.loadError
                ) : (
                  <>
                    <LoaderCircle strokeWidth={2} className="size-[14px] animate-spin" />
                    {texts.loading}
                  </>
                )}
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="px-[20px] py-[8px] text-(--macos-vscode-muted)">{texts.noFolder}</p>
      )}
    </aside>
  )
}

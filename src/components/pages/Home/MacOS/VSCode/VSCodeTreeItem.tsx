import { ChevronRight } from 'lucide-react'
import VSCodeFileIcon from '@/components/pages/Home/MacOS/VSCode/VSCodeFileIcon'
import { cn } from '@/lib/utils'
import type { RepoTreeNode } from '@/logic/macos/repoTree/repoTree'

type VSCodeTreeItemProps = {
  node: RepoTreeNode
  depth: number
  expanded: ReadonlySet<string>
  activePath: string | null
  onToggle: (path: string) => void
  onOpen: (path: string) => void
}

const ROW =
  'flex h-[22px] w-full cursor-pointer items-center gap-[4px] pr-[8px] text-left whitespace-nowrap outline-none hover:bg-(--macos-vscode-hover) focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-(--macos-vscode-accent)'

// Une ligne de l'explorateur ; un dossier déplié rend ses enfants en dessous, avec le guide d'indentation.
export default function VSCodeTreeItem({ node, depth, expanded, activePath, onToggle, onOpen }: VSCodeTreeItemProps) {
  const indent = { paddingLeft: 8 + depth * 8 }

  if (node.kind === 'file') {
    const isActive = node.path === activePath
    return (
      <li role="treeitem" aria-selected={isActive}>
        <button
          type="button"
          style={indent}
          onClick={() => onOpen(node.path)}
          className={cn(ROW, isActive && 'bg-(--macos-vscode-selected) text-(--macos-vscode-fg-active)')}
        >
          <span className="w-[16px] shrink-0" />
          <VSCodeFileIcon path={node.path} />
          <span className="truncate">{node.name}</span>
        </button>
      </li>
    )
  }

  const isExpanded = expanded.has(node.path)
  return (
    <li role="treeitem" aria-expanded={isExpanded}>
      <button type="button" style={indent} onClick={() => onToggle(node.path)} className={ROW}>
        <ChevronRight
          strokeWidth={1.8}
          className={cn('size-[16px] shrink-0 text-(--macos-vscode-fg) transition-transform duration-100', isExpanded && 'rotate-90')}
        />
        <span className="truncate">{node.name}</span>
      </button>
      {isExpanded && (
        <ul role="group" className="relative">
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px bg-(--macos-vscode-border)"
            style={{ left: 8 + depth * 8 + 8 }}
          />
          {node.children.map((child) => (
            <VSCodeTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              activePath={activePath}
              onToggle={onToggle}
              onOpen={onOpen}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

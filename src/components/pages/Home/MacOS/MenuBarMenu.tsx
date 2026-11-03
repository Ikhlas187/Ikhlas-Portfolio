import { Fragment } from 'react'
import type { GiantSurMenuItem, MenuAction } from '@/data/giantSur'

type MenuBarMenuProps = {
  items: GiantSurMenuItem[]
  onClose: () => void
  onSelect: (action: MenuAction) => void
}

// Menu maison plutôt que le DropdownMenu de shadcn : son portail et son positionnement flottant
// sortent du plan de l'écran quand le bureau est affiché en CSS 3D sur le MacBook.
export default function MenuBarMenu({ items, onClose, onSelect }: MenuBarMenuProps) {
  return (
    <div
      role="menu"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.key === 'Escape' && onClose()}
      className="absolute top-[calc(100%+3px)] left-0 z-10 flex min-w-[220px] flex-col rounded-[9px] border border-(--macos-glass-border) bg-(--macos-glass-menu) p-[5px] text-[13px] shadow-(--macos-shadow-menu) backdrop-blur-2xl"
    >
      {items.map((item, index) => (
        <Fragment key={item.title}>
          <button
            type="button"
            role="menuitem"
            autoFocus={index === 0}
            onClick={() => (item.action ? onSelect(item.action) : onClose())}
            className="group flex h-[24px] cursor-pointer items-center justify-between gap-[32px] rounded-[5px] px-[10px] text-left whitespace-nowrap outline-none hover:bg-(--macos-selection) hover:text-(--macos-icon-glyph) focus-visible:bg-(--macos-selection)"
          >
            <span>{item.title}</span>
            {item.rightLabel && (
              <span className="text-(--macos-text-muted) group-hover:text-(--macos-icon-glyph)">{item.rightLabel}</span>
            )}
          </button>
          {item.hasSeparator && <div role="separator" className="mx-[10px] my-[5px] h-px bg-(--macos-separator)" />}
        </Fragment>
      ))}
    </div>
  )
}

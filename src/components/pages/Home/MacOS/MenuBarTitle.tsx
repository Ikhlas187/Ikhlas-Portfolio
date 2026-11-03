import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { GiantSurMenu, MenuAction } from '@/data/giantSur'
import MenuBarMenu from '@/components/pages/Home/MacOS/MenuBarMenu'

type MenuBarTitleProps = {
  menu: GiantSurMenu
  activeMenuId: string
  onToggleMenu: (menuId: string) => void
  onHoverMenu: (menuId: string) => void
  onCloseMenu: () => void
  onSelect: (action: MenuAction) => void
  ariaLabel?: string
  className?: string
  children: ReactNode
}

export default function MenuBarTitle({
  menu,
  activeMenuId,
  onToggleMenu,
  onHoverMenu,
  onCloseMenu,
  onSelect,
  ariaLabel,
  className,
  children,
}: MenuBarTitleProps) {
  const isOpen = activeMenuId === menu.id

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onToggleMenu(menu.id)
  }

  const select = (action: MenuAction) => {
    onCloseMenu()
    onSelect(action)
  }

  return (
    <div className="relative h-full" onPointerEnter={() => onHoverMenu(menu.id)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={handleClick}
        className={cn(
          'flex h-full cursor-pointer items-center rounded-[5px] px-[10px]',
          isOpen && 'bg-(--macos-pressed)',
          className,
        )}
      >
        {children}
      </button>
      {isOpen && <MenuBarMenu items={menu.items} onClose={onCloseMenu} onSelect={select} />}
    </div>
  )
}

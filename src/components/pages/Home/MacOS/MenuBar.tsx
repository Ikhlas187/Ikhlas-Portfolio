import { BatteryFull, Search, SlidersHorizontal, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import AppleLogo from '@/components/pages/Home/MacOS/AppleLogo'
import MenuBarClock from '@/components/pages/Home/MacOS/MenuBarClock'
import MenuBarTitle from '@/components/pages/Home/MacOS/MenuBarTitle'
import { GIANT_SUR, type GiantSurMenu, type MenuAction } from '@/data/giantSur'
import { useLocale } from '@/lib/LocaleProvider'

type MenuBarProps = {
  activeMenuId: string
  onToggleMenu: (menuId: string) => void
  onHoverMenu: (menuId: string) => void
  onCloseMenu: () => void
  activeAppName: string
  onSelect: (action: MenuAction) => void
  isControlCenterOpen: boolean
  onToggleControlCenter: () => void
}

const STATUS_ITEM = 'flex h-full items-center px-[8px]'

function withAppName(menu: GiantSurMenu, appName: string): GiantSurMenu {
  const fill = (text: string) => text.replaceAll('{app}', appName)
  return { ...menu, label: fill(menu.label), items: menu.items.map((item) => ({ ...item, title: fill(item.title) })) }
}

export default function MenuBar({
  activeMenuId,
  onToggleMenu,
  onHoverMenu,
  onCloseMenu,
  activeAppName,
  onSelect,
  isControlCenterOpen,
  onToggleControlCenter,
}: MenuBarProps) {
  const { locale } = useLocale()
  const { appleMenu, appMenu, appMenus, status } = GIANT_SUR[locale]
  const currentAppMenu = withAppName(appMenu, activeAppName)
  const titleProps = { activeMenuId, onToggleMenu, onHoverMenu, onCloseMenu, onSelect }

  return (
    <header
      onClick={onCloseMenu}
      className="absolute inset-x-0 top-0 z-10 flex h-[32px] items-center justify-between bg-transparent px-[8px] font-sans text-[13px] leading-[normal] text-(--macos-text) [text-shadow:var(--macos-text-shadow)]"
    >
      <nav className="flex h-[26px] items-center">
        <MenuBarTitle {...titleProps} menu={appleMenu} ariaLabel={appleMenu.ariaLabel} className="px-[11px]">
          <AppleLogo className="size-[15px]" />
        </MenuBarTitle>
        <MenuBarTitle {...titleProps} menu={currentAppMenu}>
          <span className="font-bold">{currentAppMenu.label}</span>
        </MenuBarTitle>
        {appMenus.map((menu) => (
          <MenuBarTitle key={menu.id} {...titleProps} menu={menu}>
            {menu.label}
          </MenuBarTitle>
        ))}
      </nav>

      <div className="flex h-[26px] items-center">
        <span className={STATUS_ITEM} title={status.battery}>
          <span className="mr-[6px] text-[12px]">{status.batteryLevel}</span>
          <BatteryFull aria-label={status.battery} strokeWidth={1.8} className="size-[20px]" />
        </span>
        <span className={STATUS_ITEM}>
          <Wifi aria-label={status.wifi} strokeWidth={2} className="size-[16px]" />
        </span>
        <span className={STATUS_ITEM}>
          <Search aria-label={status.search} strokeWidth={2} className="size-[15px]" />
        </span>
        <button
          type="button"
          data-control-center-toggle
          aria-label={status.controlCenter}
          aria-expanded={isControlCenterOpen}
          onClick={onToggleControlCenter}
          className={cn(STATUS_ITEM, 'cursor-pointer rounded-[5px]', isControlCenterOpen && 'bg-(--macos-pressed)')}
        >
          <SlidersHorizontal aria-hidden="true" strokeWidth={2} className="size-[15px]" />
        </button>
        <MenuBarClock />
      </div>
    </header>
  )
}

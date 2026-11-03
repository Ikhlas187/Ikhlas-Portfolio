import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/LocaleProvider'
import { GIANT_SUR, type DockApp } from '@/data/giantSur'
import { dockWidths } from '@/logic/giantSur/dockWidths/dockWidths'
import DockItem from '@/components/pages/Home/MacOS/DockItem'
import DockLink from '@/components/pages/Home/MacOS/DockLink'

type DockProps = {
  runningApps: ReadonlySet<string>
  launchingApps: ReadonlySet<string>
  onClickDock: () => void
  onActivate: (app: DockApp) => void
}

export default function Dock({ runningApps, launchingApps, onClickDock, onActivate }: DockProps) {
  const { locale } = useLocale()
  const { dockItems, dockLinks, dockLabel } = GIANT_SUR[locale]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const widths = dockWidths(dockItems.length + dockLinks.length, hoveredIndex)

  return (
    // Entrée « dock-appear » de macweb.dev : 0,5 s, cubic-bezier(.16, 1, .3, 1).
    <motion.nav
      aria-label={dockLabel}
      data-dock
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 bottom-2 left-0 z-10 m-auto flex h-16 w-max flex-row items-end justify-center rounded-[0.75rem] bg-(--macos-dock-bg) px-2"
    >
      {dockItems.map((item, index) => {
        const { app } = item
        return (
          <DockItem
            key={item.id}
            app={app}
            title={item.title}
            logo={item.logo}
            width={widths[index]}
            isRunning={runningApps.has(app)}
            isLaunching={launchingApps.has(app)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              onClickDock()
              onActivate(app)
            }}
          />
        )
      })}
      <span aria-hidden="true" className="mx-[4px] mb-[10px] h-[44px] w-px self-end bg-(--macos-dock-separator)" />
      {dockLinks.map((link, index) => (
        <DockLink
          key={link.id}
          id={link.id}
          title={link.title}
          href={link.href}
          width={widths[dockItems.length + index]}
          onMouseEnter={() => setHoveredIndex(dockItems.length + index)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}
    </motion.nav>
  )
}

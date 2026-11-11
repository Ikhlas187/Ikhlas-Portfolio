import { DOCK_LINK_LOGOS } from '@/components/pages/Home/MacOS/dockLinkLogos'
import type { DockLinkId } from '@/data/giantSur'
import { cn } from '@/lib/utils'

type DockLinkProps = {
  id: DockLinkId
  title: string
  href: string
  width: string
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function DockLink({ id, title, href, width, onMouseEnter, onMouseLeave }: DockLinkProps) {
  const { Logo, className } = DOCK_LINK_LOGOS[id]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      title={title}
      className="relative block w-16 cursor-pointer p-2 align-bottom transition-all duration-200 ease-[ease]"
      style={{ width }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="flex aspect-square w-full items-center justify-center rounded-[22%] bg-linear-to-b from-(--macos-dock-tile-from) to-(--macos-dock-tile-to) shadow-(--macos-dock-tile-ring)">
        <Logo className={cn('size-[58%]', className)} />
      </span>
    </a>
  )
}
